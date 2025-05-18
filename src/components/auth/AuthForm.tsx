import React, { useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

interface AuthFormProps {
  onAuthSuccess: () => void;
}

export const AuthForm: React.FC<AuthFormProps> = ({ onAuthSuccess }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const generateDisplayName = (email: string) => {
    const emailPart = email.split('@')[0];
    return emailPart || `user_${Math.random().toString(36).substr(2, 4)}`;
  };

  const validateForm = () => {
    if (!email.includes('@')) {
      throw new Error('Por favor ingresa un correo electrónico válido');
    }
    if (password.length < 6) {
      throw new Error('La contraseña debe tener al menos 6 caracteres');
    }
    if (isSignUp && (!username.startsWith('@') || username.length < 4)) {
      throw new Error('El nombre de usuario debe comenzar con @ y tener al menos 4 caracteres');
    }
  };

  const checkUsernameAvailability = async () => {
    const { data, error: searchError } = await supabase
      .from('users')
      .select('username')
      .eq('username', username)
      .maybeSingle();

    if (searchError) throw searchError;
    if (data) throw new Error('Nombre de usuario no disponible');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      validateForm();

      if (isSignUp) {
        await checkUsernameAvailability();

        const displayName = generateDisplayName(email);
        
        const { data: authData, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { 
              username,
              display_name: displayName
            },
            emailRedirectTo: `${window.location.origin}/dashboard`
          }
        });

        if (signUpError) throw signUpError;

        if (authData.user) {
          const { error: profileError } = await supabase.from('users').upsert(
            {
              id: authData.user.id,
              username,
              email,
              display_name: displayName,
              updated_at: new Date().toISOString()
            },
            { onConflict: 'email' }
          );

          if (profileError) throw profileError;
        }
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        if (signInError) throw signInError;
      }

      onAuthSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error de autenticación');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg">
        <div>
          <h2 className="text-center text-3xl font-bold text-gray-900 dark:text-white">
            {isSignUp ? 'Crear Cuenta' : 'Bienvenido de Nuevo'}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            {isSignUp ? 'Únete a nuestra comunidad' : 'Accede a tu perfil cultural'}
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {isSignUp && (
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Nombre de Usuario
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value.replace(/\s/g, ''))}
                placeholder="@culturaluser"
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 shadow-sm focus:border-cultural-escenicas focus:ring focus:ring-cultural-escenicas focus:ring-opacity-50"
                pattern="^@\w{3,}$"
                required
              />
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Correo Electrónico
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value.trim())}
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 shadow-sm focus:border-cultural-escenicas focus:ring focus:ring-cultural-escenicas focus:ring-opacity-50"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={6}
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 shadow-sm focus:border-cultural-escenicas focus:ring focus:ring-cultural-escenicas focus:ring-opacity-50"
              required
            />
          </div>

          {error && (
            <div className="p-3 bg-red-100 dark:bg-red-900/20 rounded-md">
              <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-cultural-escenicas hover:bg-cultural-escenicas/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cultural-escenicas disabled:opacity-70"
          >
            {loading ? (
              <span className="flex items-center">
                <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                </svg>
                Procesando...
              </span>
            ) : isSignUp ? 'Crear Cuenta' : 'Iniciar Sesión'}
          </button>

          <div className="text-center">
            <button
              type="button"
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError('');
              }}
              className="text-sm text-cultural-escenicas hover:text-cultural-escenicas/90 font-medium"
            >
              {isSignUp ? '¿Ya tienes una cuenta? Inicia Sesión' : '¿Necesitas una cuenta? Regístrate'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};