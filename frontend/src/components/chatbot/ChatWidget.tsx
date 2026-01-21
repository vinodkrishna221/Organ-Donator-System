'use client';

import { MessageCircle, X, Send, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardFooter, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useChatbot, Message } from '@/hooks/useChatbot';
import { useState, useRef, useEffect } from 'react';

export function ChatWidget() {
    const { isOpen, toggleChat, messages, sendMessage, isLoading } = useChatbot();
    const [input, setInput] = useState('');
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (input.trim() && !isLoading) {
            sendMessage(input);
            setInput('');
        }
    };

    if (!isOpen) {
        return (
            <Button
                className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg z-50"
                onClick={toggleChat}
            >
                <MessageCircle className="h-6 w-6" />
            </Button>
        );
    }

    return (
        <Card className="fixed bottom-6 right-6 w-80 md:w-96 h-[500px] shadow-xl flex flex-col z-50">
            <CardHeader className="flex flex-row items-center justify-between p-4 border-b">
                <div className="flex items-center space-x-2">
                    <Avatar className="h-8 w-8">
                        <AvatarImage src="/bot-avatar.png" />
                        <AvatarFallback>AI</AvatarFallback>
                    </Avatar>
                    <div>
                        <CardTitle className="text-sm font-bold">Organ Donation Assistant</CardTitle>
                        <p className="text-xs text-muted-foreground">Ask about guidelines & process</p>
                    </div>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={toggleChat}>
                    <X className="h-4 w-4" />
                </Button>
            </CardHeader>

            <CardContent className="flex-1 p-0 overflow-hidden">
                <div className="h-full overflow-y-auto p-4 space-y-4" ref={scrollRef}>
                    {messages.length === 0 && (
                        <div className="text-center text-sm text-muted-foreground mt-10">
                            <p>👋 Hello! I can answer your questions about organ donation, NOTTO guidelines, and more.</p>
                        </div>
                    )}
                    {messages.map((msg) => (
                        <ChatMessageItem key={msg.id} message={msg} />
                    ))}
                    {isLoading && (
                        <div className="flex justify-start">
                            <div className="bg-muted rounded-lg px-3 py-2 text-sm flex items-center">
                                <Loader2 className="h-3 w-3 animate-spin mr-2" />
                                Thinking...
                            </div>
                        </div>
                    )}
                </div>
            </CardContent>

            <CardFooter className="p-3 border-t">
                <form onSubmit={handleSubmit} className="flex w-full space-x-2">
                    <Input
                        placeholder="Type your question..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        disabled={isLoading}
                    />
                    <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
                        <Send className="h-4 w-4" />
                    </Button>
                </form>
            </CardFooter>
            <div className="bg-yellow-50 dark:bg-yellow-900/20 px-4 py-1 text-[10px] text-yellow-800 dark:text-yellow-200 text-center border-t border-yellow-100 dark:border-yellow-900/50">
                Disclaimer: Information only. Not medical advice.
            </div>
        </Card>
    );
}

function ChatMessageItem({ message }: { message: Message }) {
    const isUser = message.role === 'user';
    return (
        <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
            <div
                className={`max-w-[85%] rounded-lg px-3 py-2 text-sm ${isUser
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                    }`}
            >
                <p>{message.content}</p>
                {message.sources && message.sources.length > 0 && (
                    <div className="mt-2 pt-2 border-t border-primary-foreground/20 text-[10px] opacity-80">
                        <p className="font-semibold mb-1">Sources:</p>
                        <ul className="list-disc pl-3">
                            {message.sources.map((src, i) => (
                                <li key={i}>{src}</li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
}

