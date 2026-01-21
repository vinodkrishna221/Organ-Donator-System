# Hosting Gemma 3B & Setting Up RAG with Vertex AI

> Complete guide to deploy Gemma 3B and implement RAG for the Organ Donation Platform

---

## Overview

This guide covers:
1. **Hosting Gemma 3B** on Vertex AI Model Garden
2. **Setting up Vector Search** for document embeddings
3. **Building the RAG Pipeline** with Vertex AI
4. **Connecting to our application**

---

## Prerequisites

- Google Cloud account with billing enabled
- Project with Vertex AI API enabled
- `gcloud` CLI installed and authenticated
- Node.js 18+ for backend integration

---

## Part 1: Hosting Gemma 3B on Vertex AI

### Option A: Using Model Garden (Recommended)

Gemma models are available directly in Vertex AI Model Garden:

```bash
# 1. Enable required APIs
gcloud services enable aiplatform.googleapis.com
gcloud services enable compute.googleapis.com

# 2. Set project
gcloud config set project YOUR_PROJECT_ID
```

#### Deploy via Console

1. Go to [Vertex AI Model Garden](https://console.cloud.google.com/vertex-ai/model-garden)
2. Search for "Gemma"
3. Select **Gemma 2 9B** or **Gemma 3B** (when available)
4. Click **Deploy to endpoint**
5. Configure:
   - Machine type: `n1-standard-8` (minimum)
   - GPU: `NVIDIA_L4` or `NVIDIA_T4`
   - Replica count: 1
6. Click **Deploy** (takes 10-15 minutes)

#### Deploy via gcloud CLI (Step-by-Step)

```bash
# ====== STEP 1: Setup Project ======
# Set your project ID
export PROJECT_ID="your-project-id"
export REGION="us-central1"

gcloud config set project $PROJECT_ID

# Enable required APIs
gcloud services enable aiplatform.googleapis.com
gcloud services enable compute.googleapis.com
gcloud services enable storage.googleapis.com

# ====== STEP 2: Create Endpoint ======
# Create a Model endpoint (where the model will be deployed)
gcloud ai endpoints create \
  --display-name="organ-donation-gemma-endpoint" \
  --region=$REGION \
  --format="value(name)"

# Note: Save the endpoint ID from the output
# It will look like: projects/123456/locations/us-central1/endpoints/987654321
export ENDPOINT_ID="YOUR_ENDPOINT_ID_HERE"

# ====== STEP 3: List Available Gemma Models ======
# Find the exact model resource name
gcloud ai models list \
  --region=$REGION \
  --filter="displayName~gemma" \
  --format="table(name, displayName)"

# For Gemma 3 (Recommended):
export MODEL_ID="publishers/google/models/gemma-3-12b-it"

# ====== STEP 4: Deploy Model to Endpoint ======
# Deploy with appropriate machine type
gcloud ai endpoints deploy-model $ENDPOINT_ID \
  --display-name="gemma-3-organ-donation" \
  --model=$MODEL_ID \
  --machine-type=g2-standard-8 \
  --accelerator=type=nvidia-l4,count=1 \
  --region=$REGION \
  --traffic-split=0=100

# This will take 10-20 minutes. Monitor with:
gcloud ai endpoints describe $ENDPOINT_ID \
  --region=$REGION \
  --format="yaml(deployedModels)"

# ====== STEP 5: Test the Deployed Model ======
# Get the endpoint URL
export ENDPOINT_URL="https://${REGION}-aiplatform.googleapis.com/v1/projects/${PROJECT_ID}/locations/${REGION}/endpoints/${ENDPOINT_ID}:predict"

# Test with a sample query
curl -X POST \
  -H "Authorization: Bearer $(gcloud auth print-access-token)" \
  -H "Content-Type: application/json" \
  $ENDPOINT_URL \
  -d '{
    "instances": [{
      "prompt": "What is organ donation?"
    }],
    "parameters": {
      "temperature": 0.7,
      "maxOutputTokens": 256
    }
  }'

# ====== STEP 6: Save Configuration ======
# Add to your .env file:
echo "GEMMA_ENDPOINT_ID=$ENDPOINT_ID" >> .env
echo "GEMMA_ENDPOINT_URL=$ENDPOINT_URL" >> .env
```

#### Machine Type Options

| Machine Type | GPU | VRAM | Cost/Hour | Best For |
|--------------|-----|------|-----------|----------|
| `n1-standard-8` + `T4` | T4 | 16GB | ~$0.35 | Testing, low traffic |
| `g2-standard-8` + `L4` | L4 | 24GB | ~$0.70 | Production, faster inference |
| `a2-highgpu-1g` + `A100` | A100 | 40GB | ~$3.00 | High throughput |

#### Clean Up (When Done Testing)

```bash
# Undeploy model (to stop billing)
DEPLOYED_MODEL_ID=$(gcloud ai endpoints describe $ENDPOINT_ID \
  --region=$REGION \
  --format="value(deployedModels[0].id)")

gcloud ai endpoints undeploy-model $ENDPOINT_ID \
  --deployed-model-id=$DEPLOYED_MODEL_ID \
  --region=$REGION

# Delete endpoint (optional)
gcloud ai endpoints delete $ENDPOINT_ID --region=$REGION
```

### Option B: Self-Hosted on Vertex AI Custom Training

For more control, deploy Gemma using a custom container:

```dockerfile
# Dockerfile for Gemma serving
FROM pytorch/pytorch:2.1.0-cuda12.1-cudnn8-runtime

RUN pip install transformers accelerate flask gunicorn

COPY serve.py /app/serve.py
WORKDIR /app

CMD ["gunicorn", "-b", "0.0.0.0:8080", "serve:app"]
```

```python
# serve.py
from flask import Flask, request, jsonify
from transformers import AutoModelForCausalLM, AutoTokenizer
import torch

app = Flask(__name__)

model_id = "google/gemma-3b-it"  # or gemma-2-9b-it
tokenizer = AutoTokenizer.from_pretrained(model_id)
model = AutoModelForCausalLM.from_pretrained(
    model_id, 
    device_map="auto",
    torch_dtype=torch.float16
)

@app.route('/predict', methods=['POST'])
def predict():
    data = request.json
    prompt = data.get('prompt', '')
    
    inputs = tokenizer(prompt, return_tensors="pt").to(model.device)
    outputs = model.generate(**inputs, max_new_tokens=512)
    response = tokenizer.decode(outputs[0], skip_special_tokens=True)
    
    return jsonify({'response': response})
```

---

## Part 2: Setting Up Vector Search for RAG

### Step 1: Create Embeddings for Knowledge Base

```typescript
// backend/src/services/chatbot/embeddings.ts
import { VertexAI } from '@google-cloud/vertexai';

const vertexAI = new VertexAI({
  project: process.env.GCP_PROJECT_ID!,
  location: process.env.VERTEX_AI_LOCATION || 'us-central1',
});

const embeddingModel = 'text-embedding-004';

export async function generateEmbedding(text: string): Promise<number[]> {
  const model = vertexAI.preview.getGenerativeModel({
    model: embeddingModel,
  });

  const result = await model.embedContent(text);
  return result.embedding.values;
}

export async function generateEmbeddings(texts: string[]): Promise<number[][]> {
  return Promise.all(texts.map(text => generateEmbedding(text)));
}
```

### Step 2: Create Vector Search Index

```bash
# Create a Cloud Storage bucket for embeddings
gsutil mb -l us-central1 gs://YOUR_PROJECT-embeddings

# Create index via gcloud
gcloud ai indexes create \
  --display-name="organ-donation-knowledge" \
  --description="Knowledge base for organ donation chatbot" \
  --metadata-schema-uri="gs://google-cloud-aiplatform/schema/matchingengine/metadata/nearest_neighbor_search_1.0.0.yaml" \
  --index-update-method=STREAM_UPDATE \
  --region=us-central1
```

### Step 3: Index Knowledge Documents

```typescript
// backend/src/scripts/indexKnowledge.ts
import { generateEmbedding } from '../services/chatbot/embeddings.js';
import { loadKnowledgeDocuments } from '../services/chatbot/vectorStore.js';
import { MatchingEngineIndexEndpoint } from '@google-cloud/aiplatform';

async function indexKnowledgeBase() {
  const docsDir = './docs/knowledge';
  const chunks = loadKnowledgeDocuments(docsDir);
  
  console.log(`Processing ${chunks.length} chunks...`);
  
  const datapoints = [];
  
  for (const chunk of chunks) {
    const embedding = await generateEmbedding(chunk.content);
    datapoints.push({
      datapoint_id: chunk.id,
      feature_vector: embedding,
      restricts: [
        { namespace: 'source', allow_list: [chunk.source] }
      ],
    });
  }
  
  // Upsert to Vector Search
  const endpoint = new MatchingEngineIndexEndpoint({
    indexEndpointName: process.env.VECTOR_SEARCH_ENDPOINT!,
  });
  
  await endpoint.upsertDatapoints({ datapoints });
  console.log(`Indexed ${datapoints.length} datapoints`);
}

indexKnowledgeBase();
```

---

## Part 3: Building the RAG Pipeline

### Install Dependencies

```bash
cd backend
npm install @google-cloud/vertexai @google-cloud/aiplatform
```

### Update RAG Pipeline

```typescript
// backend/src/services/chatbot/ragPipeline.ts
import { VertexAI } from '@google-cloud/vertexai';
import { generateEmbedding } from './embeddings.js';
import { SYSTEM_PROMPT, DISCLAIMER } from './promptTemplates.js';

const vertexAI = new VertexAI({
  project: process.env.GCP_PROJECT_ID!,
  location: process.env.VERTEX_AI_LOCATION || 'us-central1',
});

// Use Gemma or Gemini
const MODEL_ID = process.env.USE_GEMMA 
  ? 'gemma-2-9b-it'  // Self-hosted Gemma
  : 'gemini-1.5-flash';  // Managed Gemini

export class RagPipelineVertexAI {
  private model;
  
  constructor() {
    this.model = vertexAI.preview.getGenerativeModel({
      model: MODEL_ID,
      generationConfig: {
        maxOutputTokens: 1024,
        temperature: 0.7,
      },
    });
  }

  async query(question: string): Promise<{
    answer: string;
    sources: string[];
    confidence: 'HIGH' | 'MEDIUM' | 'LOW';
  }> {
    // 1. Generate embedding for the question
    const queryEmbedding = await generateEmbedding(question);
    
    // 2. Search Vector Store for relevant chunks
    const searchResults = await this.searchVectorStore(queryEmbedding);
    
    // 3. Build context from search results
    const context = searchResults
      .map(r => r.content)
      .join('\n\n---\n\n');
    
    const sources = searchResults.map(r => r.source);
    
    // 4. Generate response with Gemma/Gemini
    const prompt = `${SYSTEM_PROMPT}

CONTEXT FROM KNOWLEDGE BASE:
${context}

USER QUESTION:
${question}

Provide a helpful, accurate response based on the context. If the context doesn't contain relevant information, say so.`;

    const result = await this.model.generateContent(prompt);
    const response = result.response.text();
    
    return {
      answer: response + DISCLAIMER,
      sources: [...new Set(sources)],
      confidence: sources.length >= 3 ? 'HIGH' : sources.length > 0 ? 'MEDIUM' : 'LOW',
    };
  }

  private async searchVectorStore(embedding: number[]) {
    // Call Vertex AI Vector Search
    const response = await fetch(
      `https://${process.env.VECTOR_SEARCH_ENDPOINT}/v1/projects/${process.env.GCP_PROJECT_ID}/locations/us-central1/indexEndpoints/${process.env.INDEX_ENDPOINT_ID}:findNeighbors`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${await this.getAccessToken()}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          deployed_index_id: process.env.DEPLOYED_INDEX_ID,
          queries: [{
            datapoint: { feature_vector: embedding },
            neighbor_count: 5,
          }],
        }),
      }
    );
    
    const data = await response.json();
    return data.nearestNeighbors[0].neighbors;
  }
  
  private async getAccessToken() {
    const { GoogleAuth } = await import('google-auth-library');
    const auth = new GoogleAuth();
    const client = await auth.getClient();
    const token = await client.getAccessToken();
    return token.token;
  }
}

