// src\app\dashboard\page.tsx
"use client"

import type React from "react"

import { useEffect, useState } from "react"
import axios from "axios"
import {
  Plus,
  Trash2,
  CheckCircle,
  Circle,
  LogOut,
  Pencil,
  Check,
  X,
  Loader2,
  LayoutDashboard,
  ListTodo,
  User,
  Search,
  Clock
} from "lucide-react"
import { useSession, signOut } from "@/lib/auth-client"
import { useTasks } from "@/context/TaskContext"

export default function DashboardPage() {
  const { tasks, loading, refreshTasks, setTasks } = useTasks()
  const [newTitle, setNewTitle] = useState("")
  const [editingTaskId, setEditingTaskId] = useState<number | null>(null)
  const [editTitle, setEditTitle] = useState("")
  const [searchQuery, setSearchQuery] = useState("")

  const { data: session, isPending } = useSession()
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1"

  useEffect(() => {
    if (!isPending && !session) {
      window.location.href = "/login"
    }
  }, [session, isPending])

  const addTask = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTitle.trim() || !session) return

    try {
      const response = await axios.post(
        `${API_URL}/tasks/`,
        { title: newTitle },
        {
          headers: { Authorization: `Bearer ${session.session.token}` },
        },
      )
      setTasks([...tasks, response.data])
      setNewTitle("")
    } catch (error) {
      console.error("Failed to add task", error)
    }
  }

  const toggleTask = async (task: any) => {
    if (!session) return
    try {
      const newStatus = task.status === "completed" ? "pending" : "completed"
      const response = await axios.put(
        `${API_URL}/tasks/${task.id}`,
        { status: newStatus },
        {
          headers: { Authorization: `Bearer ${session.session.token}` },
        },
      )
      setTasks(tasks.map((t) => (t.id === task.id ? response.data : t)))
    } catch (error) {
      console.error("Failed to toggle task", error)
    }
  }

  const updateTaskTitle = async (id: number) => {
    if (!editTitle.trim() || !session) return
    try {
      const response = await axios.put(
        `${API_URL}/tasks/${id}`,
        { title: editTitle },
        {
          headers: { Authorization: `Bearer ${session.session.token}` },
        },
      )
      setTasks(tasks.map((t) => (t.id === id ? response.data : t)))
      setEditingTaskId(null)
    } catch (error) {
      console.error("Failed to update task title", error)
    }
  }

  const deleteTask = async (id: number) => {
    if (!session) return
    try {
      await axios.delete(`${API_URL}/tasks/${id}`, {
        headers: { Authorization: `Bearer ${session.session.token}` },
      })
      setTasks(tasks.filter((t) => t.id !== id))
    } catch (error) {
      console.error("Failed to delete task", error)
    }
  }

  const handleLogout = async () => {
    await signOut({
      fetchOptions: {
        onSuccess: () => {
          window.location.href = "/login"; // ✅ Curly braces ka matlab "no return"
          },
        },
      })
    }

  const filteredTasks = tasks.filter((t) => t.title.toLowerCase().includes(searchQuery.toLowerCase()))

  if (isPending || loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="text-muted-foreground animate-pulse">Synchronizing your tasks...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      {/* Sidebar Navigation */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-card border-r border-border hidden md:flex flex-col p-6 gap-8">
        <div className="flex items-center gap-3 px-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <LayoutDashboard className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="font-bold text-xl tracking-tight">TaskFlow</span>
        </div>

        <nav className="flex flex-col gap-2">
          <button className="flex items-center gap-3 px-4 py-3 rounded-xl bg-primary/10 text-primary font-medium transition-colors">
            <ListTodo className="w-5 h-5" />
            Dashboard
          </button>
          <button className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-accent text-muted-foreground hover:text-foreground transition-colors">
            <User className="w-5 h-5" />
            Profile
          </button>
        </nav>

        <div className="mt-auto">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-xl hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors group"
          >
            <LogOut className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="md:ml-64 p-4 md:p-10 max-w-5xl mx-auto w-full">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Overview</h1>
            <p className="text-muted-foreground">Manage your daily objectives and tracking.</p>
          </div>
          <div className="flex items-center gap-3 bg-card border border-border px-3 py-2 rounded-xl w-full md:w-auto">
            <Search className="w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search tasks..."
              className="bg-transparent border-none outline-none text-sm w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </header>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
          
          {/* Card 1: Total Tasks (Blue) */}
          <div className="relative overflow-hidden bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20 p-6 rounded-3xl hover:border-blue-500/40 transition-all duration-300 shadow-lg shadow-blue-500/5 group">
            <div className="flex justify-between items-start relative z-10">
              <div>
                <p className="text-sm font-medium text-blue-400 mb-1 flex items-center gap-2">
                   Total Missions
                </p>
                <p className="text-4xl font-bold text-foreground tracking-tight">{tasks.length}</p>
              </div>
              <div className="p-3 bg-blue-500/20 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                <ListTodo className="w-6 h-6 text-blue-400" />
              </div>
            </div>
            {/* Background Glow Effect */}
            <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-blue-500/20 blur-3xl rounded-full group-hover:bg-blue-500/30 transition-all"></div>
          </div>

          {/* Card 2: Completed (Green) */}
          <div className="relative overflow-hidden bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 p-6 rounded-3xl hover:border-emerald-500/40 transition-all duration-300 shadow-lg shadow-emerald-500/5 group">
            <div className="flex justify-between items-start relative z-10">
              <div>
                <p className="text-sm font-medium text-emerald-400 mb-1">Completed</p>
                <p className="text-4xl font-bold text-foreground tracking-tight">
                  {tasks.filter((t) => t.status === "completed").length}
                </p>
              </div>
              <div className="p-3 bg-emerald-500/20 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                <CheckCircle className="w-6 h-6 text-emerald-400" />
              </div>
            </div>
             <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-emerald-500/20 blur-3xl rounded-full group-hover:bg-emerald-500/30 transition-all"></div>
          </div>

          {/* Card 3: Pending (Orange) */}
          <div className="relative overflow-hidden bg-gradient-to-br from-orange-500/10 to-amber-500/10 border border-orange-500/20 p-6 rounded-3xl hover:border-orange-500/40 transition-all duration-300 shadow-lg shadow-orange-500/5 group">
            <div className="flex justify-between items-start relative z-10">
              <div>
                <p className="text-sm font-medium text-orange-400 mb-1">Pending</p>
                <p className="text-4xl font-bold text-foreground tracking-tight">
                  {tasks.filter((t) => t.status !== "completed").length}
                </p>
              </div>
              <div className="p-3 bg-orange-500/20 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                <Clock className="w-6 h-6 text-orange-400" />
              </div>
            </div>
             <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-orange-500/20 blur-3xl rounded-full group-hover:bg-orange-500/30 transition-all"></div>
          </div>

        </div>

        {/* Task Input */}
        <form onSubmit={addTask} className="relative mb-8">
          <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="Create a new mission..."
            className="w-full bg-card border border-border rounded-2xl px-6 py-4 pr-16 focus:ring-2 focus:ring-primary/20 outline-none transition-all shadow-sm"
          />
          <button
            type="submit"
            disabled={!newTitle.trim()}
            className="absolute right-3 top-1/2 -translate-y-1/2 bg-primary text-primary-foreground p-2 rounded-xl hover:opacity-90 disabled:opacity-50 transition-all shadow-lg shadow-primary/20"
          >
            <Plus className="w-6 h-6" />
          </button>
        </form>

        {/* Task List */}
        <div className="bg-card rounded-2xl border border-border overflow-hidden shadow-sm">
          {filteredTasks.length === 0 ? (
            <div className="p-16 text-center">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <ListTodo className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="font-semibold text-lg">No tasks found</h3>
              <p className="text-muted-foreground">Try adjusting your search or add a new task.</p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {filteredTasks.map((task) => (
                <div
                  key={task.id}
                  className="group flex items-center justify-between p-5 hover:bg-accent/50 transition-all"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <button onClick={() => toggleTask(task)} className="transition-transform active:scale-90">
                      {task.status === "completed" ? (
                        <CheckCircle className="w-6 h-6 text-primary fill-primary/10" />
                      ) : (
                        <Circle className="w-6 h-6 text-muted-foreground hover:text-primary transition-colors" />
                      )}
                    </button>

                    {editingTaskId === task.id ? (
                      <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        className="flex-1 bg-background border border-primary/30 rounded-lg px-3 py-1.5 focus:outline-none ring-2 ring-primary/10"
                        autoFocus
                        onKeyDown={(e) => e.key === "Enter" && updateTaskTitle(task.id)}
                      />
                    ) : (
                      <div className="flex flex-col">
                        <span
                          className={`font-medium transition-all ${
                            task.status === "completed" ? "line-through text-muted-foreground" : "text-foreground"
                          }`}
                        >
                          {task.title}
                        </span>
                        <div className="flex items-center gap-2 mt-1">
                          <span
                            className={`text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full ${
                              task.status === "completed"
                                ? "bg-primary/10 text-primary"
                                : "bg-muted text-muted-foreground"
                            }`}
                          >
                            {task.status}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {editingTaskId === task.id ? (
                      <>
                        <button
                          onClick={() => updateTaskTitle(task.id)}
                          className="p-2 text-primary hover:bg-primary/10 rounded-lg"
                        >
                          <Check className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => setEditingTaskId(null)}
                          className="p-2 text-muted-foreground hover:bg-muted rounded-lg"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => {
                            setEditingTaskId(task.id)
                            setEditTitle(task.title)
                          }}
                          className="p-2 text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteTask(task.id)}
                          className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
