
'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, Trash, Save, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Task {
  id: number;
  text: string;
  completed: boolean;
}

export default function TasksPage() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [newTask, setNewTask] = useState('');
    const { toast } = useToast();

    // Load tasks from localStorage
    useEffect(() => {
        try {
            const savedTasks = localStorage.getItem('tasks');
            if (savedTasks) {
                setTasks(JSON.parse(savedTasks));
            }
        } catch (error) {
            console.error("Failed to load tasks from localStorage", error);
        }
    }, []);

    const handleAddTask = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTask.trim()) return;
        const newId = tasks.length > 0 ? Math.max(...tasks.map(t => t.id)) + 1 : 1;
        setTasks([...tasks, { id: newId, text: newTask, completed: false }]);
        setNewTask('');
    };
    
    const toggleTask = (id: number) => {
        setTasks(tasks.map(task => task.id === id ? { ...task, completed: !task.completed } : task));
    };

    const deleteTask = (id: number) => {
        setTasks(tasks.filter(task => task.id !== id));
    }

    const saveTasks = () => {
        try {
            localStorage.setItem('tasks', JSON.stringify(tasks));
            toast({
                title: "Tasks Saved!",
                description: "Your task list has been updated.",
            });
        } catch (error) {
            console.error("Failed to save tasks to localStorage", error);
            toast({
                title: "Error",
                description: "Could not save your tasks.",
                variant: "destructive"
            });
        }
    };
    
    const completedTasks = tasks.filter(t => t.completed).length;
    const totalTasks = tasks.length;

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <Button asChild variant="ghost" className="w-fit p-0 h-fit mb-4">
             <Link href="/dashboard"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard</Link>
        </Button>
        <CardTitle className="font-headline">Daily Task Manager</CardTitle>
        <CardDescription>
            {totalTasks > 0 
                ? `Stay on track with your mental wellness goals. You've completed ${completedTasks} of ${totalTasks} tasks.`
                : "Add a task to get started on your wellness goals."
            }
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleAddTask} className="flex gap-2 mb-4">
            <Input 
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                placeholder="Add a new task for today..."
            />
            <Button type="submit" size="icon">
                <Plus className="h-4 w-4"/>
            </Button>
        </form>
        <div className="space-y-4">
            {tasks.length > 0 ? tasks.map(task => (
                <div key={task.id} className="flex items-center space-x-3 p-3 rounded-md hover:bg-muted transition-colors group">
                    <Checkbox 
                        id={`task-${task.id}`}
                        checked={task.completed}
                        onCheckedChange={() => toggleTask(task.id)}
                    />
                    <label 
                        htmlFor={`task-${task.id}`}
                        className={`flex-1 text-sm font-medium leading-none cursor-pointer ${task.completed ? 'text-muted-foreground line-through' : 'text-foreground'}`}
                    >
                        {task.text}
                    </label>
                    <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100" onClick={() => deleteTask(task.id)}>
                        <Trash className="h-4 w-4 text-destructive" />
                    </Button>
                </div>
            )) : (
                <div className="text-center text-muted-foreground py-8">
                    <p>No tasks yet. Add one above to begin!</p>
                </div>
            )}
        </div>
      </CardContent>
      <CardFooter>
          <Button onClick={saveTasks} className="w-full">
              <Save className="mr-2 h-4 w-4" /> Save Tasks
          </Button>
      </CardFooter>
    </Card>
  );
}

    