import { vectorStore, loadKnowledgeDocuments, SearchResult } from './vectorStore.js';
import { buildRagPrompt, formatResponse, isOnTopic, OFF_TOPIC_RESPONSE, DISCLAIMER } from './promptTemplates.js';
import path from 'path';

export interface ChatbotResponse {
    answer: string;
    sources: string[];
    confidence: 'HIGH' | 'MEDIUM' | 'LOW';
}

export interface ChatMessage {
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
}

/**
 * RAG Pipeline for Organ Donation Chatbot
 * With guardrails to only answer organ donation related questions
 */
export class RagPipeline {
    private initialized = false;

    /**
     * Initialize the pipeline (load knowledge base)
     */
    async initialize(): Promise<void> {
        if (this.initialized) return;

        const docsDir = path.join(process.cwd(), 'docs', 'knowledge');
        const chunks = loadKnowledgeDocuments(docsDir);
        await vectorStore.addChunks(chunks);

        this.initialized = true;
        console.log(`RAG Pipeline initialized with ${vectorStore.getChunkCount()} chunks`);
    }

    /**
     * Process a user query
     */
    async query(question: string): Promise<ChatbotResponse> {
        // Ensure initialized
        await this.initialize();

        // ========== GUARDRAIL: Check if question is on-topic ==========
        if (!isOnTopic(question)) {
            return {
                answer: OFF_TOPIC_RESPONSE + DISCLAIMER,
                sources: [],
                confidence: 'HIGH', // High confidence it's off-topic
            };
        }

        // Step 1: Search for relevant context
        const searchResults = await vectorStore.search(question, 5);

        // Step 2: Extract context chunks and sources
        const contextChunks = searchResults.map(r => r.chunk.content);
        const sources = searchResults.map(r => r.chunk.source);

        // Step 3: Build prompt (for production, this would go to Gemini/GPT)
        const prompt = buildRagPrompt(question, contextChunks);

        // Step 4: Generate response (MVP: simple keyword-based response)
        const answer = this.generateSimpleResponse(question, searchResults);

        // Step 5: Format response with sources and confidence
        return formatResponse(answer, sources);
    }

    /**
     * Simple response generation for MVP
     * In production, this would call Vertex AI Gemini
     */
    private generateSimpleResponse(question: string, results: SearchResult[]): string {
        if (results.length === 0) {
            return `I don't have specific information about that in my knowledge base. 

For organ donation queries, I recommend:
1. Visiting the NOTTO website: https://notto.gov.in
2. Calling the NOTTO helpline: 1800-103-7100
3. Contacting your nearest transplant hospital

How else can I help you?`;
        }

        // Return the most relevant context as the answer
        const topResult = results[0];
        const additionalContext = results.length > 1
            ? `\n\nAdditional information:\n${results[1].chunk.content.substring(0, 300)}...`
            : '';

        return `Based on the information in our knowledge base:\n\n${topResult.chunk.content}${additionalContext}`;
    }

    /**
     * Get conversation history (for session management)
     * In production, this would use a database
     */
    private conversationHistory: Map<string, ChatMessage[]> = new Map();

    getHistory(sessionId: string): ChatMessage[] {
        return this.conversationHistory.get(sessionId) || [];
    }

    addToHistory(sessionId: string, message: ChatMessage): void {
        const history = this.getHistory(sessionId);
        history.push(message);
        this.conversationHistory.set(sessionId, history);

        // Keep only last 20 messages
        if (history.length > 20) {
            history.shift();
        }
    }

    clearHistory(sessionId: string): void {
        this.conversationHistory.delete(sessionId);
    }
}

export const ragPipeline = new RagPipeline();
