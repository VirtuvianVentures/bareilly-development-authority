import { useState } from "react";
import { useLocation } from "wouter";
import { Shield, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";

export default function AdminLogin() {
  const { login } = useAuth();
  const [, setLocation] = useLocation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(username, password);
      setLocation("/portal");
    } catch (err: any) {
      setError(err.message ?? "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a3a6e] to-[#0d2447] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="bg-[#1a3a6e] px-8 py-7 text-white text-center">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-3">
            <Shield className="h-8 w-8 text-[#1a3a6e]" />
          </div>
          <h1 className="text-xl font-bold">Bareilly Development Authority</h1>
          <p className="text-blue-200 text-sm mt-1">Enterprise Resource Planning (ERP)</p>
        </div>

        <form onSubmit={handleSubmit} className="px-8 py-7 space-y-5">
          <div>
            <Label htmlFor="username" className="text-gray-700 font-medium">Username</Label>
            <Input id="username" type="text" autoComplete="username" value={username}
              onChange={e => setUsername(e.target.value)} placeholder="Enter your username"
              className="mt-1.5" required />
          </div>
          <div>
            <Label htmlFor="password" className="text-gray-700 font-medium">Password</Label>
            <Input id="password" type="password" autoComplete="current-password" value={password}
              onChange={e => setPassword(e.target.value)} placeholder="Enter your password"
              className="mt-1.5" required />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-2.5 rounded-lg">
              {error}
            </div>
          )}

          <Button type="submit" disabled={loading} className="w-full bg-[#1a3a6e] hover:bg-[#0d2447] text-white py-2.5 font-semibold">
            {loading ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Signing in…</> : "Sign In"}
          </Button>
          <p className="text-center text-xs text-gray-400 pt-1">
            Government of Uttar Pradesh — Authorised users only
          </p>
        </form>
      </div>
    </div>
  );
}
