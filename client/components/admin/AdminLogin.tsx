import { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

interface AdminLoginProps {
  onLoginSuccess: (user: any, token: string) => void;
}

export function AdminLogin({ onLoginSuccess }: AdminLoginProps) {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (data.success) {
        onLoginSuccess(data.data.user, data.data.token);
      } else {
        setError(data.error || 'Erro ao fazer login');
      }
    } catch (error) {
      setError('Erro de conexão');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) setError('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark to-accent flex items-center justify-center px-4">
      <div className="bg-light rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="font-display text-3xl font-bold text-dark mb-2">
            ONBONGO
          </h1>
          <p className="text-muted text-sm">
            Painel Administrativo
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="username" className="text-dark font-medium">
              Usuário
            </Label>
            <Input
              id="username"
              name="username"
              type="text"
              value={formData.username}
              onChange={handleInputChange}
              placeholder="Digite seu usuário"
              className="mt-1"
              required
              autoFocus
            />
          </div>

          <div>
            <Label htmlFor="password" className="text-dark font-medium">
              Senha
            </Label>
            <Input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Digite sua senha"
              className="mt-1"
              required
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          <Button
            type="submit"
            disabled={isLoading || !formData.username || !formData.password}
            className="w-full bg-accent hover:bg-accent/90 text-light font-bold py-3 text-base"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-light mr-2"></div>
                Entrando...
              </>
            ) : (
              'Entrar'
            )}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-muted text-xs">
            Credenciais padrão: admin / onbongo2024!
          </p>
        </div>
      </div>
    </div>
  );
}
