'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn, signUp } from "@/lib/auth-client";
import { Mail, User, Lock } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // --- YE AAPKA ORIGINAL LOGIC HAI (No Changes Here) ---
  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isSignUp) {
        await signUp.email({
          email,
          password,
          name,
          callbackURL: "/dashboard"
        }, {
            onSuccess: () => {
                router.push("/dashboard");
            },
            onError: (ctx) => {
                setError(ctx.error.message || "Failed to sign up");
            }
        });
      } else {
        await signIn.email({
          email,
          password,
          callbackURL: "/dashboard"
        }, {
            onSuccess: () => {
                router.push("/dashboard");
            },
            onError: (ctx) => {
                setError(ctx.error.message || "Failed to sign in");
            }
        });
      }
    } catch (err: any) {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };
  // --- LOGIC ENDS HERE ---

  return (
    // Outer Background (Clean & Light)
    <div className="flex items-center justify-center min-h-screen bg-[#f3f4f6] p-4">
      
      {/* Slim Mobile-Style Card (Width reduced to 320px) */}
      <div className={`relative w-full max-w-105 min-h-145 rounded-[45px] shadow-2xl transition-all duration-500 flex flex-col items-center justify-center px-6 border-[6px] border-white ${isSignUp ? 'bg-[#FDF0E3]' : 'bg-[#7BC9D3]'}`}>
        
        <div className="w-full text-center">
          {/* Titles from the Picture */}
          <h1 className="text-3xl font-bold text-[#333] mb-2 tracking-tight">
            {isSignUp ? 'Sign up' : 'Login'}
          </h1>
          <p className="text-[#131212] text-[11px] mb-8 leading-relaxed px-2">
            {isSignUp ? 'Just a few quick things to get started' : 'Hello, welcome back'}
          </p>

          {/* Error Message UI */}
          {error && (
            <div className="bg-white/50 backdrop-blur-sm text-red-600 p-2 rounded-xl mb-4 text-[10px] font-bold border border-red-200">
              {error}
            </div>
          )}

          <form onSubmit={handleAuth} className="space-y-3">
            
            {/* Email Input */}
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                <Mail className="w-4 h-4" />
              </span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white rounded-full py-3.5 pl-11 pr-4 outline-none shadow-sm text-xs"
                placeholder="Email"
                required
              />
            </div>

            {/* Name Input (Signup Only) */}
            {isSignUp && (
              <div className="relative animate-in slide-in-from-top-1 duration-200">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <User className="w-4 h-4" />
                </span>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-white rounded-full py-3.5 pl-11 pr-4 outline-none shadow-sm text-xs"
                  placeholder="Username"
                  required={isSignUp}
                />
              </div>
            )}

            {/* Password Input */}
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                <Lock className="w-4 h-4" />
              </span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white rounded-full py-3.5 pl-11 pr-4 outline-none shadow-sm text-xs"
                placeholder="Password"
                required
              />
            </div>

            {/* Login/Signup Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3.5 mt-4 rounded-2xl text-white text-sm font-bold shadow-lg transition-all active:scale-95 disabled:opacity-50 ${isSignUp ? 'bg-[#7BC9D3] hover:brightness-95' : 'bg-[#6F6DAF] hover:brightness-110'}`}
            >
              {loading ? 'Processing...' : (isSignUp ? 'Create account' : 'Log in')}
            </button>
          </form>

          {/* Toggle Link */}
          <div className="mt-8">
            <p className="text-[#555] text-[10px] font-semibold">
              {isSignUp ? 'Already have an account?' : "Don't have an account?"}
              <button 
                type="button"
                onClick={() => { setIsSignUp(!isSignUp); setError(''); }}
                className="ml-1 text-[#6F6DAF] font-bold hover:underline"
              >
                {isSignUp ? 'Log in' : 'Sign Up'}
              </button>
            </p>
          </div>
        </div>

        {/* iPhone Style Home Indicator */}
        <div className="absolute bottom-3 w-20 h-1 bg-black/5 rounded-full"></div>
      </div>
    </div>
  );
}