export const ragPipeline = new RagPipelineVertexAI();
```

---

## Part 4: Environment Configuration

### Update .env.example

```bash
# GCP / Vertex AI
GCP_PROJECT_ID=your-project-id
VERTEX_AI_LOCATION=us-central1
GOOGLE_APPLICATION_CREDENTIALS=/path/to/service-account.json

# Vector Search
VECTOR_SEARCH_ENDPOINT=xxxxx.us-central1.aiplatform.googleapis.com
INDEX_ENDPOINT_ID=your-index-endpoint-id
DEPLOYED_INDEX_ID=your-deployed-index-id

# Model Selection (optional)
USE_GEMMA=false  # Set to true to use self-hosted Gemma
GEMMA_ENDPOINT=https://your-gemma-endpoint.run.app
```

### Create Service Account

```bash
# Create service account
gcloud iam service-accounts create organ-donation-ai \
  --display-name="Organ Donation AI Service"

# Grant permissions
gcloud projects add-iam-policy-binding YOUR_PROJECT_ID \
  --member="serviceAccount:organ-donation-ai@YOUR_PROJECT_ID.iam.gserviceaccount.com" \
  --role="roles/aiplatform.user"

gcloud projects add-iam-policy-binding YOUR_PROJECT_ID \
  --member="serviceAccount:organ-donation-ai@YOUR_PROJECT_ID.iam.gserviceaccount.com" \
  --role="roles/storage.objectViewer"

