import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminLogin } from '../components/admin/AdminLogin';
import { AdminDashboard } from '../components/admin/AdminDashboard';

interface User {
  id: number;
  username: string;
  email?: string;
}

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      
      if (!token) {
        setIsLoading(false);
        return;
      }

      const response = await fetch('/api/admin/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setUser(data.data);
          setIsAuthenticated(true);
        } else {
          localStorage.removeItem('admin_token');
        }
      } else {
        localStorage.removeItem('admin_token');
      }
    } catch (error) {
      console.error('Erro ao verificar autenticação:', error);
      localStorage.removeItem('admin_token');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginSuccess = (userData: User, token: string) => {
    localStorage.setItem('admin_token', token);
    setUser(userData);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    setUser(null);
    setIsAuthenticated(false);
    navigate('/admin');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent mx-auto mb-4"></div>
          <p className="text-light">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {!isAuthenticated ? (
        <AdminLogin onLoginSuccess={handleLoginSuccess} />
      ) : (
        <AdminDashboard user={user} onLogout={handleLogout} />
      )}
    </div>
  );
}
