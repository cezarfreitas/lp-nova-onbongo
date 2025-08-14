import { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { LeadsManager } from './LeadsManager';
import { SettingsManager } from './SettingsManager';
import { ConversionsManager } from './ConversionsManager';
import { Users, Settings, Target, LogOut, Activity, TrendingUp, DollarSign, Mail } from 'lucide-react';

interface AdminDashboardProps {
  user: any;
  onLogout: () => void;
}

interface DashboardStats {
  totalLeads: number;
  leadsHoje: number;
  conversionRate: number;
  webhookSuccessRate: number;
  conversionsSuccessRate: number;
}

export function AdminDashboard({ user, onLogout }: AdminDashboardProps) {
  const [stats, setStats] = useState<DashboardStats>({
    totalLeads: 0,
    leadsHoje: 0,
    conversionRate: 0,
    webhookSuccessRate: 0,
    conversionsSuccessRate: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
    
    // Atualizar dados a cada 30 segundos
    const interval = setInterval(loadDashboardData, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadDashboardData = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch('/api/admin/dashboard', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setStats(data.data.stats);
        }
      }
    } catch (error) {
      console.error('Erro ao carregar dashboard:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const StatCard = ({ title, value, icon: Icon, description, trend }: any) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">
          {description}
        </p>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold text-dark">
              ONBONGO Admin
            </h1>
            <p className="text-muted text-sm">
              Bem-vindo, {user?.username}
            </p>
          </div>
          <Button
            onClick={onLogout}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <LogOut className="h-4 w-4" />
            Sair
          </Button>
        </div>
      </header>

      <div className="p-6">
        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5 mb-8">
          <StatCard
            title="Total de Leads"
            value={isLoading ? "..." : stats.totalLeads}
            icon={Users}
            description="Todos os leads coletados"
          />
          <StatCard
            title="Leads Hoje"
            value={isLoading ? "..." : stats.leadsHoje}
            icon={Activity}
            description="Leads recebidos hoje"
          />
          <StatCard
            title="Taxa de Conversão"
            value={isLoading ? "..." : `${stats.conversionRate}%`}
            icon={TrendingUp}
            description="% de leads que são lojistas"
          />
          <StatCard
            title="Webhook Success"
            value={isLoading ? "..." : `${stats.webhookSuccessRate}%`}
            icon={Mail}
            description="Taxa de sucesso dos webhooks"
          />
          <StatCard
            title="Conversions API"
            value={isLoading ? "..." : `${stats.conversionsSuccessRate}%`}
            icon={Target}
            description="Taxa de sucesso das conversões"
          />
        </div>

        {/* Main Tabs */}
        <Tabs defaultValue="leads" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="leads" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Leads
            </TabsTrigger>
            <TabsTrigger value="conversions" className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              Conversões
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Configurações
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="leads" className="space-y-4">
            <LeadsManager />
          </TabsContent>

          <TabsContent value="conversions" className="space-y-4">
            <ConversionsManager />
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            <SettingsManager />
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Analytics em Desenvolvimento</CardTitle>
                <CardDescription>
                  Gráficos detalhados e relatórios serão adicionados em breve
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-32 bg-gray-100 rounded-lg flex items-center justify-center">
                  <p className="text-muted-foreground">Em breve...</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
