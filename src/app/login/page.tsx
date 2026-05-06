"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { GraduationCap, Lock, User, ChevronRight, Loader2, ArrowLeft } from "lucide-react";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (res.ok) {
        // Salva uma flag simples no localStorage para persistência local
        localStorage.setItem("sima_admin_auth", "true");
        router.push("/admin");
      } else {
        setError(data.error);
      }
    } catch (err: any) {
      console.error("Login error:", err);
      setError("Erro de conexão: " + (err.message || "Verifique sua rede"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-surface-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000">
        <div className="text-center space-y-4">
          <div className="w-24 h-24 bg-white rounded-[32px] flex items-center justify-center border border-surface-100 shadow-2xl shadow-primary-500/10 mx-auto mb-8">
            <GraduationCap size={48} className="text-primary-600" />
          </div>
          <h1 className="text-5xl font-black tracking-tighter text-surface-900">SIMA</h1>
          <p className="text-primary-600/40 text-sm font-black uppercase tracking-[0.3em]">Acesso Administrativo</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="label-minimal">Usuário</label>
              <div className="relative">
                <User size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-surface-900/20" />
                <input 
                  className="input-clean pl-12" 
                  placeholder="Seu usuário" 
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="label-minimal">Senha</label>
              <div className="relative">
                <Lock size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-surface-900/20" />
                <input 
                  type="password"
                  className="input-clean pl-12" 
                  placeholder="Sua senha" 
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>

          {error && (
            <div className="bg-danger-50 text-danger-600 p-4 rounded-2xl text-xs font-black uppercase tracking-wider text-center animate-shake">
              {error}
            </div>
          )}

          <button 
            type="submit" 
            disabled={loading}
            className="w-full h-20 bg-primary-600 text-white rounded-[32px] text-xl font-black shadow-2xl shadow-primary-500/40 hover:bg-primary-700 active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" size={24} /> : (
              <>Entrar no Painel <ChevronRight size={24} /></>
            )}
          </button>
        </form>

        <div className="text-center pt-4">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-surface-900/40 hover:text-primary-600 font-bold text-xs uppercase tracking-widest transition-all"
          >
            <ArrowLeft size={16} /> Voltar para Avaliação
          </Link>
        </div>
      </div>
    </main>
  );
}
