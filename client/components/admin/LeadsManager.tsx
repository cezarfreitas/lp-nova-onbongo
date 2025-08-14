import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { RefreshCw, Search, Download, Calendar, Phone, User, Building } from 'lucide-react';

interface Lead {
  id: number;
  nome_completo: string;
  whatsapp: string;
  tipo_cadastro: 'lojista' | 'consumidor';
  cnpj?: string;
  ip_address?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  webhook_sent: boolean;
  conversion_sent: boolean;
  created_at: string;
}

export function LeadsManager() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    loadLeads();
  }, [currentPage]);

  const loadLeads = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('admin_token');
      const response = await fetch(`/api/leads?page=${currentPage}&limit=10`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setLeads(data.data.data);
          setTotalPages(data.data.pagination.totalPages);
        }
      }
    } catch (error) {
      console.error('Erro ao carregar leads:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const exportLeads = () => {
    // Implementar exportação CSV
    const csvData = leads.map(lead => ({
      ID: lead.id,
      Nome: lead.nome_completo,
      WhatsApp: lead.whatsapp,
      Tipo: lead.tipo_cadastro,
      CNPJ: lead.cnpj || '',
      'UTM Source': lead.utm_source || '',
      'UTM Medium': lead.utm_medium || '',
      'UTM Campaign': lead.utm_campaign || '',
      'Webhook Enviado': lead.webhook_sent ? 'Sim' : 'Não',
      'Conversão Enviada': lead.conversion_sent ? 'Sim' : 'Não',
      'Data de Cadastro': new Date(lead.created_at).toLocaleString('pt-BR')
    }));

    const csvContent = [
      Object.keys(csvData[0]).join(','),
      ...csvData.map(row => Object.values(row).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `leads-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const filteredLeads = leads.filter(lead =>
    lead.nome_completo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.whatsapp.includes(searchTerm) ||
    lead.tipo_cadastro.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-BR');
  };

  const formatPhone = (phone: string) => {
    return phone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Gerenciamento de Leads
            </CardTitle>
            <CardDescription>
              Visualize e gerencie todos os leads coletados
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={loadLeads}
              variant="outline"
              size="sm"
              disabled={isLoading}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Atualizar
            </Button>
            <Button
              onClick={exportLeads}
              variant="outline"
              size="sm"
              disabled={leads.length === 0}
            >
              <Download className="h-4 w-4 mr-2" />
              Exportar CSV
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Search */}
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nome, telefone ou tipo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Leads Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2 font-medium">ID</th>
                <th className="text-left p-2 font-medium">Nome</th>
                <th className="text-left p-2 font-medium">WhatsApp</th>
                <th className="text-left p-2 font-medium">Tipo</th>
                <th className="text-left p-2 font-medium">CNPJ</th>
                <th className="text-left p-2 font-medium">UTMs</th>
                <th className="text-left p-2 font-medium">Status</th>
                <th className="text-left p-2 font-medium">Data</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="text-center p-8">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-accent mx-auto mb-2"></div>
                    Carregando leads...
                  </td>
                </tr>
              ) : filteredLeads.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center p-8 text-muted-foreground">
                    Nenhum lead encontrado
                  </td>
                </tr>
              ) : (
                filteredLeads.map((lead) => (
                  <tr key={lead.id} className="border-b hover:bg-gray-50">
                    <td className="p-2 font-mono text-sm">{lead.id}</td>
                    <td className="p-2">
                      <div className="font-medium">{lead.nome_completo}</div>
                    </td>
                    <td className="p-2">
                      <div className="flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        <span className="font-mono text-sm">{formatPhone(lead.whatsapp)}</span>
                      </div>
                    </td>
                    <td className="p-2">
                      <Badge variant={lead.tipo_cadastro === 'lojista' ? 'default' : 'secondary'}>
                        {lead.tipo_cadastro === 'lojista' ? (
                          <><Building className="h-3 w-3 mr-1" /> Lojista</>
                        ) : (
                          <><User className="h-3 w-3 mr-1" /> Consumidor</>
                        )}
                      </Badge>
                    </td>
                    <td className="p-2">
                      <span className="font-mono text-sm">
                        {lead.cnpj || '-'}
                      </span>
                    </td>
                    <td className="p-2">
                      <div className="text-xs space-y-1">
                        {lead.utm_source && (
                          <div className="text-blue-600">
                            Source: {lead.utm_source}
                          </div>
                        )}
                        {lead.utm_campaign && (
                          <div className="text-green-600">
                            Campaign: {lead.utm_campaign}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="p-2">
                      <div className="space-y-1">
                        <Badge 
                          variant={lead.webhook_sent ? 'default' : 'destructive'}
                          className="text-xs"
                        >
                          Webhook: {lead.webhook_sent ? 'Enviado' : 'Pendente'}
                        </Badge>
                        <Badge 
                          variant={lead.conversion_sent ? 'default' : 'destructive'}
                          className="text-xs"
                        >
                          Conversão: {lead.conversion_sent ? 'Enviada' : 'Pendente'}
                        </Badge>
                      </div>
                    </td>
                    <td className="p-2">
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        {formatDate(lead.created_at)}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-muted-foreground">
              Página {currentPage} de {totalPages}
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                variant="outline"
                size="sm"
              >
                Anterior
              </Button>
              <Button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                variant="outline"
                size="sm"
              >
                Próximo
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
