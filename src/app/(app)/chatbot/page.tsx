
'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { aiChatbotMentalHealthSupport } from '@/ai/flows/ai-chatbot-mental-health-support';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Send, Bot, User, MoreVertical, Trash, Edit, MessageSquare, Check, X, ArrowLeft, History } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { format, isToday, isYesterday, subDays, isAfter } from 'date-fns';
import { useIsMobile } from '@/hooks/use-mobile';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';


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


const ChatList = ({ sessions, activeSessionId, setActiveSessionId, renamingId, startRenameSession, confirmRenameSession, setRenamingTitle, renamingTitle, cancelRename, deleteSession, createNewChat }: {
    sessions: ChatSession[];
    activeSessionId: string | null;
    renamingId: string | null;
    renamingTitle: string;
    setActiveSessionId: (id: string) => void;
    startRenameSession: (session: ChatSession) => void;
    confirmRenameSession: (id: string) => void;
    setRenamingTitle: (title: string) => void;
    cancelRename: () => void;
    deleteSession: (id: string) => void;
    createNewChat: () => void;
}) => {
    
    const groupSessions = (sessions: ChatSession[]) => {
        const today: ChatSession[] = [];
        const yesterday: ChatSession[] = [];
        const last7Days: ChatSession[] = [];
        const earlier: ChatSession[] = [];

        const now = new Date();
        const sevenDaysAgo = subDays(now, 7);

        sessions.forEach(session => {
            const sessionDate = new Date(session.timestamp);
            if (isToday(sessionDate)) {
                today.push(session);
            } else if (isYesterday(sessionDate)) {
                yesterday.push(session);
            } else if (isAfter(sessionDate, sevenDaysAgo)) {
                last7Days.push(session);
            } else {
                earlier.push(session);
            }
        });
        
        return { today, yesterday, last7Days, earlier };
    }
    
    const grouped = groupSessions(sessions.sort((a,b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()));

    const renderSession = (session: ChatSession) => (
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
                        <p className="text-xs text-muted-foreground">{format(new Date(session.timestamp), 'dd-MM-yyyy p')}</p>
                    </div>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100" onClick={(e) => e.stopPropagation()}>
                                <MoreVertical className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuItem onClick={(e) => {e.stopPropagation(); startRenameSession(session)}}><Edit className="mr-2 h-4 w-4" /> Rename</DropdownMenuItem>
                            <DropdownMenuItem onClick={(e) => {e.stopPropagation(); deleteSession(session.id)}} className="text-destructive"><Trash className="mr-2 h-4 w-4" /> Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </>
            )}
        </div>
    );
    
    return (
        <Card className="md:col-span-1 lg:col-span-1 flex flex-col h-full border-0 md:border">
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
                        {grouped.today.length > 0 && <p className="px-3 py-1 text-sm font-semibold text-muted-foreground">Today</p>}
                        {grouped.today.map(renderSession)}
                        {grouped.yesterday.length > 0 && <p className="px-3 py-1 text-sm font-semibold text-muted-foreground">Yesterday</p>}
                        {grouped.yesterday.map(renderSession)}
                        {grouped.last7Days.length > 0 && <p className="px-3 py-1 text-sm font-semibold text-muted-foreground">Previous 7 Days</p>}
                        {grouped.last7Days.map(renderSession)}
                        {grouped.earlier.length > 0 && <p className="px-3 py-1 text-sm font-semibold text-muted-foreground">Earlier</p>}
                        {grouped.earlier.map(renderSession)}
                    </div>
                 </ScrollArea>
            </CardContent>
        </Card>
    );
};


