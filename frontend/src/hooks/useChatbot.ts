'use client';

import { useState } from 'react';
import { api } from '@/lib/api';

export interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    sources?: string[];
    timestamp: Date;
}

export function useChatbot() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    const toggleChat = () => setIsOpen(!isOpen);

    const sendMessage = async (content: string) => {
        if (!content.trim()) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            content,
            timestamp: new Date(),
        };

        setMessages((prev) => [...prev, userMessage]);
        setIsLoading(true);

        try {
            // Mock API call if backend fails or is missing
            let responseData;
            try {
                const res = await api.post('/chatbot/query', { query: content });
                responseData = res.data;
            } catch (err) {
                console.warn("Backend unavailable, using mock response", err);
                await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulate delay
                responseData = {
                    answer: "I am a mock AI assistant. The real backend is not connected yet. I can tell you about organ donation guidelines once connected.",
                    sources: ["Mock Source 1", "Mock Source 2"]
                };
            }

            const botMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: responseData.answer,
                sources: responseData.sources,
                timestamp: new Date(),
            };

            setMessages((prev) => [...prev, botMessage]);
        } catch (error) {
            console.error(error);
            const errorMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: "Sorry, I encountered an error. Please try again.",
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    return {
        messages,
        isLoading,
        isOpen,
        toggleChat,
        sendMessage,
    };
}
