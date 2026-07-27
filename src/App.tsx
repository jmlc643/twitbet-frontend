import { useState } from 'react';
import { isAxiosError } from 'axios';
import { useAuthStore } from '@/store/useAuthStore';
import { authApi } from '@/features/auth/api/auth.api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function App() {
  const { user, isAuthenticated, setAuth, logout } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');

  const getErrorMessage = (err: unknown): string => {
    if (isAxiosError<{ error?: string }>(err)) {
      return err.response?.data?.error || err.message;
    }
    if (err instanceof Error) {
      return err.message;
    }
    return 'Ocurrió un error inesperado';
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await authApi.login({ email, password });
      setAuth(res.user, res.token);
    } catch (err: unknown) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await authApi.register({ username, email, password });
      setAuth(res.user, res.token);
    } catch (err: unknown) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col font-sans">
      {/* Navbar pegado arriba */}
      <header className="w-full border-b border-neutral-800 bg-neutral-900/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center py-3 px-6">
          <div className="flex items-center gap-3">
            <span className="text-2xl font-black tracking-tighter text-red-600">TWITBET</span>
            <span className="text-[10px] bg-red-950/80 text-red-400 border border-red-800/60 font-mono px-2 py-0.5 rounded tracking-widest uppercase">
              PRO
            </span>
          </div>

          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              <span className="text-xs font-semibold text-neutral-300 bg-neutral-800/60 px-3 py-1.5 rounded-md border border-neutral-700/50">
                {user?.username}
              </span>
              <Button
                variant="destructive"
                size="sm"
                onClick={logout}
                className="bg-red-600/90 hover:bg-red-600 text-xs font-bold uppercase tracking-wider"
              >
                Cerrar Sesión
              </Button>
            </div>
          ) : (
            <span className="text-xs text-neutral-500 font-mono tracking-widest uppercase">
              Plataforma de Apuestas
            </span>
          )}
        </div>
      </header>

      {/* Main Content Centrado */}
      <main className="flex-1 flex items-center justify-center p-4">
        {isAuthenticated ? (
          <Card className="w-full max-w-md bg-neutral-900 border-neutral-800 text-white shadow-2xl">
            <CardHeader className="border-b border-neutral-800 pb-4">
              <CardTitle className="text-lg font-bold text-neutral-100 flex items-center justify-between">
                <span>Perfil de Usuario</span>
                <span className="text-xs text-green-400 bg-green-950/60 border border-green-800 px-2 py-0.5 rounded">
                  Activo
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 pt-6 text-xs text-neutral-300 font-mono">
              <div className="flex justify-between py-1 border-b border-neutral-800/60">
                <span className="text-neutral-500">ID</span>
                <span className="text-neutral-200">{user?.id}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-neutral-800/60">
                <span className="text-neutral-500">USUARIO</span>
                <span className="text-neutral-200">{user?.username}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-neutral-500">EMAIL</span>
                <span className="text-neutral-200">{user?.email}</span>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="w-full max-w-md bg-neutral-900 border-neutral-800 text-white shadow-2xl">
            <CardHeader className="text-center pb-2">
              <CardTitle className="text-xl font-black uppercase tracking-wide text-neutral-100">
                Acceso a la Plataforma
              </CardTitle>
            </CardHeader>
            <CardContent>
              {error && (
                <div className="mb-4 p-3 bg-red-950/80 border border-red-800/80 text-red-200 text-xs rounded-md font-medium">
                  {error}
                </div>
              )}

              <Tabs defaultValue="login" className="w-full">
                <TabsList className="grid w-full grid-cols-2 bg-neutral-950 p-1 border border-neutral-800 rounded-lg">
                  <TabsTrigger
                    value="login"
                    className="text-xs font-semibold py-2 rounded-md transition-colors text-neutral-400 hover:text-white data-[state=active]:bg-neutral-800 data-[state=active]:text-white data-[state=active]:shadow-sm"
                  >
                    Ingresar
                  </TabsTrigger>
                  <TabsTrigger
                    value="register"
                    className="text-xs font-semibold py-2 rounded-md transition-colors text-neutral-400 hover:text-white data-[state=active]:bg-neutral-800 data-[state=active]:text-white data-[state=active]:shadow-sm"
                  >
                    Registro
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="login">
                  <form onSubmit={handleLogin} className="space-y-4 mt-5">
                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
                        Correo Electrónico
                      </label>
                      <Input
                        type="email"
                        placeholder="ejemplo@twitbet.com"
                        className="bg-neutral-950 border-neutral-800 text-white placeholder:text-neutral-600 focus:border-red-600 focus:ring-1 focus:ring-red-600"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
                        Contraseña
                      </label>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        className="bg-neutral-950 border-neutral-800 text-white placeholder:text-neutral-600 focus:border-red-600 focus:ring-1 focus:ring-red-600"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>
                    <Button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-red-600 hover:bg-red-700 text-white font-bold uppercase tracking-wider text-xs py-5 mt-2 transition-all"
                    >
                      {loading ? 'Cargando...' : 'Iniciar Sesión'}
                    </Button>
                  </form>
                </TabsContent>

                <TabsContent value="register">
                  <form onSubmit={handleRegister} className="space-y-4 mt-5">
                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
                        Nombre de Usuario
                      </label>
                      <Input
                        type="text"
                        placeholder="Usuario"
                        className="bg-neutral-950 border-neutral-800 text-white placeholder:text-neutral-600 focus:border-red-600 focus:ring-1 focus:ring-red-600"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
                        Correo Electrónico
                      </label>
                      <Input
                        type="email"
                        placeholder="ejemplo@twitbet.com"
                        className="bg-neutral-950 border-neutral-800 text-white placeholder:text-neutral-600 focus:border-red-600 focus:ring-1 focus:ring-red-600"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
                        Contraseña
                      </label>
                      <Input
                        type="password"
                        placeholder="Mínimo 6 caracteres"
                        className="bg-neutral-950 border-neutral-800 text-white placeholder:text-neutral-600 focus:border-red-600 focus:ring-1 focus:ring-red-600"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>
                    <Button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-red-600 hover:bg-red-700 text-white font-bold uppercase tracking-wider text-xs py-5 mt-2 transition-all"
                    >
                      {loading ? 'Cargando...' : 'Crear Cuenta'}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}