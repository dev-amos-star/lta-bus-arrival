/**
 * Backend API Configuration for LTA Bus Arrival integration.
 * Allows seamless switching between front-end real-time simulation
 * and a real backend proxy connecting to LTA DataMall v2.
 */

export interface BackendConfig {
  mode: 'simulation' | 'custom_backend';
  customEndpointUrl: string; // e.g. "http://localhost:3000/api/lta/bus-arrival"
  apiKey?: string; // Optional LTA DataMall AccountKey if passing directly
  autoRefreshIntervalSeconds: number; // default 15
}

const STORAGE_KEY = 'sg_bus_api_config';

export const DEFAULT_CONFIG: BackendConfig = {
  mode: 'custom_backend',
  customEndpointUrl: '/api/busarrival',
  apiKey: '',
  autoRefreshIntervalSeconds: 15
};

export function getBackendConfig(): BackendConfig {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return { ...DEFAULT_CONFIG, ...JSON.parse(raw) };
    }
  } catch {
    // ignore
  }
  return DEFAULT_CONFIG;
}

export function saveBackendConfig(config: BackendConfig): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  } catch {
    // ignore
  }
}
