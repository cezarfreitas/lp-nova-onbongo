import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Save, RefreshCw, Globe, Target, Webhook, Code } from 'lucide-react';

interface Setting {
  key: string;
  value: string;
  description: string;
}

export function SettingsManager() {
  const [settings, setSettings] = useState<Setting[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('admin_token');
      const response = await fetch('/api/admin/settings', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setSettings(data.data);
        }
      }
    } catch (error) {
      console.error('Erro ao carregar configurações:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateSetting = (key: string, value: string) => {
    setSettings(prev => prev.map(setting => 
      setting.key === key ? { ...setting, value } : setting
    ));
  };

  const saveSettings = async () => {
    try {
      setIsSaving(true);
      const token = localStorage.getItem('admin_token');
      
      const response = await fetch('/api/admin/settings/bulk', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          settings: settings.map(({ key, value }) => ({ key, value }))
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          alert('Configurações salvas com sucesso!');
        }
      }
    } catch (error) {
      console.error('Erro ao salvar configurações:', error);
      alert('Erro ao salvar configurações');
    } finally {
      setIsSaving(false);
    }
  };

  const getSettingValue = (key: string) => {
    return settings.find(s => s.key === key)?.value || '';
  };

  const SettingInput = ({ settingKey, label, type = 'text', placeholder = '' }: any) => (
    <div className="space-y-2">
      <Label htmlFor={settingKey} className="font-medium">
        {label}
      </Label>
      <Input
        id={settingKey}
        type={type}
        value={getSettingValue(settingKey)}
        onChange={(e) => updateSetting(settingKey, e.target.value)}
        placeholder={placeholder}
      />
      <p className="text-xs text-muted-foreground">
        {settings.find(s => s.key === settingKey)?.description}
      </p>
    </div>
  );

  const SettingTextarea = ({ settingKey, label, placeholder = '' }: any) => (
    <div className="space-y-2">
      <Label htmlFor={settingKey} className="font-medium">
        {label}
      </Label>
      <Textarea
        id={settingKey}
        value={getSettingValue(settingKey)}
        onChange={(e) => updateSetting(settingKey, e.target.value)}
        placeholder={placeholder}
        rows={3}
      />
      <p className="text-xs text-muted-foreground">
        {settings.find(s => s.key === settingKey)?.description}
      </p>
    </div>
  );

  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-accent mx-auto mb-2"></div>
            Carregando configurações...
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Code className="h-5 w-5" />
              Configurações do Sistema
            </CardTitle>
            <CardDescription>
              Configure tracking, APIs e integrações
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={loadSettings}
              variant="outline"
              size="sm"
              disabled={isLoading}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Recarregar
            </Button>
            <Button
              onClick={saveSettings}
              disabled={isSaving}
              size="sm"
              className="bg-accent hover:bg-accent/90"
            >
              <Save className={`h-4 w-4 mr-2 ${isSaving ? 'animate-spin' : ''}`} />
              Salvar Todas
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="tracking" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="tracking">
              <Globe className="h-4 w-4 mr-2" />
              Tracking
            </TabsTrigger>
            <TabsTrigger value="conversions">
              <Target className="h-4 w-4 mr-2" />
              Conversões
            </TabsTrigger>
            <TabsTrigger value="webhook">
              <Webhook className="h-4 w-4 mr-2" />
              Webhook
            </TabsTrigger>
            <TabsTrigger value="general">
              <Code className="h-4 w-4 mr-2" />
              Geral
            </TabsTrigger>
          </TabsList>

          <TabsContent value="tracking" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Google Analytics 4</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <SettingInput
                    settingKey="ga4_measurement_id"
                    label="Measurement ID"
                    placeholder="G-XXXXXXXXXX"
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Meta Pixel</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <SettingInput
                    settingKey="meta_pixel_id"
                    label="Pixel ID"
                    placeholder="123456789012345"
                  />
                  <SettingInput
                    settingKey="meta_test_event_code"
                    label="Test Event Code"
                    placeholder="TEST12345"
                  />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="conversions" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Meta Conversions API</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <SettingInput
                    settingKey="meta_access_token"
                    label="Access Token"
                    type="password"
                    placeholder="EAAxxxxxxxxxxxxx"
                  />
                  <SettingInput
                    settingKey="conversion_value"
                    label="Valor de Conversão (BRL)"
                    type="number"
                    placeholder="50.00"
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">TikTok Events API</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <SettingInput
                    settingKey="tiktok_pixel_id"
                    label="Pixel ID"
                    placeholder="C4XXXXXXXXXXXXXXXXXX"
                  />
                  <SettingInput
                    settingKey="tiktok_access_token"
                    label="Access Token"
                    type="password"
                    placeholder="xxxxxxxxxxxxx"
                  />
                  <SettingInput
                    settingKey="tiktok_test_event_code"
                    label="Test Event Code"
                    placeholder="TEST12345"
                  />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="webhook" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Configuração do Webhook</CardTitle>
                <CardDescription>
                  Configure o endpoint para onde os leads serão enviados
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <SettingInput
                  settingKey="webhook_endpoint"
                  label="Endpoint URL"
                  placeholder="https://api.exemplo.com/webhook"
                />
                <SettingInput
                  settingKey="webhook_method"
                  label="Método HTTP"
                  placeholder="POST"
                />
                <SettingInput
                  settingKey="webhook_auth_token"
                  label="Token de Autenticação"
                  type="password"
                  placeholder="Bearer token ou API key"
                />
                <SettingTextarea
                  settingKey="webhook_headers"
                  label="Headers Personalizados (JSON)"
                  placeholder='{"Content-Type": "application/json", "X-API-Key": "your-key"}'
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="general" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Configurações Gerais</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <SettingInput
                  settingKey="site_domain"
                  label="Domínio do Site"
                  placeholder="b2b.onbongo.com.br"
                />
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Auto-envio de Conversões</Label>
                    <select
                      value={getSettingValue('auto_send_conversions')}
                      onChange={(e) => updateSetting('auto_send_conversions', e.target.value)}
                      className="w-full p-2 border rounded-md"
                    >
                      <option value="true">Ativado</option>
                      <option value="false">Desativado</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label>Auto-envio de Webhook</Label>
                    <select
                      value={getSettingValue('auto_send_webhook')}
                      onChange={(e) => updateSetting('auto_send_webhook', e.target.value)}
                      className="w-full p-2 border rounded-md"
                    >
                      <option value="true">Ativado</option>
                      <option value="false">Desativado</option>
                    </select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
