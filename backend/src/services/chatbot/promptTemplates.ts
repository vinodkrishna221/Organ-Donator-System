/**
 * Prompt Templates for RAG Chatbot
 * With guardrails to only answer organ donation related questions
 */

export const SYSTEM_PROMPT = `You are an AI assistant for India's organ donation platform. 

YOUR SCOPE - You ONLY answer questions about:
✅ Organ donation processes and procedures
✅ NOTTO, ROTTO, SOTTO organizations
✅ Transplantation of Human Organs Act (THOA)
✅ Eligibility criteria for donors and recipients
✅ Living vs deceased donation
✅ Blood type compatibility
✅ Transplant waiting lists
✅ Hospital registration for transplants
✅ Consent forms and legal requirements
✅ Post-transplant care information

YOU MUST REFUSE to answer questions about:
❌ General knowledge (time, weather, news, sports, etc.)
❌ Other medical conditions unrelated to organ transplants
❌ Personal advice, entertainment, or casual chat
❌ Coding, technology, or non-medical topics
❌ Any harmful, illegal, or unethical topics

RESPONSE RULES:
1. Be accurate and cite official sources when possible
2. Be compassionate - users may be going through difficult times
3. Do NOT provide specific medical advice - recommend consulting healthcare professionals
4. If unsure, recommend contacting NOTTO helpline: 1800-103-7100
5. Keep responses concise but informative
6. For off-topic questions, politely decline and redirect to organ donation topics`;

export const RAG_PROMPT_TEMPLATE = `You are an organ donation assistant. Use the following context to answer ONLY if the question is about organ donation.

CONTEXT FROM KNOWLEDGE BASE:
{context}

USER QUESTION:
{question}

INSTRUCTIONS:
1. FIRST check if the question is about organ donation, transplants, NOTTO, or related topics
2. If OFF-TOPIC (like time, weather, general chat): Respond with the off-topic message
3. If ON-TOPIC: Answer based on the context provided
4. Be empathetic and supportive
5. Always add the disclaimer at the end

RESPONSE:`;

export const OFF_TOPIC_RESPONSE = `I'm sorry, but I can only help with questions about organ donation and transplantation in India. 

I can assist you with:
• Organ donation process and eligibility
• NOTTO, ROTTO, SOTTO information
• Living and deceased donation
• Transplant waiting lists
• Legal requirements (THOA)
• Hospital registration

Please ask me something related to organ donation, or contact NOTTO helpline: 1800-103-7100 for assistance.`;

export const DISCLAIMER = `

---
**Disclaimer**: This information is for general guidance only and does not constitute medical or legal advice. Please consult healthcare professionals for medical decisions and contact NOTTO (1800-103-7100) for official information.`;

/**
 * Keywords that indicate an on-topic question
 */
const ON_TOPIC_KEYWORDS = [
    'organ', 'donation', 'donate', 'donor', 'recipient', 'transplant',
    'kidney', 'liver', 'heart', 'lung', 'pancreas', 'cornea',
    'notto', 'rotto', 'sotto', 'thoa',
    'blood type', 'blood group', 'compatibility', 'matching',
    'waiting list', 'waitlist', 'eligibility', 'eligible',
    'brain death', 'deceased', 'living donor', 'consent',
    'hospital', 'transplant center', 'registration',
    'medical', 'health history', 'tissue', 'organ trade',
    'hla', 'antigen', 'rejection', 'immunosuppressant'
];

/**
 * Keywords that indicate an off-topic question
 */
const OFF_TOPIC_KEYWORDS = [
    'time', 'weather', 'news', 'sport', 'movie', 'music',
    'joke', 'story', 'poem', 'recipe', 'food',
    'code', 'programming', 'javascript', 'python',
    'game', 'play', 'fun', 'hello', 'hi there',
    'who are you', 'what are you', 'your name',
    'calculate', 'math', 'solve', 'equation'
];

/**
 * Check if a question is on-topic (related to organ donation)
 */
export function isOnTopic(question: string): boolean {
    const lowerQuestion = question.toLowerCase();

    // Check for off-topic keywords first
    for (const keyword of OFF_TOPIC_KEYWORDS) {
        if (lowerQuestion.includes(keyword) &&
            !lowerQuestion.includes('organ') &&
            !lowerQuestion.includes('donat')) {
            return false;
        }
    }

    // Check for on-topic keywords
    for (const keyword of ON_TOPIC_KEYWORDS) {
        if (lowerQuestion.includes(keyword)) {
            return true;
        }
    }

    // Generic medical/health questions might be on-topic
    if (lowerQuestion.includes('health') ||
        lowerQuestion.includes('medical') ||
        lowerQuestion.includes('hospital')) {
        return true;
    }

    // Default: consider off-topic if no organ donation keywords found
    // Short greetings are off-topic
    if (question.trim().split(' ').length <= 3) {
        return false;
    }

    // Longer questions without keywords are borderline - let the model decide
    return true;
}

/**
 * Build the RAG prompt with context
 */
export function buildRagPrompt(question: string, contextChunks: string[]): string {
    const context = contextChunks.join('\n\n---\n\n');

    return RAG_PROMPT_TEMPLATE
        .replace('{context}', context || 'No relevant context found.')
        .replace('{question}', question);
}

/**
 * Format the response with disclaimer
 */
export function formatResponse(response: string, sources: string[]): {
    answer: string;
    sources: string[];
    confidence: 'HIGH' | 'MEDIUM' | 'LOW';
} {
    // Determine confidence based on response content
    let confidence: 'HIGH' | 'MEDIUM' | 'LOW' = 'MEDIUM';

    if (sources.length >= 3) {
        confidence = 'HIGH';
    } else if (sources.length === 0) {
        confidence = 'LOW';
    }

    return {
        answer: response + DISCLAIMER,
        sources: [...new Set(sources)], // Deduplicate
        confidence,
    };
}

