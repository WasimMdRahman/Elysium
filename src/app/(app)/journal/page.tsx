'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FilePlus, MoreVertical, Trash, Edit, Save } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useToast } from '@/hooks/use-toast';


interface JournalEntry {
    id: string;
    title: string;
    content: string;
    date: Date;
}

export default function JournalPage() {
    const [entries, setEntries] = useState<JournalEntry[]>([]);
    const [activeEntryId, setActiveEntryId] = useState<string | null>(null);
    const { toast } = useToast();

    // Load entries from localStorage
    useEffect(() => {
        try {
            const savedEntries = localStorage.getItem('journalEntries');
            if (savedEntries) {
                const parsedEntries = JSON.parse(savedEntries).map((e: any) => ({
                    ...e,
                    date: new Date(e.date)
                }));
                setEntries(parsedEntries);
                if (parsedEntries.length > 0) {
                    setActiveEntryId(parsedEntries.sort((a:any,b:any) => new Date(b.date).getTime() - new Date(a.date).getTime())[0].id);
                }
            }
        } catch (error) {
            console.error("Failed to load journal entries from localStorage", error);
        }
    }, []);

    const activeEntry = entries.find(e => e.id === activeEntryId);

    const createNewEntry = () => {
        const newEntry: JournalEntry = {
            id: `entry-${Date.now()}`,
            title: "New Entry",
            content: "",
            date: new Date(),
        };
        setEntries(prev => [newEntry, ...prev]);
        setActiveEntryId(newEntry.id);
    };

    const deleteEntry = (id: string) => {
        setEntries(prev => {
            const newEntries = prev.filter(e => e.id !== id);
             if (activeEntryId === id) {
                const sortedEntries = newEntries.sort((a,b) => b.date.getTime() - a.date.getTime());
                setActiveEntryId(sortedEntries.length > 0 ? sortedEntries[0].id : null);
            }
            if (newEntries.length === 0) {
                localStorage.removeItem('journalEntries');
            }
            return newEntries;
        });
        toast({ title: "Entry deleted." });

    };
    
    const renameEntry = (id: string) => {
        const newTitle = prompt("Enter new title:");
        if (newTitle) {
            setEntries(prev => prev.map(e => e.id === id ? { ...e, title: newTitle } : e));
        }
    };
    
    const updateContent = (content: string) => {
        if(activeEntryId) {
            setEntries(prev => prev.map(e => e.id === activeEntryId ? { ...e, content } : e));
        }
    };

    const saveEntries = () => {
        try {
            localStorage.setItem('journalEntries', JSON.stringify(entries));
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

    return (
        <div className="grid h-[calc(100vh-8rem)] grid-cols-1 gap-6 md:grid-cols-3 lg:grid-cols-4">
            <Card className="md:col-span-1 lg:col-span-1 flex flex-col">
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
                            {entries.sort((a,b) => b.date.getTime() - a.date.getTime()).map(entry => (
                                <div key={entry.id} onClick={() => setActiveEntryId(entry.id)} className={`group flex justify-between items-center rounded-md p-3 cursor-pointer ${activeEntryId === entry.id ? 'bg-muted' : 'hover:bg-muted'}`}>
                                    <div className="overflow-hidden">
                                        <p className="font-medium truncate">{entry.title}</p>
                                        <p className="text-xs text-muted-foreground">{new Date(entry.date).toLocaleDateString()}</p>
                                    </div>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100" onClick={(e) => e.stopPropagation()}>
                                                <MoreVertical className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent>
                                            <DropdownMenuItem onClick={(e) => {e.stopPropagation(); renameEntry(entry.id)}}><Edit className="mr-2 h-4 w-4" /> Rename</DropdownMenuItem>
                                            <DropdownMenuItem onClick={(e) => {e.stopPropagation(); deleteEntry(entry.id)}} className="text-destructive"><Trash className="mr-2 h-4 w-4" /> Delete</DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            ))}
                        </div>
                    </ScrollArea>
                </CardContent>
            </Card>
            <Card className="md:col-span-2 lg:col-span-3 flex flex-col">
                {activeEntry ? (
                    <>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle className="font-headline text-2xl">{activeEntry.title}</CardTitle>
                                <CardDescription>{new Date(activeEntry.date).toLocaleString()}</CardDescription>
                            </div>
                             <Button onClick={saveEntries}>
                                <Save className="mr-2 h-4 w-4" /> Save Journal
                            </Button>
                        </CardHeader>
                        <CardContent className="flex-1">
                            <Textarea
                                className="h-full resize-none text-base"
                                value={activeEntry.content}
                                onChange={(e) => updateContent(e.target.value)}
                                placeholder="Start writing your thoughts..."
                            />
                        </CardContent>
                    </>
                ) : (
                    <div className="flex flex-col items-center justify-center h-full">
                        <CardTitle className="font-headline">Select an entry or create a new one</CardTitle>
                        <CardDescription>Your space to reflect and grow.</CardDescription>
                        <Button onClick={createNewEntry} className="mt-4">Create New Entry</Button>
                    </div>
                )}
            </Card>
        </div>
    );
}
