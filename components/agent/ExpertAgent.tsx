import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';
import { BrainCircuitIcon, BotIcon, SendIcon, UserIcon } from '../shared/Icon';

interface ChatMessage {
  sender: 'user' | 'ai';
  text: string;
}

const systemInstruction = `You are an elite AI Audit Co-Pilot, an expert on all major compliance and audit frameworks (ISO, SOC, PCI DSS, SOX, etc.). Your purpose is to provide 24/7 support to users preparing for an audit. You must be precise, helpful, and provide actionable advice. When asked for strategies, be thorough. When asked for simple facts, be concise.`;

const Loader: React.FC = () => (
    <div className="flex items-center space-x-1">
        <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
        <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
        <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></span>
    </div>
);

export const ExpertAgent: React.FC = () => {
    const [showIntro, setShowIntro] = useState(true);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isThinkingMode, setIsThinkingMode] = useState(false);
    const chatEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isLoading]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage: ChatMessage = { sender: 'user', text: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

        try {
            if (isThinkingMode) {
                // Complex queries with Thinking Mode
                const response = await ai.models.generateContent({
                    model: 'gemini-2.5-pro',
                    contents: `${systemInstruction}\n\nUser query: ${input}`,
                    config: {
                        thinkingConfig: { thinkingBudget: 32768 },
                    },
                });
                setMessages(prev => [...prev, { sender: 'ai', text: response.text }]);
            } else {
                // Low-latency streaming for standard queries
                const chat = ai.chats.create({
                    model: 'gemini-2.5-flash-lite',
                    config: { systemInstruction },
                });
                const stream = await chat.sendMessageStream({ message: input });

                let fullText = '';
                setMessages(prev => [...prev, { sender: 'ai', text: '' }]); // Add placeholder

                for await (const chunk of stream) {
                    fullText += chunk.text;
                    setMessages(prev => {
                        const newMessages = [...prev];
                        newMessages[newMessages.length - 1] = { sender: 'ai', text: fullText };
                        return newMessages;
                    });
                }
            }
        } catch (error) {
            console.error("Gemini API error:", error);
            setMessages(prev => [...prev, { sender: 'ai', text: "Sorry, I encountered an error. Please try again." }]);
        } finally {
            setIsLoading(false);
        }
    };

    if (showIntro) {
        return <IntroScreen onStart={() => setShowIntro(false)} />;
    }

    return (
        <div className="flex flex-col h-[calc(100vh-10rem)] bg-white rounded-xl border border-gray-border shadow-sm">
            <div className="p-4 border-b border-gray-border flex justify-between items-center">
                <h3 className="text-lg font-bold text-gray-800">Chat with your Audit Agent</h3>
                <div className="flex items-center space-x-3">
                    <span className={`font-semibold text-sm ${isThinkingMode ? 'text-brand-primary' : 'text-gray-500'}`}>Thinking Mode</span>
                    <label htmlFor="thinking-toggle" className="flex items-center cursor-pointer">
                        <div className="relative">
                            <input type="checkbox" id="thinking-toggle" className="sr-only" checked={isThinkingMode} onChange={() => setIsThinkingMode(!isThinkingMode)} />
                            <div className="block bg-gray-200 w-12 h-6 rounded-full"></div>
                            <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${isThinkingMode ? 'translate-x-6 bg-brand-primary' : ''}`}></div>
                        </div>
                    </label>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {messages.map((msg, index) => (
                    <div key={index} className={`flex items-start gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                         <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-white ${msg.sender === 'ai' ? 'bg-brand-primary' : 'bg-gray-400'}`}>
                           {msg.sender === 'ai' ? <BotIcon className="w-5 h-5"/> : <UserIcon className="w-5 h-5"/>}
                        </div>
                        <div className={`p-3 rounded-lg max-w-xl prose prose-sm ${msg.sender === 'user' ? 'bg-brand-primary text-white' : 'bg-gray-100 text-gray-800'}`}>
                           {msg.text.split('\n').map((line, i) => <p key={i} className="mb-2 last:mb-0">{line}</p>)}
                        </div>
                    </div>
                ))}
                {isLoading && (
                     <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-brand-primary flex items-center justify-center flex-shrink-0 text-white"><BotIcon className="w-5 h-5"/></div>
                        <div className="p-3 rounded-lg bg-gray-100"><Loader /></div>
                    </div>
                )}
                <div ref={chatEndRef} />
            </div>

            <div className="p-4 border-t border-gray-border">
                <form onSubmit={handleSendMessage} className="flex items-center space-x-3">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask about compliance, audit strategies, or specific controls..."
                        className="w-full bg-gray-light border border-gray-border rounded-lg pl-4 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-light"
                        disabled={isLoading}
                    />
                    <button type="submit" disabled={isLoading || !input.trim()} className="bg-brand-primary text-white rounded-lg p-2.5 disabled:bg-gray-300 hover:bg-brand-secondary transition-colors">
                        <SendIcon className="w-5 h-5" />
                    </button>
                </form>
            </div>
        </div>
    );
};


const IntroScreen: React.FC<{ onStart: () => void }> = ({ onStart }) => (
    <div className="flex flex-col items-center justify-center h-full text-center p-8 bg-white rounded-xl">
        <BrainCircuitIcon className="w-20 h-20 text-brand-primary mb-5" />
        <h2 className="text-3xl font-bold text-gray-800">Meet Your 24/7 Expert Audit Agent</h2>
        <p className="mt-3 mb-8 max-w-2xl text-gray-600 leading-relaxed">
            Imagine having a super-smart helper who has read every single rulebook for your audit. This agent is that helper! You can ask it any question, anytime, day or night.
        </p>

        <div className="grid md:grid-cols-2 gap-6 max-w-3xl w-full mb-10 text-left">
            <div className="bg-gray-light p-5 rounded-lg border border-gray-border">
                <h3 className="font-bold text-gray-800 mb-2">⚡ For Quick Answers</h3>
                <p className="text-sm text-gray-600">Need to know a specific control for ISO 27001? Ask away! You'll get a super-fast response, perfect for quick questions on the fly.</p>
            </div>
            <div className="bg-gray-light p-5 rounded-lg border border-gray-border">
                <h3 className="font-bold text-gray-800 mb-2">🧠 For Complex Strategy</h3>
                <p className="text-sm text-gray-600">Facing a tricky problem? Toggle on <span className="font-bold text-brand-primary">"Thinking Mode"</span>. The agent will think very deeply to give you the best possible strategy to pass your audit.</p>
            </div>
        </div>

        <button onClick={onStart} className="px-8 py-4 bg-brand-primary text-white font-bold rounded-lg hover:bg-brand-secondary transition-colors text-lg shadow-lg">
            Start Chatting
        </button>
    </div>
);
