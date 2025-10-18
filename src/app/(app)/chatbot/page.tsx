
'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { aiChatbotMentalHealthSupport } from '@/ai/flows/ai-chatbot-mental-health-support';
import { summarizeChatHistory } from '@/ai/flows/ai-chatbot-chat-summarization';
import { transcribeAudio } from '@/ai/flows/ai-chatbot-speech-to-text';
import { textToSpeech } from '@/ai/flows/ai-chatbot-text-to-speech';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Send, Bot, User, MoreVertical, Trash, Edit, MessageSquare, Check, X, ArrowLeft, History, Mic, MicOff, WifiOff } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSub, DropdownMenuSubTrigger, DropdownMenuSubContent, DropdownMenuPortal } from "@/components/ui/dropdown-menu";
import { format, isToday, isYesterday, subDays, isAfter } from 'date-fns';
import { useIsMobile } from '@/hooks/use-mobile';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';


type Message = {
  role: 'user' | 'bot';
  text: string;
};

type ChatSession = {
    id: string;
    title: string;
    messages: Message[];
    timestamp: Date;
    summary: string;
}

type ChatHistoryItem = {
  user: string;
  bot: string;
}

const SUMMARIZATION_THRESHOLD = 10; // Summarize every 10 messages

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
                        {sessions.length === 0 && (
                            <div className="p-4 text-center text-sm text-muted-foreground">No chats yet.</div>
                        )}
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
  const [loadingMessage, setLoadingMessage] = useState<string | null>(null);
  const [tone, setTone] = useState<'professional' | 'friendly' | 'empathetic' | 'humorous'>('professional');
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renamingTitle, setRenamingTitle] = useState('');
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  const [sheetOpen, setSheetOpen] = useState(false);
  const [isOffline, setIsOffline] = useState(false);

  // Voice state
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioPlayerRef = useRef<HTMLAudioElement>(null);


  const activeSession = sessions.find(s => s.id === activeSessionId);
  const activeMessages = activeSession?.messages || [];
  
  const createNewChat = () => {
      const newSession: ChatSession = {
          id: `chat-${new Date().getTime()}-${Math.random().toString(36).substring(7)}`,
          title: "New Chat",
          timestamp: new Date(),
          messages: [
            { role: 'bot', text: 'Hello! I am your Elysium assistant. How can I support you today?' }
          ],
          summary: '',
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
            timestamp: new Date(s.timestamp),
            summary: s.summary || '',
        })) : [];

        if (parsedSessions.length > 0) {
          const sortedSessions = [...parsedSessions].sort((a,b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
          setSessions(sortedSessions);
          setActiveSessionId(sortedSessions[0].id);
        }
    } catch (error) {
        console.error("Failed to load chat sessions from localStorage", error);
    }
  }, []);

  // Save sessions to localStorage whenever they change
  useEffect(() => {
    try {
        if (sessions.length > 0) {
            // Filter out empty new chats before saving
            const sessionsToSave = sessions.filter(s => s.messages.length > 1 || s.title !== "New Chat");
            if (sessionsToSave.length > 0) {
                localStorage.setItem('chatSessions', JSON.stringify(sessionsToSave));
            } else {
                 localStorage.removeItem('chatSessions');
            }
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
  }, [activeMessages, isLoading]);
  
  // Offline detection
  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Set initial status
    if (typeof navigator.onLine === 'boolean') {
      setIsOffline(!navigator.onLine);
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const playAudio = (audioDataUri: string) => {
    if (audioPlayerRef.current) {
        audioPlayerRef.current.src = audioDataUri;
        audioPlayerRef.current.play().catch(e => console.error("Audio playback failed:", e));
    }
  }

  const handleSummarization = async (sessionId: string) => {
    const session = sessions.find(s => s.id === sessionId);
    if (!session || session.messages.length < 2) return;

    console.log(`Checking summarization for session ${sessionId}. Messages: ${session.messages.length}`);
    
    // Check if it's time to summarize (e.g., every 10 messages)
    if (session.messages.length % SUMMARIZATION_THRESHOLD === 0) {
      console.log("Threshold met. Summarizing chat...");
      
      const fullHistory = session.messages.map(m => `${m.role}: ${m.text}`).join('\n');
      const textToSummarize = `Previous summary:\n${session.summary}\n\nNew messages:\n${fullHistory}`;

      try {
        const { summary: newSummary } = await summarizeChatHistory({ chatHistory: textToSummarize });
        
        setSessions(prev => prev.map(s => 
          s.id === sessionId ? { ...s, summary: newSummary } : s
        ));
        console.log("Chat summary updated successfully.");
      } catch (error) {
        console.error("Failed to summarize chat history:", error);
      }
    }
  };


  const processAndSendMessage = async (messageText: string, playResponse: boolean = false) => {
    if (!messageText.trim() || isLoading || isOffline) return;

    // Create a new chat if there's no active one
    let currentActiveSessionId = activeSessionId;
    if (!currentActiveSessionId) {
        const newSession: ChatSession = {
          id: `chat-${new Date().getTime()}-${Math.random().toString(36).substring(7)}`,
          title: "New Chat",
          timestamp: new Date(),
          messages: [
            { role: 'bot', text: 'Hello! I am your Elysium assistant. How can I support you today?' }
          ],
          summary: '',
        };
        setSessions(prev => [newSession, ...prev]);
        setActiveSessionId(newSession.id);
        currentActiveSessionId = newSession.id;
    }


    const userMessage: Message = { role: 'user', text: messageText };
    
    // Optimistically update UI
    setSessions(prev => prev.map(s => {
        if (s.id === currentActiveSessionId) {
            const isNewChat = s.title === "New Chat" && s.messages.length === 1;
            return { 
                ...s, 
                title: isNewChat ? messageText.substring(0, 30) + (messageText.length > 30 ? '...' : '') : s.title,
                messages: [...s.messages, userMessage], 
                timestamp: new Date() 
            };
        }
        return s;
    }));

    setInput('');
    setIsLoading(true);
    setLoadingMessage(null);

    try {
      const currentSession = sessions.find(s => s.id === currentActiveSessionId);
      const historyMessages = (currentSession?.messages || []).slice(-10); // Use last 10 messages for immediate context

      const chatHistory: ChatHistoryItem[] = historyMessages
        .reduce((acc, msg, i, arr) => {
            if (msg.role === 'user' && arr[i+1]?.role === 'bot') {
                acc.push({ user: msg.text, bot: arr[i+1].text });
            }
            return acc;
        }, [] as ChatHistoryItem[]);


      const response = await aiChatbotMentalHealthSupport({
        message: messageText,
        tone: tone,
        chatHistory: chatHistory,
        // Pass the summary for long-term context
        summary: currentSession?.summary 
      });

      const botMessage: Message = { role: 'bot', text: response.response };
      
      setSessions(prev => prev.map(s => s.id === currentActiveSessionId ? { ...s, messages: [...s.messages, botMessage] } : s));
      
      if (playResponse) {
        setLoadingMessage('Generating audio...');
        try {
            const audioResponse = await textToSpeech(response.response);
            if (audioResponse.media) {
                playAudio(audioResponse.media);
            }
        } catch (audioError) {
            console.error("Failed to generate or play audio:", audioError);
        }
      }
      
      // Trigger summarization check after state has been updated
      handleSummarization(currentActiveSessionId);


    } catch (error) {
      console.error('Error fetching AI response:', error);
      const errorMessage: Message = { role: 'bot', text: 'Sorry, I am having trouble connecting right now.' };
      setSessions(prev => prev.map(s => s.id === currentActiveSessionId ? { ...s, messages: [...s.messages, errorMessage] } : s));
    } finally {
      setIsLoading(false);
      setLoadingMessage(null);
    }
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    processAndSendMessage(input, false);
  };
  
    const handleDeleteSession = (sessionIdToDelete: string) => {
        setSessions(prev => {
            const remainingSessions = prev.filter(s => s.id !== sessionIdToDelete);
            
            if (activeSessionId === sessionIdToDelete) {
                if (remainingSessions.length > 0) {
                    const sortedRemaining = [...remainingSessions].sort((a,b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
                    setActiveSessionId(sortedRemaining[0].id);
                } else {
                    setActiveSessionId(null); // No sessions left
                }
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
    
    const handleVoiceRecording = async () => {
        if (isRecording) {
            mediaRecorderRef.current?.stop();
            setIsRecording(false);
        } else {
            if (isOffline) return;
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                mediaRecorderRef.current = new MediaRecorder(stream);
                audioChunksRef.current = [];

                mediaRecorderRef.current.ondataavailable = (event) => {
                    audioChunksRef.current.push(event.data);
                };

                mediaRecorderRef.current.onstop = async () => {
                    const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
                    const reader = new FileReader();
                    reader.readAsDataURL(audioBlob);
                    reader.onloadend = async () => {
                        const base64Audio = reader.result as string;
                        try {
                            setIsLoading(true);
                            setLoadingMessage('Transcribing...');
                            const { transcription } = await transcribeAudio({ audioDataUri: base64Audio });
                            if(transcription) {
                               await processAndSendMessage(transcription, true);
                            }
                        } catch (error) {
                            console.error("Error transcribing audio:", error);
                        } finally {
                             setIsLoading(false);
                             setLoadingMessage(null);
                        }
                    };
                     // Stop all media tracks to turn off the recording indicator
                    stream.getTracks().forEach(track => track.stop());
                };

                mediaRecorderRef.current.start();
                setIsRecording(true);
            } catch (error) {
                console.error("Error accessing microphone:", error);
                // You might want to show a toast here to the user
            }
        }
    };


    const chatListProps = {
        sessions,
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
                    <CardHeader className="flex flex-row items-center justify-between border-b p-2 md:p-6">
                        <div className="flex items-center gap-2">
                           <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
                                <SheetTrigger asChild>
                                    <Button variant="ghost" size="icon" className="md:hidden">
                                        <History className="h-5 w-5" />
                                    </Button>
                                </SheetTrigger>
                                <SheetContent side="left" className="p-0">
                                     <SheetHeader>
                                        <SheetTitle className="sr-only">Chat History</SheetTitle>
                                     </SheetHeader>
                                     <ChatList {...chatListProps} />
                                </SheetContent>
                            </Sheet>
                        </div>

                        <div className="flex flex-col items-center text-center">
                            <p className="font-semibold truncate text-base md:hidden">{activeSession.title}</p>
                            <p className="text-xs text-muted-foreground md:hidden">24/7 mental health support</p>
                        </div>
                        
                        <div className="hidden md:block">
                            <CardTitle className="font-headline">{activeSession.title}</CardTitle>
                            <CardDescription>Your 24/7 mental health support</CardDescription>
                        </div>
                        

                        <div className="flex items-center gap-2">
                            <Button variant="outline" onClick={createNewChat} className="hidden md:flex">
                                <MessageSquare className="mr-2 h-4 w-4" /> New Chat
                            </Button>
                             <Button variant="ghost" size="icon" onClick={createNewChat} className="md:hidden">
                                <MessageSquare className="h-5 w-5" />
                            </Button>

                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon">
                                        <MoreVertical className="h-5 w-5" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuPortal>
                                    <DropdownMenuContent align="end">
                                         <DropdownMenuSub>
                                            <DropdownMenuSubTrigger>
                                                <span>Tone: {tone.charAt(0).toUpperCase() + tone.slice(1)}</span>
                                            </DropdownMenuSubTrigger>
                                            <DropdownMenuPortal>
                                                <DropdownMenuSubContent>
                                                    <DropdownMenuItem onSelect={() => setTone('professional')}>Professional</DropdownMenuItem>
                                                    <DropdownMenuItem onSelect={() => setTone('friendly')}>Friendly</DropdownMenuItem>
                                                    <DropdownMenuItem onSelect={() => setTone('empathetic')}>Empathetic</DropdownMenuItem>
                                                    <DropdownMenuItem onSelect={() => setTone('humorous')}>Humorous</DropdownMenuItem>
                                                </DropdownMenuSubContent>
                                            </DropdownMenuPortal>
                                        </DropdownMenuSub>
                                    </DropdownMenuContent>
                                </DropdownMenuPortal>
                            </DropdownMenu>
                        </div>
                    </CardHeader>
                    <CardContent className="flex-1 overflow-hidden p-0">
                        <ScrollArea className="h-full" ref={scrollAreaRef}>
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
                                {loadingMessage ? (
                                    <p className="text-sm text-muted-foreground italic">{loadingMessage}</p>
                                ) : (
                                    <div className="flex items-center space-x-2">
                                        <span className="h-2 w-2 animate-pulse rounded-full bg-foreground/50 [animation-delay:-0.3s]"></span>
                                        <span className="h-2 w-2 animate-pulse rounded-full bg-foreground/50 [animation-delay:-0.15s]"></span>
                                        <span className="h-2 w-2 animate-pulse rounded-full bg-foreground/50"></span>
                                    </div>
                                )}
                                </div>
                            </div>
                            )}
                        </div>
                        </ScrollArea>
                    </CardContent>
                    <CardFooter className="border-t p-2 md:p-4">
                      <div className="w-full flex flex-col items-center gap-2">
                        {isOffline ? (
                            <div className="flex w-full items-center justify-center gap-2 rounded-md border border-dashed bg-muted p-3 text-muted-foreground">
                                <WifiOff className="h-5 w-5" />
                                <p className="text-sm">You are offline. Please check your internet connection.</p>
                            </div>
                        ) : (
                            <form onSubmit={handleSendMessage} className="flex w-full items-center gap-2">
                                <Input
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="Type or record your message..."
                                    className="flex-1"
                                    disabled={isLoading || isRecording}
                                />
                                <Button type="button" size="icon" onClick={handleVoiceRecording} disabled={isLoading || isOffline} className={cn(isRecording && "bg-destructive hover:bg-destructive/90")}>
                                    {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                                </Button>
                                <Button type="submit" size="icon" disabled={isLoading || !input.trim() || isRecording || isOffline}>
                                    <Send className="h-4 w-4" />
                                </Button>
                            </form>
                        )}
                        <p className="text-xs text-muted-foreground text-center w-full pt-2">
                            Elysium isn’t a therapy replacement, consult professionals for serious issues
                        </p>
                      </div>
                    </CardFooter>
                </>
            ) : (
                <div className="flex flex-col items-center justify-center h-full gap-4 text-center p-4">
                    <MessageSquare className="w-12 h-12 text-muted-foreground" />
                    <h2 className="text-xl font-semibold">Start a conversation</h2>
                    <p className="text-muted-foreground">Click the "New Chat" button to begin your conversation with Elysium.</p>
                    <Button onClick={createNewChat}>
                        <MessageSquare className="mr-2 h-4 w-4" /> New Chat
                    </Button>
                </div>
            )}
        </Card>
        <audio ref={audioPlayerRef} className="hidden" />
    </div>
  );
}
