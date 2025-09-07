'use client';
import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, Trash } from 'lucide-react';

interface Task {
  id: number;
  text: string;
  completed: boolean;
}

export default function TasksPage() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [newTask, setNewTask] = useState('');

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
    
    const completedTasks = tasks.filter(t => t.completed).length;
    const totalTasks = tasks.length;

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
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
    </Card>
  );
}
