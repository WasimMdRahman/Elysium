'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FilePlus, MoreVertical, Trash, Edit } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from '@/components/ui/input';

interface JournalEntry {
    id: string;
    title: string;
    content: string;
    date: Date;
}

export default function JournalPage() {
    const [entries, setEntries] = useState<JournalEntry[]>([]);
    const [activeEntryId, setActiveEntryId] = useState<string | null>(null);

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
        setEntries(prev => prev.filter(e => e.id !== id));
        if (activeEntryId === id) {
            setActiveEntryId(null);
        }
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
                                        <p className="text-xs text-muted-foreground">{entry.date.toLocaleDateString()}</p>
                                    </div>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100">
                                                <MoreVertical className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent>
                                            <DropdownMenuItem onClick={() => renameEntry(entry.id)}><Edit className="mr-2 h-4 w-4" /> Rename</DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => deleteEntry(entry.id)} className="text-destructive"><Trash className="mr-2 h-4 w-4" /> Delete</DropdownMenuItem>
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
                        <CardHeader>
                            <CardTitle className="font-headline text-2xl">{activeEntry.title}</CardTitle>
                            <CardDescription>{activeEntry.date.toLocaleString()}</CardDescription>
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
