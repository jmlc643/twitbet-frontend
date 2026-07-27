import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { isAxiosError } from 'axios';
import { Sun, Moon, Trophy, Users, ShieldCheck } from 'lucide-react';

import { useAuthStore } from '@/store/useAuthStore';
import { useThemeStore } from '@/store/useThemeStore';
import { authApi } from '@/features/auth/api/auth.api';
import { loginSchema, registerSchema } from '@/features/auth/schemas/auth.schema';

import type { LoginInput, RegisterInput } from '@/features/auth/schemas/auth.schema';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function App() {
  const { user, isAuthenticated, setAuth, logout } = useAuthStore();
  const { isDarkMode, toggleTheme, initTheme } = useThemeStore();

  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  useEffect(() => {
    initTheme();
  }, [initTheme]);

  const loginForm = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const registerForm = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  });

  const getErrorMessage = (err: unknown): string => {
    if (isAxiosError<{ error?: string }>(err)) {
      return err.response?.data?.error || err.message;
    }
    if (err instanceof Error) return err.message;
    return 'Ocurrió un error inesperado';
  };

  const onLoginSubmit = async (data: LoginInput) => {
    setLoading(true);
    setApiError('');
    try {
      const res = await authApi.login(data);
      setAuth(res.user, res.token);
    } catch (err: unknown) {
      setApiError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const onRegisterSubmit = async (data: RegisterInput) => {
    setLoading(true);
    setApiError('');
    try {
      const res = await authApi.register(data);
      setAuth(res.user, res.token);
    } catch (err: unknown) {
      setApiError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-100 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 transition-colors duration-200 font-sans">
      
      {/* NAVBAR */}
      <header className="w-full border-b border-neutral-200 dark:border-neutral-800 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center py-3 px-6">
          <div className="flex items-center gap-3">
            <span className="text-2xl font-black tracking-tighter text-red-600">TWITBET</span>
            <span className="text-[10px] bg-red-600/10 text-red-600 border border-red-600/30 font-mono px-2 py-0.5 rounded tracking-widest uppercase">
              PRO
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="icon"
              onClick={toggleTheme}
              className="h-9 w-9 rounded-lg border-neutral-300 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-700 dark:text-yellow-400 hover:bg-neutral-100 dark:hover:bg-neutral-800"
            >
              {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
            </Button>

            {isAuthenticated && (
              <Button
                variant="destructive"
                size="sm"
                onClick={logout}
                className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold uppercase"
              >
                Cerrar Sesión
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* CONTENIDO PRINCIPAL */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {isAuthenticated ? (
          /* VISTA DE PERFIL DE USUARIO */
          <div className="max-w-3xl mx-auto space-y-6">
            <Card className="w-full max-w-2xl mx-auto border bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-neutral-100 shadow-xl transition-colors duration-200">
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row items-center gap-6">
                  
                  {/* Avatar con indicador de estado */}
                  <div className="relative">
                    <img
                      src={user?.avatar_url || '/avatars/avatar1.png'}
                      alt="Avatar"
                      className="w-24 h-24 rounded-full border-4 border-red-600 object-cover bg-neutral-800"
                    />
                    <span className="absolute bottom-0 right-0 w-5 h-5 rounded-full border-2 border-white dark:border-neutral-900 bg-green-500" />
                  </div>

                  {/* Info Principal - Textos nítidos en ambos modos */}
                  <div className="flex-1 text-center sm:text-left space-y-1">
                    <h2 className="text-2xl font-black text-neutral-900 dark:text-white">
                      {user?.username}
                    </h2>

                    <p className="text-xs font-medium text-neutral-600 dark:text-neutral-400">
                      {user?.email}
                    </p>

                    <div className="flex flex-wrap gap-2 pt-2 justify-center sm:justify-start">
                      <span className="text-[11px] bg-red-600/10 text-red-600 dark:text-red-500 border border-red-600/30 px-2.5 py-0.5 rounded-full font-semibold">
                        Apostador Frecuente
                      </span>
                      <span className="text-[11px] bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border border-neutral-300 dark:border-neutral-700 px-2.5 py-0.5 rounded-full font-mono">
                        ID: {user?.id ? `${user.id.slice(0, 8)}...` : 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Estadísticas de Apuestas estilo Apuesta Total */}
                <div className="grid grid-cols-3 gap-4 mt-8 pt-6 border-t border-neutral-200 dark:border-neutral-800">
                  <div className="text-center">
                    <span className="block text-xs uppercase font-bold text-neutral-500 dark:text-neutral-400">
                      Ligas
                    </span>
                    <span className="text-xl font-black text-red-600">3</span>
                  </div>

                  <div className="text-center">
                    <span className="block text-xs uppercase font-bold text-neutral-500 dark:text-neutral-400">
                      Ganadas
                    </span>
                    <span className="text-xl font-black text-green-600 dark:text-green-500">12</span>
                  </div>

                  <div className="text-center">
                    <span className="block text-xs uppercase font-bold text-neutral-500 dark:text-neutral-400">
                      Efectividad
                    </span>
                    <span className="text-xl font-black text-amber-500">68%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          /* LANDING PAGE + AUTH CARD */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center min-h-[calc(100vh-140px)]">
            
            {/* LADO IZQUIERDO: EXPLICACIÓN DE LA APP */}
            <div className="lg:col-span-7 space-y-8 text-left">
              <div className="inline-flex items-center gap-2 bg-red-600/10 border border-red-600/20 text-red-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                <Trophy size={14} /> La plataforma #1 de Ligas Privadas
              </div>

              <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-none uppercase">
                Apuesta con amigos, <span className="text-red-600">domina el ranking</span>.
              </h1>

              <p className="text-base sm:text-lg max-w-xl text-neutral-600 dark:text-neutral-400">
                TwitBet reinventa la experiencia de apuestas deportivas. Crea ligas privadas, simula predicciones en tiempo real y demuestra quién sabe más de fútbol.
              </p>

              {/* Feature Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
                <div className="p-4 rounded-xl border bg-white dark:bg-neutral-900/60 border-neutral-200 dark:border-neutral-800 shadow-sm">
                  <Users className="text-red-600 mb-2" size={24} />
                  <h3 className="font-bold text-sm uppercase">Ligas Privadas</h3>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">Compite directamente contra tu grupo de amigos.</p>
                </div>
                <div className="p-4 rounded-xl border bg-white dark:bg-neutral-900/60 border-neutral-200 dark:border-neutral-800 shadow-sm">
                  <Trophy className="text-red-600 mb-2" size={24} />
                  <h3 className="font-bold text-sm uppercase">Cuotas en Vivo</h3>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">Predicciones dinámicas ajustadas al instante.</p>
                </div>
                <div className="p-4 rounded-xl border bg-white dark:bg-neutral-900/60 border-neutral-200 dark:border-neutral-800 shadow-sm">
                  <ShieldCheck className="text-red-600 mb-2" size={24} />
                  <h3 className="font-bold text-sm uppercase">100% Seguro</h3>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">Autenticación JWT y privacidad garantizada.</p>
                </div>
              </div>
            </div>

            {/* LADO DERECHO: FORMULARIO DE AUTH */}
            <div className="lg:col-span-5">
              <Card className="bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-white shadow-2xl">
                <CardHeader className="text-center pb-2">
                  <CardTitle className="text-xl font-black uppercase tracking-wide text-red-600">
                    Ingresar a TwitBet
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {apiError && (
                    <div className="mb-4 p-3 bg-red-950/80 border border-red-800 text-red-200 text-xs rounded-md font-medium">
                      {apiError}
                    </div>
                  )}

                  <Tabs defaultValue="login" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 p-1 border rounded-lg bg-neutral-100 dark:bg-neutral-950 border-neutral-200 dark:border-neutral-800">
                      <TabsTrigger value="login" className="text-xs font-semibold py-2">Ingresar</TabsTrigger>
                      <TabsTrigger value="register" className="text-xs font-semibold py-2">Registro</TabsTrigger>
                    </TabsList>

                    {/* FORMULARIO LOGIN */}
                    <TabsContent value="login">
                      <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4 mt-4">
                        <div>
                          <label className="text-[11px] font-semibold text-neutral-500 dark:text-neutral-400 uppercase">Correo</label>
                          <Input
                            {...loginForm.register('email')}
                            type="email"
                            placeholder="tu@email.com"
                            className="bg-neutral-50 dark:bg-neutral-950 border-neutral-300 dark:border-neutral-800"
                          />
                          {loginForm.formState.errors.email && (
                            <span className="text-[10px] text-red-500 mt-1">{loginForm.formState.errors.email.message}</span>
                          )}
                        </div>

                        <div>
                          <label className="text-[11px] font-semibold text-neutral-500 dark:text-neutral-400 uppercase">Contraseña</label>
                          <Input
                            {...loginForm.register('password')}
                            type="password"
                            placeholder="••••••••"
                            className="bg-neutral-50 dark:bg-neutral-950 border-neutral-300 dark:border-neutral-800"
                          />
                          {loginForm.formState.errors.password && (
                            <span className="text-[10px] text-red-500 mt-1">{loginForm.formState.errors.password.message}</span>
                          )}
                        </div>

                        <Button type="submit" disabled={loading} className="w-full bg-red-600 hover:bg-red-700 text-white font-bold uppercase py-5 text-xs">
                          {loading ? 'Cargando...' : 'Iniciar Sesión'}
                        </Button>
                      </form>
                    </TabsContent>

                    {/* FORMULARIO REGISTRO */}
                    <TabsContent value="register">
                      <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4 mt-4">
                        <div>
                          <label className="text-[11px] font-semibold text-neutral-500 dark:text-neutral-400 uppercase">Usuario</label>
                          <Input
                            {...registerForm.register('username')}
                            placeholder="Golazo99"
                            className="bg-neutral-50 dark:bg-neutral-950 border-neutral-300 dark:border-neutral-800"
                          />
                          {registerForm.formState.errors.username && (
                            <span className="text-[10px] text-red-500 mt-1">{registerForm.formState.errors.username.message}</span>
                          )}
                        </div>

                        <div>
                          <label className="text-[11px] font-semibold text-neutral-500 dark:text-neutral-400 uppercase">Correo</label>
                          <Input
                            {...registerForm.register('email')}
                            type="email"
                            placeholder="tu@email.com"
                            className="bg-neutral-50 dark:bg-neutral-950 border-neutral-300 dark:border-neutral-800"
                          />
                          {registerForm.formState.errors.email && (
                            <span className="text-[10px] text-red-500 mt-1">{registerForm.formState.errors.email.message}</span>
                          )}
                        </div>

                        <div>
                          <label className="text-[11px] font-semibold text-neutral-500 dark:text-neutral-400 uppercase">Contraseña</label>
                          <Input
                            {...registerForm.register('password')}
                            type="password"
                            placeholder="••••••••"
                            className="bg-neutral-50 dark:bg-neutral-950 border-neutral-300 dark:border-neutral-800"
                          />
                          {registerForm.formState.errors.password && (
                            <span className="text-[10px] text-red-500 mt-1">{registerForm.formState.errors.password.message}</span>
                          )}
                        </div>

                        <Button type="submit" disabled={loading} className="w-full bg-red-600 hover:bg-red-700 text-white font-bold uppercase py-5 text-xs">
                          {loading ? 'Cargando...' : 'Crear Cuenta'}
                        </Button>
                      </form>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}