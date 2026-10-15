import type { Request, Response } from 'express';

/**
 * Health check endpoint for LTA Bus Arrival proxy
 * GET /api/health
 */
export default async function healthHandler(req: Request, res: Response) {
  const hasKey = Boolean(process.env.LTA_ACCOUNT_KEY);

  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'LTA DataMall Bus Arrival Proxy',
    hasLtaAccountKey: hasKey,
    endpoints: {
      busArrival: '/api/busarrival?BusStopCode=83139',
      health: '/api/health'
    }
  });
}

export { healthHandler };
