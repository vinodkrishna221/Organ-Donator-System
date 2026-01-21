import { vectorStore, loadKnowledgeDocuments, SearchResult } from './vectorStore.js';
import { buildRagPrompt, formatResponse, isOnTopic, OFF_TOPIC_RESPONSE, DISCLAIMER } from './promptTemplates.js';
import path from 'path';
import ollama from 'ollama';

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

        // Step 3: Build prompt
        const prompt = buildRagPrompt(question, contextChunks);

        // Step 4: Generate response using Ollama
        const answer = await this.generateResponse(prompt);

        // Step 5: Format response with sources and confidence
        return formatResponse(answer, sources);
    }

    /**
     * Generate response using Ollama
     */
    private async generateResponse(prompt: string): Promise<string> {
        try {
            const response = await ollama.chat({
                model: process.env.OLLAMA_MODEL || 'llama3',
                messages: [{ role: 'user', content: prompt }],
            });

            return response.message.content;
        } catch (error) {
            console.error('Ollama generation failed:', error);
            // Fallback to a safe error message if Ollama is down/fails
            return "I apologize, but I'm having trouble connecting to my AI brain right now. However, I can tell you that for organ donation related queries, you can always visit the NOTTO website at notto.gov.in.";
        }
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
