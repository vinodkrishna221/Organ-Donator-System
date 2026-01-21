import fs from 'fs';
import path from 'path';

export interface TextChunk {
    id: string;
    content: string;
    source: string;
    metadata: Record<string, unknown>;
}

export interface SearchResult {
    chunk: TextChunk;
    score: number;
}

/**
 * Simple Vector Store for RAG
 * In production, use Vertex AI Vector Search or Pinecone
 * This is a simple in-memory implementation for MVP
 */
export class VectorStore {
    private chunks: TextChunk[] = [];

    async addChunks(chunks: TextChunk[]): Promise<void> {
        this.chunks.push(...chunks);
        console.log(`Added ${chunks.length} chunks to vector store`);
    }

    /**
     * Simple keyword-based search (MVP)
     * In production, use embeddings + cosine similarity
     */
    async search(query: string, topK: number = 5): Promise<SearchResult[]> {
        const queryWords = query.toLowerCase().split(/\s+/);

        const scoredChunks = this.chunks.map(chunk => {
            const content = chunk.content.toLowerCase();
            let score = 0;

            for (const word of queryWords) {
                if (word.length > 3 && content.includes(word)) {
                    score += 1;
                }
            }

            // Boost exact phrase matches
            if (content.includes(query.toLowerCase())) {
                score += 5;
            }

            return { chunk, score };
        });

        return scoredChunks
            .filter(r => r.score > 0)
            .sort((a, b) => b.score - a.score)
            .slice(0, topK);
    }

    getChunkCount(): number {
        return this.chunks.length;
    }

    clear(): void {
        this.chunks = [];
    }
}

/**
 * Load and chunk knowledge documents
 */
export function loadKnowledgeDocuments(docsDir: string): TextChunk[] {
    const chunks: TextChunk[] = [];

    if (!fs.existsSync(docsDir)) {
        console.warn(`Knowledge directory not found: ${docsDir}`);
        return chunks;
    }

    const files = fs.readdirSync(docsDir).filter(f => f.endsWith('.md'));

    for (const file of files) {
        const filePath = path.join(docsDir, file);
        const content = fs.readFileSync(filePath, 'utf-8');
        const documentChunks = chunkDocument(content, file);
        chunks.push(...documentChunks);
    }

    return chunks;
}

/**
 * Split document into chunks
 * Uses simple paragraph-based chunking
 */
function chunkDocument(content: string, source: string): TextChunk[] {
    const chunks: TextChunk[] = [];

    // Split by headers and double newlines
    const sections = content.split(/\n#{1,3}\s+/).filter(s => s.trim());

    let chunkId = 0;
    for (const section of sections) {
        // Further split large sections
        const paragraphs = section.split(/\n\n+/).filter(p => p.trim());

        let currentChunk = '';
        for (const para of paragraphs) {
            if ((currentChunk + para).length > 500) {
                if (currentChunk) {
                    chunks.push({
                        id: `${source}-${chunkId++}`,
                        content: currentChunk.trim(),
                        source,
                        metadata: { chunkIndex: chunkId },
                    });
                }
                currentChunk = para;
            } else {
                currentChunk += (currentChunk ? '\n\n' : '') + para;
            }
        }

        if (currentChunk.trim()) {
            chunks.push({
                id: `${source}-${chunkId++}`,
                content: currentChunk.trim(),
                source,
                metadata: { chunkIndex: chunkId },
            });
        }
    }

    return chunks;
}

// Global vector store instance
export const vectorStore = new VectorStore();
