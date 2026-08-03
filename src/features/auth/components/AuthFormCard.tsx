import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LoginForm } from './sections/LoginForm';
import { RegisterForm } from './sections/RegisterForm';

export const AuthFormCard = () => {
  const [apiError, setApiError] = useState('');

  const handleError = (error: string) => setApiError(error);
  const handleClearError = () => setApiError('');

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

        <Tabs defaultValue="login" className="w-full" onValueChange={handleClearError}>
          <TabsList className="grid w-full grid-cols-2 p-1 border rounded-lg bg-neutral-100 dark:bg-neutral-950 border-neutral-200 dark:border-neutral-800">
            <TabsTrigger value="login" className="text-xs font-semibold py-2">Ingresar</TabsTrigger>
            <TabsTrigger value="register" className="text-xs font-semibold py-2">Registro</TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <LoginForm onError={handleError} onClearError={handleClearError} />
          </TabsContent>

          <TabsContent value="register">
            <RegisterForm onError={handleError} onClearError={handleClearError} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};