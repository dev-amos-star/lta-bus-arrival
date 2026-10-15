import React, { useState } from 'react';
import { getBackendConfig, saveBackendConfig, BackendConfig } from '../services/apiConfig';
import {
  Server,
  CheckCircle2,
  AlertTriangle,
  Code2,
  Copy,
  Check,
  Radio,
  ExternalLink,
  RefreshCw,
  Sparkles
} from 'lucide-react';

interface Props {
  onConfigUpdated: () => void;
}

export const BackendConnectorModal: React.FC<Props> = ({ onConfigUpdated }) => {
  const [config, setConfig] = useState<BackendConfig>(getBackendConfig());
  const [savedNotice, setSavedNotice] = useState<boolean>(false);
  const [copiedCode, setCopiedCode] = useState<boolean>(false);
  const [testingStatus, setTestingStatus] = useState<'idle' | 'testing' | 'success' | 'failed'>('idle');
  const [testMessage, setTestMessage] = useState<string>('');

  const handleSave = (updated: BackendConfig) => {
    setConfig(updated);
    saveBackendConfig(updated);
    setSavedNotice(true);
    onConfigUpdated();
    setTimeout(() => setSavedNotice(false), 2500);
  };

  const [healthStatus, setHealthStatus] = useState<any>(null);
  const [testingHealth, setTestingHealth] = useState<boolean>(false);

  const handleTestHealth = async () => {
    setTestingHealth(true);
    try {
      const res = await fetch('/api/health');
      const data = await res.json();
      setHealthStatus(data);
    } catch (err: any) {
      setHealthStatus({ status: 'error', message: err.message });
    } finally {
      setTestingHealth(false);
    }
  };

  const handleTestEndpoint = async () => {
    setTestingStatus('testing');
    setTestMessage('Calling /api/busarrival?BusStopCode=83139...');

    try {
      const url = new URL(config.customEndpointUrl, window.location.origin);
      url.searchParams.set('BusStopCode', '83139');

      const headers: Record<string, string> = { Accept: 'application/json' };
      if (config.apiKey) headers['AccountKey'] = config.apiKey;

      const res = await fetch(url.toString(), { headers });
      const json = await res.json();

      if (res.status === 503 && json.status === 'awaiting_api_key') {
        setTestingStatus('idle');
        setTestMessage(`Server endpoint /api/busarrival reachable! Awaiting LTA_ACCOUNT_KEY to connect to live LTA DataMall servers.`);
        return;
      }

      if (!res.ok) {
        throw new Error(json.error || `HTTP ${res.status}: ${res.statusText}`);
      }

      setTestingStatus('success');
      setTestMessage(`Success! Received valid LTA response with ${json.Services?.length || 0} services.`);
    } catch (err: any) {
      setTestingStatus('failed');
      setTestMessage(err.message || 'Failed to connect. Check CORS or URL.');
    }
  };

  const sampleExpressCode = `// Example Node.js Express proxy for LTA DataMall v2
import express from 'express';

const app = express();
const LTA_API_KEY = process.env.LTA_DATAMALL_KEY; // Your LTA AccountKey

app.get('/api/lta/bus-arrival', async (req, res) => {
  const { BusStopCode, ServiceNo } = req.query;

  try {
    const ltaUrl = new URL('http://datamall2.mytransport.sg/ltaodataservice/v3/BusArrival');
    if (BusStopCode) ltaUrl.searchParams.set('BusStopCode', String(BusStopCode));
    if (ServiceNo) ltaUrl.searchParams.set('ServiceNo', String(ServiceNo));

    const response = await fetch(ltaUrl.toString(), {
      headers: {
        'AccountKey': LTA_API_KEY || '',
        'Accept': 'application/json'
      }
    });

    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch from LTA DataMall' });
  }
});

app.listen(3000, () => console.log('LTA Proxy Server running on port 3000'));`;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-2xl bg-sky-500/10 border border-sky-500/20 text-sky-400">
            <Server className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Backend Connection & LTA DataMall Integration</h2>
            <p className="text-sm text-slate-400 mt-1">
              Currently running on the frontend simulation engine with realistic Singapore coordinates, accurate wait time predictions, and live bus fleet. Connect your backend proxy whenever ready.
            </p>
          </div>
        </div>
      </div>

      {/* Mode Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Simulation Card */}
        <div
          onClick={() => handleSave({ ...config, mode: 'simulation' })}
          className={`p-5 rounded-2xl border cursor-pointer transition-all ${
            config.mode === 'simulation'
              ? 'bg-sky-950/40 border-sky-500 ring-1 ring-sky-500/40 shadow-lg'
              : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-sky-400" />
              <span className="font-bold text-slate-100">Live Simulation Mode</span>
            </div>
            {config.mode === 'simulation' && (
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/30">
                Active
              </span>
            )}
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            High-fidelity LTA v2 simulation with dynamic bus arrival countdowns, load levels (SEA/SDA/LSD), and live GPS fleet coordinates across Singapore. No API key needed.
          </p>
        </div>

        {/* Custom Backend Card */}
        <div
          onClick={() => handleSave({ ...config, mode: 'custom_backend' })}
          className={`p-5 rounded-2xl border cursor-pointer transition-all ${
            config.mode === 'custom_backend'
              ? 'bg-sky-950/40 border-sky-500 ring-1 ring-sky-500/40 shadow-lg'
              : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Server className="w-5 h-5 text-emerald-400" />
              <span className="font-bold text-slate-100">Custom Backend Proxy</span>
            </div>
            {config.mode === 'custom_backend' && (
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Active
              </span>
            )}
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Forward queries to your own Express, Node, or Cloud Run backend connected directly to official LTA DataMall v2 credentials.
          </p>
        </div>
      </div>

      {/* Backend Endpoint Settings */}
      {config.mode === 'custom_backend' && (
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 animate-in fade-in duration-200">
          <h3 className="text-base font-bold text-white">Custom API Endpoint Configuration</h3>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Backend Endpoint URL (Expects <code className="text-sky-400">?BusStopCode=XXXXX</code>)
              </label>
              <input
                type="text"
                value={config.customEndpointUrl}
                onChange={e => setConfig({ ...config, customEndpointUrl: e.target.value })}
                placeholder="http://localhost:3000/api/lta/bus-arrival"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-100 font-mono focus:outline-none focus:border-sky-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Optional LTA AccountKey (If proxy forwards custom header)
              </label>
              <input
                type="password"
                value={config.apiKey || ''}
                onChange={e => setConfig({ ...config, apiKey: e.target.value })}
                placeholder="e.g. 5x7ab81..."
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-100 font-mono focus:outline-none focus:border-sky-500"
              />
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => handleSave(config)}
                className="px-5 py-2.5 rounded-xl bg-sky-500 text-slate-950 font-semibold text-sm hover:bg-sky-400 transition-colors shadow-md"
              >
                Save Configuration
              </button>
              <button
                onClick={handleTestEndpoint}
                disabled={testingStatus === 'testing'}
                className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-200 font-medium text-sm hover:bg-slate-700 transition-colors flex items-center gap-2"
              >
                <RefreshCw className={`w-4 h-4 ${testingStatus === 'testing' ? 'animate-spin' : ''}`} />
                <span>Test Connection</span>
              </button>
            </div>

            {testMessage && (
              <div
                className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                  testingStatus === 'success'
                    ? 'bg-emerald-950/40 border border-emerald-500/30 text-emerald-300'
                    : testingStatus === 'failed'
                    ? 'bg-rose-950/40 border border-rose-500/30 text-rose-300'
                    : 'bg-slate-950 text-slate-400'
                }`}
              >
                {testingStatus === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                {testingStatus === 'failed' && <AlertTriangle className="w-4 h-4 text-rose-400" />}
                <span>{testMessage}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Serverless Endpoints Status Box */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Server className="w-5 h-5 text-sky-400" />
            <h3 className="text-base font-bold text-white">Live Serverless Endpoints (/api)</h3>
          </div>
          <button
            onClick={handleTestHealth}
            disabled={testingHealth}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-sky-300 font-medium transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${testingHealth ? 'animate-spin' : ''}`} />
            <span>Check /api/health</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800/80">
            <div className="font-mono text-sky-400 font-semibold mb-1">GET /api/health</div>
            <div className="text-slate-400">Verifies server status and environment key configuration.</div>
          </div>
          <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800/80">
            <div className="font-mono text-emerald-400 font-semibold mb-1">GET /api/busarrival</div>
            <div className="text-slate-400">Proxy to LTA DataMall BusArrival v3 (<code className="text-slate-300">?BusStopCode=83139</code>).</div>
          </div>
        </div>

        {healthStatus && (
          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 font-mono text-xs text-slate-300 overflow-x-auto">
            <pre>{JSON.stringify(healthStatus, null, 2)}</pre>
          </div>
        )}
      </div>

      {/* Code Snippet for Backend Proxy */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Code2 className="w-5 h-5 text-sky-400" />
            <h3 className="text-base font-bold text-white">Reference Backend Implementation (Express.js)</h3>
          </div>
          <button
            onClick={() => {
              navigator.clipboard.writeText(sampleExpressCode);
              setCopiedCode(true);
              setTimeout(() => setCopiedCode(false), 2000);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 transition-colors"
          >
            {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedCode ? 'Copied!' : 'Copy Code'}</span>
          </button>
        </div>

        <p className="text-xs text-slate-400">
          When connecting your backend, mount this route in your Express server. LTA DataMall requires an AccountKey header and returns bus arrival predictions per stop:
        </p>

        <pre className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-300 overflow-x-auto leading-relaxed">
          <code>{sampleExpressCode}</code>
        </pre>
      </div>
    </div>
  );
};
