import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { RefreshCw, Send, Calendar, Target, AlertCircle } from 'lucide-react';

interface ConversionEvent {
  id: number;
  lead_id: number;
  event_type: string;
  platform: 'facebook' | 'google' | 'tiktok';
  event_id?: string;
  conversion_value?: number;
  currency: string;
  sent_status: 'pending' | 'sent' | 'failed';
  response_data?: string;
  error_message?: string;
  sent_at?: string;
  created_at: string;
  nome_completo?: string;
  whatsapp?: string;
}

export function ConversionsManager() {
  const [events, setEvents] = useState<ConversionEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    loadConversions();
  }, [currentPage]);

  const loadConversions = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('admin_token');
      // Por enquanto usando dados mock, depois implementaremos a API real
      
      // Simular dados de conversão
      const mockData = {
        data: [
          {
            id: 1,
            lead_id: 1,
            event_type: 'Lead',
            platform: 'facebook' as const,
            event_id: 'evt_123',
            conversion_value: 50.00,
            currency: 'BRL',
            sent_status: 'sent' as const,
            sent_at: new Date().toISOString(),
            created_at: new Date().toISOString(),
            nome_completo: 'João Silva',
            whatsapp: '11999999999'
          },
          {
            id: 2,
            lead_id: 2,
            event_type: 'Lead',
            platform: 'google' as const,
            conversion_value: 50.00,
            currency: 'BRL',
            sent_status: 'failed' as const,
            error_message: 'Invalid credentials',
            created_at: new Date().toISOString(),
            nome_completo: 'Maria Santos',
            whatsapp: '11888888888'
          }
        ],
        pagination: {
          page: 1,
          totalPages: 1
        }
      };
      
      setEvents(mockData.data);
      setTotalPages(mockData.pagination.totalPages);
    } catch (error) {
      console.error('Erro ao carregar conversões:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const retryConversion = async (eventId: number) => {
    try {
      const token = localStorage.getItem('admin_token');
      // Implementar retry da conversão
      console.log('Tentando reenviar conversão:', eventId);
      
      // Por enquanto apenas simular sucesso
      setEvents(prev => prev.map(event => 
        event.id === eventId 
          ? { ...event, sent_status: 'sent' as const, sent_at: new Date().toISOString() }
          : event
      ));
      
      alert('Conversão reenviada com sucesso!');
    } catch (error) {
      console.error('Erro ao reenviar conversão:', error);
      alert('Erro ao reenviar conversão');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-BR');
  };

  const formatCurrency = (value: number, currency: string) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: currency
    }).format(value);
  };

  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case 'facebook': return 'bg-blue-500';
      case 'google': return 'bg-green-500';
      case 'tiktok': return 'bg-pink-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'sent':
        return <Badge className="bg-green-500 hover:bg-green-600">Enviado</Badge>;
      case 'failed':
        return <Badge variant="destructive">Falhou</Badge>;
      case 'pending':
        return <Badge variant="secondary">Pendente</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Eventos de Conversão
            </CardTitle>
            <CardDescription>
              Monitore o status dos eventos enviados para as APIs de conversão
            </CardDescription>
          </div>
          <Button
            onClick={loadConversions}
            variant="outline"
            size="sm"
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Atualizar
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4 mb-6">
          <Card>
            <CardContent className="pt-4">
              <div className="text-2xl font-bold">
                {events.filter(e => e.sent_status === 'sent').length}
              </div>
              <p className="text-xs text-muted-foreground">Enviados com Sucesso</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="text-2xl font-bold text-red-500">
                {events.filter(e => e.sent_status === 'failed').length}
              </div>
              <p className="text-xs text-muted-foreground">Falharam</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="text-2xl font-bold text-yellow-500">
                {events.filter(e => e.sent_status === 'pending').length}
              </div>
              <p className="text-xs text-muted-foreground">Pendentes</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="text-2xl font-bold">
                {events.length > 0 ? 
                  Math.round((events.filter(e => e.sent_status === 'sent').length / events.length) * 100) : 0
                }%
              </div>
              <p className="text-xs text-muted-foreground">Taxa de Sucesso</p>
            </CardContent>
          </Card>
        </div>

        {/* Events Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2 font-medium">ID</th>
                <th className="text-left p-2 font-medium">Lead</th>
                <th className="text-left p-2 font-medium">Plataforma</th>
                <th className="text-left p-2 font-medium">Evento</th>
                <th className="text-left p-2 font-medium">Valor</th>
                <th className="text-left p-2 font-medium">Status</th>
                <th className="text-left p-2 font-medium">Data</th>
                <th className="text-left p-2 font-medium">Ações</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="text-center p-8">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-accent mx-auto mb-2"></div>
                    Carregando eventos...
                  </td>
                </tr>
              ) : events.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center p-8 text-muted-foreground">
                    Nenhum evento de conversão encontrado
                  </td>
                </tr>
              ) : (
                events.map((event) => (
                  <tr key={event.id} className="border-b hover:bg-gray-50">
                    <td className="p-2 font-mono text-sm">{event.id}</td>
                    <td className="p-2">
                      <div>
                        <div className="font-medium text-sm">{event.nome_completo}</div>
                        <div className="text-xs text-muted-foreground">
                          Lead #{event.lead_id}
                        </div>
                      </div>
                    </td>
                    <td className="p-2">
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${getPlatformColor(event.platform)}`}></div>
                        <span className="capitalize font-medium">{event.platform}</span>
                      </div>
                    </td>
                    <td className="p-2">
                      <Badge variant="outline">{event.event_type}</Badge>
                      {event.event_id && (
                        <div className="text-xs text-muted-foreground mt-1">
                          ID: {event.event_id}
                        </div>
                      )}
                    </td>
                    <td className="p-2">
                      {event.conversion_value ? 
                        formatCurrency(event.conversion_value, event.currency) : 
                        '-'
                      }
                    </td>
                    <td className="p-2">
                      <div className="space-y-1">
                        {getStatusBadge(event.sent_status)}
                        {event.error_message && (
                          <div className="flex items-center gap-1 text-red-500 text-xs">
                            <AlertCircle className="h-3 w-3" />
                            <span>{event.error_message}</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="p-2">
                      <div className="text-sm">
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          {formatDate(event.created_at)}
                        </div>
                        {event.sent_at && (
                          <div className="text-xs text-green-600">
                            Enviado: {formatDate(event.sent_at)}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="p-2">
                      {event.sent_status === 'failed' && (
                        <Button
                          onClick={() => retryConversion(event.id)}
                          variant="outline"
                          size="sm"
                          className="text-xs"
                        >
                          <Send className="h-3 w-3 mr-1" />
                          Reenviar
                        </Button>
                      )}
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
