'use client';

import { useState, useRef, useEffect } from 'react';
import { aiChatbotMentalHealthSupport } from '@/ai/flows/ai-chatbot-mental-health-support';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Send, Bot, User, MoreVertical, Trash, Edit, MessageSquare, Check, X } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

type Message = {
  role: 'user' | 'bot';
  text: string;
};

type ChatSession = {
    id: string;
    title: string;
    messages: Message[];
    timestamp: Date;
}

type ChatHistoryItem = {
  user: string;
  bot: string;
}

export default function ChatbotPage() {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [tone, setTone] = useState<'professional' | 'friendly' | 'empathetic' | 'humorous'>('professional');
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renamingTitle, setRenamingTitle] = useState('');
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  
  const activeMessages = sessions.find(s => s.id === activeSessionId)?.messages || [];

  // Load sessions from localStorage on initial render
  useEffect(() => {
    try {
        const savedSessions = localStorage.getItem('chatSessions');
        if (savedSessions) {
            const parsedSessions = JSON.parse(savedSessions).map((s: any) => ({
                ...s,
                timestamp: new Date(s.timestamp)
            }));
            setSessions(parsedSessions);
        }
    } catch (error) {
        console.error("Failed to load chat sessions from localStorage", error);
    }
  }, []);

  // Save sessions to localStorage whenever they change
  useEffect(() => {
    try {
        if (sessions.length > 0) {
            localStorage.setItem('chatSessions', JSON.stringify(sessions));
        } else {
            localStorage.removeItem('chatSessions');
        }
    } catch (error) {
        console.error("Failed to save chat sessions to localStorage", error);
    }
  }, [sessions]);


  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [activeMessages]);
  
  const createNewChat = () => {
      const newSession: ChatSession = {
          id: `chat-${Date.now()}`,
          title: "New Chat",
          timestamp: new Date(),
          messages: [
            { role: 'bot', text: 'Hello! I am your Zenith Mind assistant. How can I support you today?' }
          ]
      };
      setSessions(prev => [newSession, ...prev]);
      setActiveSessionId(newSession.id);
  }
  
  useEffect(() => {
      if(sessions.length === 0) {
          createNewChat();
      } else if (!activeSessionId && sessions.length > 0) {
        const sortedSessions = [...sessions].sort((a,b) => b.timestamp.getTime() - a.timestamp.getTime());
        setActiveSessionId(sortedSessions[0].id);
      }
  }, [sessions, activeSessionId]);


  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading || !activeSessionId) return;

    const userMessage: Message = { role: 'user', text: input };
    
    setSessions(prev => prev.map(s => s.id === activeSessionId ? { ...s, messages: [...s.messages, userMessage] } : s));
    setInput('');
    setIsLoading(true);

    try {
      const currentMessages = sessions.find(s => s.id === activeSessionId)?.messages || [];
      const chatHistory: ChatHistoryItem[] = currentMessages
        .filter(m => m.role === 'bot')
        .map((m, i) => ({
          bot: m.text,
          user: currentMessages.filter(um => um.role === 'user')[i]?.text || ''
        })).filter(item => item.user);


      const response = await aiChatbotMentalHealthSupport({
        message: input,
        tone: tone,
        chatHistory: chatHistory
      });

      const botMessage: Message = { role: 'bot', text: response.response };
      setSessions(prev => prev.map(s => s.id === activeSessionId ? { ...s, messages: [...s.messages, botMessage] } : s));

    } catch (error) {
      console.error('Error fetching AI response:', error);
      const errorMessage: Message = { role: 'bot', text: 'Sorry, I am having trouble connecting right now.' };
      setSessions(prev => prev.map(s => s.id === activeSessionId ? { ...s, messages: [...s.messages, errorMessage] } : s));
    } finally {
      setIsLoading(false);
    }
  };
  
    const handleDeleteSession = (sessionId: string) => {
        setSessions(prev => {
            const newSessions = prev.filter(s => s.id !== sessionId);
            if (activeSessionId === sessionId) {
                const sorted = newSessions.sort((a,b) => b.timestamp.getTime() - a.timestamp.getTime());
                setActiveSessionId(sorted.length > 0 ? sorted[0].id : null);
            }
            if (newSessions.length === 0) {
                localStorage.removeItem('chatSessions');
                createNewChat();
            }
            return newSessions;
        });
    };
    
    const startRenameSession = (session: ChatSession) => {
        setRenamingId(session.id);
        setRenamingTitle(session.title);
    };

    const confirmRenameSession = (sessionId: string) => {
        if (!renamingTitle.trim()) return;
        setSessions(prev => prev.map(s => s.id === sessionId ? { ...s, title: renamingTitle } : s));
        setRenamingId(null);
        setRenamingTitle('');
    };

    const cancelRename = () => {
        setRenamingId(null);
        setRenamingTitle('');
    }


  return (
    <div className="grid h-[calc(100vh-8rem)] grid-cols-1 gap-6 md:grid-cols-3 lg:grid-cols-4">
        <Card className="md:col-span-1 lg:col-span-1 flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle className="font-headline">Chat History</CardTitle>
                    <CardDescription>Your past conversations</CardDescription>
                </div>
                <Button variant="ghost" size="icon" onClick={createNewChat}>
                    <MessageSquare className="h-5 w-5" />
                </Button>
            </CardHeader>
            <CardContent className="flex-1 p-0">
                 <ScrollArea className="h-full">
                    <div className="space-y-2 p-2">
                    {sessions.sort((a,b) => b.timestamp.getTime() - a.timestamp.getTime()).map(session => (
                        <div key={session.id} onClick={() => renamingId !== session.id && setActiveSessionId(session.id)} className={`group flex justify-between items-center rounded-md p-3 cursor-pointer ${activeSessionId === session.id && !renamingId ? 'bg-muted' : 'hover:bg-muted'}`}>
                            {renamingId === session.id ? (
                                <div className="flex w-full items-center gap-2">
                                    <Input value={renamingTitle} onChange={(e) => setRenamingTitle(e.target.value)} className="h-8" autoFocus onKeyDown={(e) => e.key === 'Enter' && confirmRenameSession(session.id)} />
                                    <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0" onClick={() => confirmRenameSession(session.id)}><Check className="h-4 w-4" /></Button>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0" onClick={cancelRename}><X className="h-4 w-4" /></Button>
                                </div>
                            ) : (
                                <>
                                    <div className="overflow-hidden">
                                        <p className="font-medium truncate">{session.title}</p>
                                        <p className="text-xs text-muted-foreground">{new Date(session.timestamp).toLocaleDateString()}</p>
                                    </div>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100" onClick={(e) => e.stopPropagation()}>
                                                <MoreVertical className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent>
                                            <DropdownMenuItem onClick={(e) => {e.stopPropagation(); startRenameSession(session)}}><Edit className="mr-2 h-4 w-4" /> Rename</DropdownMenuItem>
                                            <DropdownMenuItem onClick={(e) => {e.stopPropagation(); handleDeleteSession(session.id)}} className="text-destructive"><Trash className="mr-2 h-4 w-4" /> Delete</DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </>
                            )}
                        </div>
                    ))}
                    </div>
                 </ScrollArea>
            </CardContent>
        </Card>
        <Card className="md:col-span-2 lg:col-span-3 flex flex-col">
        <CardHeader className="flex flex-row items-center justify-between border-b">
            <div>
                <CardTitle className="font-headline">AI Assistant</CardTitle>
                <CardDescription>Your 24/7 mental health support chatbot</CardDescription>
            </div>
            <Select value={tone} onValueChange={(value) => setTone(value as any)}>
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select a tone" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="professional">Professional</SelectItem>
                    <SelectItem value="friendly">Friendly</SelectItem>
                    <SelectItem value="empathetic">Empathetic</SelectItem>
                    <SelectItem value="humorous">Humorous</SelectItem>
                </SelectContent>
            </Select>
        </CardHeader>
        <CardContent className="flex-1 p-0">
            <ScrollArea className="h-[calc(100%-140px)]" ref={scrollAreaRef}>
            <div className="p-6 space-y-6">
                {activeMessages.map((message, index) => (
                <div
                    key={index}
                    className={`flex items-start gap-4 ${message.role === 'user' ? 'justify-end' : ''}`}
                >
                    {message.role === 'bot' && (
                    <Avatar className="h-8 w-8 border">
                        <AvatarFallback><Bot className="h-4 w-4" /></AvatarFallback>
                    </Avatar>
                    )}
                    <div className={`max-w-[75%] rounded-lg p-3 ${
                    message.role === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                    }`}>
                    <p className="text-sm">{message.text}</p>
                    </div>
                    {message.role === 'user' && (
                    <Avatar className="h-8 w-8 border">
                        <AvatarFallback><User className="h-4 w-4" /></AvatarFallback>
                    </Avatar>
                    )}
                </div>
                ))}
                {isLoading && (
                <div className="flex items-start gap-4">
                    <Avatar className="h-8 w-8 border">
                    <AvatarFallback><Bot className="h-4 w-4" /></AvatarFallback>
                    </Avatar>
                    <div className="max-w-[75%] rounded-lg bg-muted p-3">
                    <div className="flex items-center space-x-2">
                        <span className="h-2 w-2 animate-pulse rounded-full bg-foreground/50 [animation-delay:-0.3s]"></span>
                        <span className="h-2 w-2 animate-pulse rounded-full bg-foreground/50 [animation-delay:-0.15s]"></span>
                        <span className="h-2 w-2 animate-pulse rounded-full bg-foreground/50"></span>
                    </div>
                    </div>
                </div>
                )}
            </div>
            </ScrollArea>
        </CardContent>
        <CardFooter className="border-t p-4">
            <form onSubmit={handleSendMessage} className="flex w-full items-center gap-2">
            <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                className="flex-1"
                disabled={isLoading || !activeSessionId}
            />
            <Button type="submit" size="icon" disabled={isLoading || !input.trim() || !activeSessionId}>
                <Send className="h-4 w-4" />
            </Button>
            </form>
        </CardFooter>
        </Card>
    </div>
  );
}
