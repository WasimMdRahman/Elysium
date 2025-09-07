import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FilePlus, MoreVertical, Trash, Edit } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const journalEntries = [
    { id: 1, title: 'My Thoughts on Today', date: 'June 10, 2024', snippet: 'Today was a rollercoaster of emotions. I started the day feeling...' },
    { id: 2, title: 'A Moment of Clarity', date: 'June 9, 2024', snippet: 'While meditating this morning, I had a realization about my recent anxiety...' },
    { id: 3, title: 'Reflections on a Tough Week', date: 'June 7, 2024', snippet: 'This week was challenging, but I learned a lot about my own resilience...' },
    { id: 4, title: 'Goals for the Future', date: 'June 5, 2024', snippet: 'I am setting some new intentions for the coming month. First, I want to...' },
];

export default function JournalPage() {
  return (
    <div className="grid h-[calc(100vh-8rem)] grid-cols-1 gap-6 md:grid-cols-3 lg:grid-cols-4">
        <Card className="md:col-span-1 lg:col-span-1 flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle className="font-headline">My Entries</CardTitle>
                    <CardDescription>Your journal history</CardDescription>
                </div>
                <Button variant="ghost" size="icon">
                    <FilePlus className="h-5 w-5" />
                </Button>
            </CardHeader>
            <CardContent className="flex-1 p-0">
                 <ScrollArea className="h-full">
                    <div className="space-y-2 p-2">
                    {journalEntries.map(entry => (
                        <div key={entry.id} className="group flex justify-between items-center rounded-md p-3 hover:bg-muted cursor-pointer">
                            <div className="overflow-hidden">
                                <p className="font-medium truncate">{entry.title}</p>
                                <p className="text-xs text-muted-foreground">{entry.date}</p>
                            </div>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100">
                                        <MoreVertical className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    <DropdownMenuItem><Edit className="mr-2 h-4 w-4" /> Rename</DropdownMenuItem>
                                    <DropdownMenuItem className="text-destructive"><Trash className="mr-2 h-4 w-4" /> Delete</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    ))}
                    </div>
                 </ScrollArea>
            </CardContent>
        </Card>
        <Card className="md:col-span-2 lg:col-span-3 flex flex-col">
            <CardHeader>
                <CardTitle className="font-headline text-2xl">{journalEntries[0].title}</CardTitle>
                <CardDescription>{journalEntries[0].date}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
                <Textarea 
                    className="h-full resize-none text-base" 
                    defaultValue="Today was a rollercoaster of emotions. I started the day feeling motivated and productive, tackling my to-do list with energy. However, an unexpected email in the afternoon brought up some old anxieties, and I found my focus slipping. I used the 5-4-3-2-1 grounding technique from the exercises library, which helped me return to the present moment. I'm proud of how I handled it, even though it was tough. It's a reminder that progress isn't linear, and it's okay to have moments of struggle."
                />
            </CardContent>
        </Card>
    </div>
  );
}