# Download key
gcloud iam service-accounts keys create ./service-account.json \
  --iam-account=organ-donation-ai@YOUR_PROJECT_ID.iam.gserviceaccount.com
```

---

## Part 5: Cost Estimates

| Service | Specification | Monthly Cost (approx) |
|---------|---------------|----------------------|
| Gemma 3B Endpoint | n1-standard-4 + T4 GPU | $200-300 |
| Vector Search | 1000 vectors, 768 dims | $50-100 |
| Embeddings API | 1M tokens/month | $0.025 |
| **Alternative: Gemini Flash** | Pay per use | $0.01/1K tokens |

> **Recommendation**: Start with **Gemini 1.5 Flash** for cost efficiency, then move to Gemma for privacy/compliance needs.

---

## Part 6: Quick Start (Gemini - No GPU Required)

For fastest setup, use Gemini instead of Gemma:

```typescript
// Simplest integration - no self-hosting needed
import { VertexAI } from '@google-cloud/vertexai';

const vertexAI = new VertexAI({
  project: process.env.GCP_PROJECT_ID!,
  location: 'us-central1',
});

const model = vertexAI.preview.getGenerativeModel({
  model: 'gemini-1.5-flash',
});

async function chat(question: string, context: string) {
  const result = await model.generateContent(`
    You are an organ donation assistant.
    
    Context: ${context}
    
    Question: ${question}
  `);
  
  return result.response.text();
}
```

---

## Summary

| Approach | Complexity | Cost | Best For |
|----------|------------|------|----------|
| **Gemini API** | Low | Pay-per-use | MVP, quick start |
| **Gemma on Model Garden** | Medium | $200-400/mo | Production, compliance |
| **Self-hosted Gemma** | High | Variable | Full control, on-prem |

**Recommended Path:**
1. Start with **Gemini 1.5 Flash** (already working in codebase)
2. Add **Vector Search** for better RAG
3. Migrate to **Gemma** when needed for compliance/privacy