export default function ChatbotPage() {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [tone, setTone] = useState<'professional' | 'friendly' | 'empathetic' | 'humorous'>('professional');
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renamingTitle, setRenamingTitle] = useState('');
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  const [sheetOpen, setSheetOpen] = useState(false);

  
  const activeSession = sessions.find(s => s.id === activeSessionId);
  const activeMessages = activeSession?.messages || [];
  
  const createNewChat = () => {
      const newSession: ChatSession = {
          id: `chat-${new Date().getTime()}-${Math.random().toString(36).substring(7)}`,
          title: "New Chat",
          timestamp: new Date(),
          messages: [
            { role: 'bot', text: 'Hello! I am your Zenith Mind assistant. How can I support you today?' }
          ]
      };
      setSessions(prev => [newSession, ...prev]);
      setActiveSessionId(newSession.id);
      if (isMobile) setSheetOpen(false);
  }

  // Load sessions from localStorage on initial render
  useEffect(() => {
    try {
        const savedSessions = localStorage.getItem('chatSessions');
        const parsedSessions = savedSessions ? JSON.parse(savedSessions).map((s: any) => ({
            ...s,
            timestamp: new Date(s.timestamp)
        })) : [];

        setSessions(parsedSessions);
        
        if (parsedSessions.length > 0) {
          const sortedSessions = [...parsedSessions].sort((a,b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
          setActiveSessionId(sortedSessions[0].id);
        }
        createNewChat();

    } catch (error) {
        console.error("Failed to load chat sessions from localStorage", error);
        createNewChat();
    }
  }, []);

  // Save sessions to localStorage whenever they change
  useEffect(() => {
    try {
        if (sessions.length > 0) {
            const sessionsToSave = sessions.filter(s => s.messages.length > 1 || s.title !== "New Chat");
            localStorage.setItem('chatSessions', JSON.stringify(sessionsToSave));
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


  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading || !activeSessionId) return;

    const userMessage: Message = { role: 'user', text: input };
    
    setSessions(prev => prev.map(s => s.id === activeSessionId ? { ...s, messages: [...s.messages, userMessage], timestamp: new Date() } : s));
    setInput('');
    setIsLoading(true);

    try {
      const currentSession = sessions.find(s => s.id === activeSessionId);
      const currentMessages = currentSession?.messages || [];
      const chatHistory: ChatHistoryItem[] = currentMessages
        .filter((_, i) => i < currentMessages.length) // process all but the last user message
        .reduce((acc, msg, i, arr) => {
            if (msg.role === 'user' && arr[i+1]?.role === 'bot') {
                acc.push({ user: msg.text, bot: arr[i+1].text });
            } else if (msg.role === 'user' && i === arr.length - 1) {
                // handles the case where there is no bot message for the last user message yet
            } else if (msg.role === 'bot' && arr[i-1]?.role !== 'user') {
                 // handle initial bot message
            }
            return acc;
        }, [] as ChatHistoryItem[]);


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
  
    const handleDeleteSession = (sessionIdToDelete: string) => {
        setSessions(prev => {
            const remainingSessions = prev.filter(s => s.id !== sessionIdToDelete);
            
            if (activeSessionId === sessionIdToDelete) {
                const sortedRemaining = [...remainingSessions].sort((a,b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
                const nextActiveId = sortedRemaining.length > 0 ? sortedRemaining[0].id : null;
                setActiveSessionId(nextActiveId);
            }
            if (remainingSessions.length === 0) {
                 localStorage.removeItem('chatSessions');
            }
            
            return remainingSessions;
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

    const handleSetActiveSession = (id: string) => {
        setActiveSessionId(id);
        if (isMobile) setSheetOpen(false);
    }

    const chatListProps = {
        sessions: sessions.filter(s => s.id !== activeSessionId && (s.messages.length > 1 || s.title !== "New Chat")),
        activeSessionId,
        setActiveSessionId: handleSetActiveSession,
        renamingId,
        startRenameSession,
        confirmRenameSession,
        renamingTitle,
        setRenamingTitle,
        cancelRename,
        deleteSession: handleDeleteSession,
        createNewChat
    };

  return (
    <div className="grid h-[calc(100vh-5rem)] md:h-[calc(100vh-8rem)] grid-cols-1 md:grid-cols-3 md:gap-6 lg:grid-cols-4">
        
        {/* Desktop Sidebar */}
        <div className="hidden md:flex md:col-span-1 lg:col-span-1">
            <ChatList {...chatListProps} />
        </div>

        <Card className="md:col-span-2 lg:col-span-3 flex flex-col border-0 md:border">
            {activeSession ? (
                <>
                    <CardHeader className="flex flex-row items-center justify-between border-b">
                        <div className="flex items-center gap-2">
                             <Button asChild variant="ghost" size="icon" className="md:hidden">
                                 <Link href="/dashboard"><ArrowLeft/></Link>
                            </Button>
                            <div>
                                <CardTitle className="font-headline">{activeSession.title}</CardTitle>
                                <CardDescription>Your 24/7 mental health support</CardDescription>
                            </div>
                        </div>

                         <div className="flex items-center gap-2">
                            {/* Mobile History Button */}
                            <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
                                <SheetTrigger asChild>
                                    <Button variant="outline" className="md:hidden">
                                        <History className="mr-2 h-4 w-4" /> History
                                    </Button>
                                </SheetTrigger>
                                <SheetContent side="left" className="p-0">
                                     <ChatList {...chatListProps} />
                                </SheetContent>
                            </Sheet>
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
                         </div>
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
                    <CardFooter className="flex-col items-start border-t p-4 gap-4">
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
                        <p className="text-xs text-muted-foreground text-center w-full">
                            Zenith Mind is not a replacement for professional therapy. In case you experience serious mental issues. Consider consulting a professional.
                        </p>
                    </CardFooter>
                </>
            ) : (
                <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
                    <p>Loading...</p>
                </div>
            )}
        </Card>
    </div>
  );
}

    