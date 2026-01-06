'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { Plus, Trash2, LogOut, Pencil, Check, X, ClipboardList, CheckCircle2 } from 'lucide-react';
import { useSession, signOut } from "@/lib/auth-client";

interface Task {
  id: number;
  title: string;
  description: string | null;
  status: string;
}

export default function DashboardPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTitle, setNewTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [editingTaskId, setEditingTaskId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const router = useRouter();

  const { data: session, isPending } = useSession();

  useEffect(() => {
    if (!isPending && !session) {
      router.push('/login');
      return;
    }
    if (session) { fetchTasks(); }
  }, [session, isPending]);

  const fetchTasks = async () => {
    try {
      const response = await api.get('/tasks/', {
        headers: { 'X-User-Email': session?.user.email || '' }
      });
      setTasks(response.data);
    } catch (error) { console.error(error); } finally { setLoading(false); }
  };

  const addTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !session) return;
    try {
      const response = await api.post('/tasks/', { title: newTitle }, {
        headers: { 'X-User-Email': session?.user.email || '' }
      });
      setTasks([...tasks, response.data]);
      setNewTitle('');
    } catch (error) { console.error(error); }
  };

  const toggleTask = async (task: Task) => {
    if (!session) return;
    const newStatus = task.status === 'completed' ? 'pending' : 'completed';
    try {
      const response = await api.put(`/tasks/${task.id}`, { status: newStatus }, {
        headers: { 'X-User-Email': session?.user.email || '' }
      });
      setTasks(tasks.map(t => t.id === task.id ? response.data : t));
    } catch (error) { console.error(error); }
  };

  const updateTaskTitle = async (id: number) => {
    if (!editTitle.trim() || !session) return;
    try {
      const response = await api.put(`/tasks/${id}`, { title: editTitle }, {
        headers: { 'X-User-Email': session?.user.email || '' }
      });
      setTasks(tasks.map(t => t.id === id ? response.data : t));
      setEditingTaskId(null);
    } catch (error) { console.error(error); }
  };

  const deleteTask = async (id: number) => {
    if (!session) return;
    try {
      await api.delete(`/tasks/${id}`, {
        headers: { 'X-User-Email': session?.user.email || '' }
      });
      setTasks(tasks.filter(t => t.id !== id));
    } catch (error) { console.error(error); }
  };

  const handleLogout = async () => {
    await signOut({ fetchOptions: { onSuccess: () => router.push("/login") } });
  };

  if (isPending || loading) return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="flex flex-col items-center gap-2">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
        <p className="text-gray-500 font-medium">Loading your tasks...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-xl mx-auto">
        
        {/* Header Card */}
        <div className="bg-white rounded-3xl p-6 shadow-sm mb-6 flex justify-between items-center border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 p-2 rounded-2xl">
              <ClipboardList className="text-blue-600 w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">My ToDo's 🚀</h1>
              <p className="text-xs text-gray-400 font-medium">{session?.user.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="p-2.5 bg-gray-50 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-xl transition-all border border-gray-100"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>

        {/* Input Area */}
        <form onSubmit={addTask} className="relative mb-8">
          <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="What's on your mind? ✨"
            className="w-full bg-white border border-gray-200 rounded-2xl py-4 pl-6 pr-16 focus:outline-none focus:ring-2 focus:ring-blue-500/20 shadow-sm text-gray-700"
          />
          <button
            type="submit"
            className="absolute right-2 top-2 bottom-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all active:scale-95 flex items-center shadow-md shadow-blue-200"
          >
            <Plus className="w-5 h-5" />
          </button>
        </form>

        {/* Tasks Section */}
        <div className="space-y-3">
          {tasks.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-5xl mb-4">💤</div>
              <p className="text-gray-400 font-medium">Nothing to do? Add some tasks!</p>
            </div>
          ) : (
            tasks.map((task) => (
              <div 
                key={task.id} 
                className={`flex items-center justify-between p-4 rounded-2xl transition-all border shadow-sm group ${
                  task.status === 'completed' 
                  ? 'bg-gray-50/80 border-gray-100' 
                  : 'bg-white border-white hover:border-blue-100'
                }`}
              >
                <div className="flex items-center gap-4 flex-1">
                  <button 
                    onClick={() => toggleTask(task)}
                    className={`shrink-0 w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${
                      task.status === 'completed' 
                      ? 'bg-blue-500 border-blue-500' 
                      : 'border-gray-200 bg-white group-hover:border-blue-300'
                    }`}
                  >
                    {task.status === 'completed' && <Check className="w-4 h-4 text-white" />}
                  </button>

                  {editingTaskId === task.id ? (
                    <div className="flex items-center flex-1 gap-2">
                      <input
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        className="w-full bg-gray-50 rounded-lg px-2 py-1 outline-none border border-blue-200 text-gray-700"
                        autoFocus
                      />
                      <button onClick={() => updateTaskTitle(task.id)} className="text-blue-600"><CheckCircle2 className="w-5 h-5"/></button>
                    </div>
                  ) : (
                    <span className={`text-[16px] font-medium transition-all ${
                      task.status === 'completed' ? 'text-gray-400 line-through' : 'text-gray-700'
                    }`}>
                      {task.status === 'completed' ? '🎯 ' : '📚 '}
                      {task.title}
                    </span>
                  )}
                </div>

                {/* Card Actions */}
                <div className="flex items-center gap-1">
                  <button 
                    onClick={() => {setEditingTaskId(task.id); setEditTitle(task.title)}} 
                    className="p-2 text-gray-300 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-all"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => deleteTask(task.id)} 
                    className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Stats Footer */}
        {tasks.length > 0 && (
          <div className="mt-10 flex justify-center">
            <div className="bg-white px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest text-gray-400 border border-gray-200 shadow-sm">
              Done: {tasks.filter(t => t.status === 'completed').length} / {tasks.length}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}