
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FilePlus, MoreVertical, Trash, Edit, Save, Check, X, ArrowLeft, History } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { format, isToday, isYesterday, isAfter, subDays } from 'date-fns';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { useIsMobile } from '@/hooks/use-mobile';


interface JournalEntry {
    id: string;
    title: string;
    content: string;
    date: Date;
}

const JournalList = ({ entries, activeEntryId, setActiveEntryId, renamingId, startRenameEntry, confirmRenameEntry, setRenamingTitle, renamingTitle, cancelRename, deleteEntry, createNewEntry }: {
    entries: JournalEntry[];
    activeEntryId: string | null;
    renamingId: string | null;
    renamingTitle: string;
    setActiveEntryId: (id: string) => void;
    startRenameEntry: (entry: JournalEntry) => void;
    confirmRenameEntry: (id: string) => void;
    setRenamingTitle: (title: string) => void;
    cancelRename: () => void;
    deleteEntry: (id: string) => void;
    createNewEntry: () => void;
}) => {
    
    const groupEntries = (entries: JournalEntry[]) => {
        const today: JournalEntry[] = [];
        const yesterday: JournalEntry[] = [];
        const last7Days: JournalEntry[] = [];
        const earlier: JournalEntry[] = [];

        const now = new Date();
        const sevenDaysAgo = subDays(now, 7);

        entries.forEach(entry => {
            const entryDate = new Date(entry.date);
            if (isToday(entryDate)) {
                today.push(entry);
            } else if (isYesterday(entryDate)) {
                yesterday.push(entry);
            } else if (isAfter(entryDate, sevenDaysAgo)) {
                last7Days.push(entry);
            } else {
                earlier.push(entry);
            }
        });
        
        return { today, yesterday, last7Days, earlier };
    }
    
    const grouped = groupEntries(entries.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()));

    const renderEntry = (entry: JournalEntry) => (
        <div key={entry.id} onClick={() => renamingId !== entry.id && setActiveEntryId(entry.id)} className={`group flex justify-between items-center rounded-md p-3 cursor-pointer ${activeEntryId === entry.id && !renamingId ? 'bg-muted' : 'hover:bg-muted'}`}>
            {renamingId === entry.id ? (
                <div className="flex w-full items-center gap-2">
                    <Input value={renamingTitle} onChange={(e) => setRenamingTitle(e.target.value)} className="h-8" autoFocus onKeyDown={(e) => e.key === 'Enter' && confirmRenameEntry(entry.id)} />
                    <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0" onClick={() => confirmRenameEntry(entry.id)}><Check className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0" onClick={cancelRename}><X className="h-4 w-4" /></Button>
                </div>
            ) : (
                <>
                    <div className="overflow-hidden">
                        <p className="font-medium truncate">{entry.title}</p>
                        <p className="text-xs text-muted-foreground">{format(new Date(entry.date), 'dd-MM-yyyy p')}</p>
                    </div>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100" onClick={(e) => e.stopPropagation()}>
                                <MoreVertical className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuItem onClick={(e) => {e.stopPropagation(); startRenameEntry(entry)}}><Edit className="mr-2 h-4 w-4" /> Rename</DropdownMenuItem>
                            <DropdownMenuItem onClick={(e) => {e.stopPropagation(); deleteEntry(entry.id)}} className="text-destructive"><Trash className="mr-2 h-4 w-4" /> Delete</DropdownMenuItem>
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
                    <CardTitle className="font-headline">My Entries</CardTitle>
                    <CardDescription>Your journal history</CardDescription>
                </div>
                <Button variant="ghost" size="icon" onClick={createNewEntry}>
                    <FilePlus className="h-5 w-5" />
                </Button>
            </CardHeader>
            <CardContent className="flex-1 p-0">
                 <ScrollArea className="h-full">
                    <div className="space-y-2 p-2">
                        {entries.length === 0 && (
                             <div className="p-4 text-center text-sm text-muted-foreground">No entries yet.</div>
                        )}
                        {grouped.today.length > 0 && <p className="px-3 py-1 text-sm font-semibold text-muted-foreground">Today</p>}
                        {grouped.today.map(renderEntry)}
                        {grouped.yesterday.length > 0 && <p className="px-3 py-1 text-sm font-semibold text-muted-foreground">Yesterday</p>}
                        {grouped.yesterday.map(renderEntry)}
                        {grouped.last7Days.length > 0 && <p className="px-3 py-1 text-sm font-semibold text-muted-foreground">Previous 7 Days</p>}
                        {grouped.last7Days.map(renderEntry)}
                        {grouped.earlier.length > 0 && <p className="px-3 py-1 text-sm font-semibold text-muted-foreground">Earlier</p>}
                        {grouped.earlier.map(renderEntry)}
                    </div>
                </ScrollArea>
            </CardContent>
        </Card>
    );
};


export default function JournalPage() {
    const [entries, setEntries] = useState<JournalEntry[]>([]);
    const [activeEntryId, setActiveEntryId] = useState<string | null>(null);
    const [renamingId, setRenamingId] = useState<string | null>(null);
    const [renamingTitle, setRenamingTitle] = useState('');
    const { toast } = useToast();
    const isMobile = useIsMobile();
    const [sheetOpen, setSheetOpen] = useState(false);
    
    const createNewEntry = () => {
        const newEntry: JournalEntry = {
            id: `entry-${new Date().getTime()}-${Math.random().toString(36).substring(7)}`,
            title: "New Entry",
            content: "",
            date: new Date(),
        };
        setEntries(prev => [newEntry, ...prev]);
        setActiveEntryId(newEntry.id);
        if (isMobile) setSheetOpen(false);
    };

    // Load entries from localStorage
    useEffect(() => {
        try {
            const savedEntries = localStorage.getItem('journalEntries');
            const parsedEntries: JournalEntry[] = savedEntries ? JSON.parse(savedEntries).map((e: any) => ({
                    ...e,
                    date: new Date(e.date)
                })) : [];
            
            if (parsedEntries.length > 0) {
                const sortedEntries = parsedEntries.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
                setEntries(sortedEntries);
                setActiveEntryId(sortedEntries[0].id);
            } else {
                createNewEntry();
            }

        } catch (error) {
            console.error("Failed to load journal entries from localStorage", error);
            createNewEntry();
        }
    }, []);
    
    // Auto-save on change
    useEffect(() => {
        if(entries.length > 0) {
            try {
                // Filter out the initial blank new entry if it's untouched
                const entriesToSave = entries.filter(entry => entry.content.trim() !== '' || entry.title !== 'New Entry');
                if (entriesToSave.length > 0) {
                    localStorage.setItem('journalEntries', JSON.stringify(entriesToSave));
                } else {
                    localStorage.removeItem('journalEntries');
                }
            } catch (error) {
                 console.error("Failed to save journal entries to localStorage", error);
            }
        } else if (entries.length === 0) {
            localStorage.removeItem('journalEntries');
        }
    }, [entries]);

    const activeEntry = entries.find(e => e.id === activeEntryId);


    const deleteEntry = (id: string) => {
        setEntries(prev => {
            const remainingEntries = prev.filter(e => e.id !== id);
             if (activeEntryId === id) {
                if (remainingEntries.length > 0) {
                    const sortedRemaining = [...remainingEntries].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
                    setActiveEntryId(sortedRemaining[0].id);
                } else {
                    setActiveEntryId(null); // This will trigger the empty state view
                }
            }
            if (remainingEntries.length === 0) {
                setActiveEntryId(null);
            }
            return remainingEntries;
        });
        toast({ title: "Entry deleted." });
    };
    
    const startRenameEntry = (entry: JournalEntry) => {
        setRenamingId(entry.id);
        setRenamingTitle(entry.title);
    };
    
    const confirmRenameEntry = (id: string) => {
        if (!renamingTitle.trim()) return;
        setEntries(prev => prev.map(e => e.id === id ? { ...e, title: renamingTitle, date: new Date() } : e));
        setRenamingId(null);
        setRenamingTitle('');
    }

    const cancelRename = () => {
        setRenamingId(null);
        setRenamingTitle('');
    }
    
    const handleSetActiveEntryId = (id: string) => {
        setActiveEntryId(id);
        if (isMobile) setSheetOpen(false);
    }
    
    const updateContent = (content: string) => {
        if(activeEntryId) {
            setEntries(prev => prev.map(e => {
                if (e.id === activeEntryId) {
                    const isNewUntouchedEntry = e.title === 'New Entry' && e.content === '';
                    return { 
                        ...e, 
                        content, 
                        // Set title from first line of content if it's a new entry
                        title: isNewUntouchedEntry && content.trim() ? content.substring(0, 30) + (content.length > 30 ? '...' : '') : e.title,
                        date: new Date() 
                    };
                }
                return e;
            }));
        }
    };

    const saveTasks = () => {
        try {
            // Filter out empty new entries before saving
            const entriesToSave = entries.filter(entry => entry.content.trim() !== '' || entry.title !== 'New Entry');
            localStorage.setItem('journalEntries', JSON.stringify(entriesToSave));
            toast({
                title: "Journal Saved!",
                description: "Your entries have been successfully saved.",
            });
        } catch (error) {
             console.error("Failed to save journal entries to localStorage", error);
             toast({
                title: "Error",
                description: "Could not save your journal entries.",
                variant: "destructive"
             })
        }
    }
    
    const journalListProps = {
        entries: entries.filter(e => e.content.trim() !== '' || e.title !== 'New Entry' || e.id === activeEntryId),
        activeEntryId, renamingId, renamingTitle,
        setActiveEntryId: handleSetActiveEntryId,
        startRenameEntry,
        confirmRenameEntry,
        setRenamingTitle,
        cancelRename,
        deleteEntry,
        createNewEntry
    };

    return (
        <div className="grid h-[calc(100vh-5rem)] md:h-[calc(100vh-8rem)] grid-cols-1 md:grid-cols-3 md:gap-6 lg:grid-cols-4">
            
            {/* Desktop Sidebar */}
            <div className="hidden md:flex md:col-span-1 lg:col-span-1">
                <JournalList {...journalListProps} />
            </div>

            {/* Main Content Area */}
            <Card className="md:col-span-2 lg:col-span-3 flex flex-col border-0 md:border">
                {activeEntry ? (
                    <>
                        <CardHeader className="flex flex-row items-center justify-between">
                             <div className="flex items-center gap-2">
                                <Button asChild variant="ghost" size="icon">
                                     <Link href="/dashboard"><ArrowLeft/></Link>
                                </Button>
                                <div className="flex flex-col">
                                    <CardTitle className="font-headline text-2xl">{activeEntry.title}</CardTitle>
                                    <CardDescription>{format(new Date(activeEntry.date), 'dd-MM-yyyy p')}</CardDescription>
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
                                         <SheetHeader><SheetTitle className="sr-only">Journal History</SheetTitle></SheetHeader>
                                         <JournalList {...journalListProps} />
                                    </SheetContent>
                                </Sheet>
                                <Button onClick={createNewEntry} variant="outline">
                                    <FilePlus className="mr-2 h-4 w-4" />
                                    <span className="hidden md:inline">New Entry</span>
                                </Button>
                                <Button onClick={saveTasks}>
                                    <Save className="mr-2 h-4 w-4" />
                                    <span className="hidden md:inline">Save</span>
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="flex-1">
                            <Textarea
                                className="h-full resize-none text-base border-0 focus-visible:ring-0 px-2 md:px-6"
                                value={activeEntry.content}
                                onChange={(e) => updateContent(e.target.value)}
                                placeholder="Start writing your thoughts..."
                            />
                        </CardContent>
                    </>
                ) : (
                    <div className="flex flex-col items-center justify-center h-full text-center p-4 relative">
                        <Button asChild variant="ghost" size="icon" className="absolute top-4 left-4">
                            <Link href="/dashboard"><ArrowLeft /></Link>
                        </Button>
                        <FilePlus className="w-12 h-12 text-muted-foreground" />
                        <h2 className="text-xl font-semibold">Start Writing</h2>
                        <p className="text-muted-foreground">Click the "New Entry" button to begin your journal.</p>
                        <Button onClick={createNewEntry}>
                            <FilePlus className="mr-2 h-4 w-4" /> New Entry
                        </Button>
                    </div>
                )}
            </Card>
        </div>
    );
}

    