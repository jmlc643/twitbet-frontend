import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { isAxiosError } from 'axios';
import { useNavigate } from 'react-router-dom';

import { useAuthStore } from '@/store/useAuthStore';
import { authApi } from '@/features/auth/api/auth.api';
import { loginSchema, registerSchema } from '@/features/auth/schemas/auth.schema';
import type { LoginInput, RegisterInput } from '@/features/auth/schemas/auth.schema';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export const AuthFormCard = () => {
  const setAuth = useAuthStore((state) => state.setAuth);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  const loginForm = useForm<LoginInput>({ resolver: zodResolver(loginSchema) });
  const registerForm = useForm<RegisterInput>({ resolver: zodResolver(registerSchema) });

  const getErrorMessage = (err: unknown): string => {
    if (isAxiosError<{ error?: string }>(err)) return err.response?.data?.error || err.message;
    if (err instanceof Error) return err.message;
    return 'Ocurrió un error inesperado';
  };

  const onLoginSubmit = async (data: LoginInput) => {
    setLoading(true);
    setApiError('');
    try {
      const res = await authApi.login(data);
      setAuth(res.user, res.token);
      navigate('/profile');
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
      navigate('/profile');
    } catch (err: unknown) {
      setApiError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
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
  );
};