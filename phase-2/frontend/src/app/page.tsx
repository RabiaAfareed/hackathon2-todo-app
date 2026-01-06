'use client';

import Link from "next/link";
import { CheckCircle, Zap, Shield, ArrowRight, Sparkles } from "lucide-react";

export default function Page() {
  return (
    <div className="min-h-screen bg-[#FDFEFF] text-slate-700 selection:bg-indigo-100">
      {/* Soft Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-100 h-100 bg-indigo-50 rounded-full blur-3xl opacity-50" />
        <div className="absolute bottom-[-10%] left-[-10%] w-100 h-100 bg-teal-50 rounded-full blur-3xl opacity-50" />
      </div>

      <div className="relative flex flex-col items-center justify-center min-h-screen px-6 py-20">
        <div className="max-w-4xl mx-auto text-center space-y-10">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-slate-100 shadow-sm animate-fade-in">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              New: Full-Stack Implementation 🚀
            </span>
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight text-slate-800 leading-[1.1]">
            Simplify Your Day,
            <span className="block bg-clip-text text-transparent bg-linear-to-r from-indigo-500 to-teal-400">
              One Task at a Time
            </span>
          </h1>

          {/* Description */}
          <p className="text-lg sm:text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed">
            A beautiful, minimal space to organize your thoughts, track your progress, and stay productive without the clutter.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
            <Link
              href="/login"
              className="group w-full sm:w-auto bg-[#6F6DAF] hover:bg-[#5b5894] text-white px-10 py-4 rounded-2xl text-lg font-bold transition-all hover:scale-105 shadow-xl shadow-indigo-100 flex items-center justify-center gap-2"
            >
              Get Started Free
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            
            <button className="w-full sm:w-auto bg-white hover:bg-slate-50 text-slate-600 px-10 py-4 rounded-2xl text-lg font-bold border border-slate-100 transition-all shadow-sm">
              Learn More
            </button>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-16">
            <div className="p-8 rounded-4xl bg-white border border-slate-50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center mb-4 mx-auto">
                <CheckCircle className="w-6 h-6 text-emerald-500" />
              </div>
              <h3 className="font-bold text-slate-800 mb-2">Beautifully Simple</h3>
              <p className="text-sm text-slate-400">Clean interface designed for focus and clarity.</p>
            </div>

            <div className="p-8 rounded-4xl bg-white border border-slate-50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center mb-4 mx-auto">
                <Zap className="w-6 h-6 text-indigo-500" />
              </div>
              <h3 className="font-bold text-slate-800 mb-2">Real-time Sync</h3>
              <p className="text-sm text-slate-400">Your tasks are always with you, everywhere.</p>
            </div>

            <div className="p-8 rounded-4xl bg-white border border-slate-50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center mb-4 mx-auto">
                <Shield className="w-6 h-6 text-rose-500" />
              </div>
              <h3 className="font-bold text-slate-800 mb-2">Private & Secure</h3>
              <p className="text-sm text-slate-400">Your data is yours. Encrypted and safe.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}