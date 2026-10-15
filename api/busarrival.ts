import type { Request, Response } from 'express';

/**
 * LTA DataMall Bus Arrival Serverless Proxy
 * GET /api/busarrival?BusStopCode=83139&ServiceNo=190
 *
 * Pulls live bus arrival data from LTA DataMall v3:
 * GET https://datamall2.mytransport.sg/ltaodataservice/v3/BusArrival?BusStopCode=<BusStopCode>
 * Header: AccountKey: <LTA_ACCOUNT_KEY>
 */
export default async function busArrivalHandler(req: Request, res: Response) {
  try {
    const busStopCode = (req.query.BusStopCode || req.query.busStopCode) as string;
    const serviceNo = (req.query.ServiceNo || req.query.serviceNo) as string | undefined;

    if (!busStopCode) {
      return res.status(400).json({
        error: 'Missing required query parameter: BusStopCode',
        example: '/api/busarrival?BusStopCode=83139'
      });
    }

    // Retrieve LTA DataMall API Key from environment variable or request header
    const accountKey = process.env.LTA_ACCOUNT_KEY || (req.headers['accountkey'] as string) || '';

    if (!accountKey) {
      return res.status(503).json({
        error: 'LTA_ACCOUNT_KEY not configured',
        message: 'Please set the LTA_ACCOUNT_KEY environment variable with your Land Transport Authority DataMall API key.',
        status: 'awaiting_api_key',
        endpoint: 'https://datamall2.mytransport.sg/ltaodataservice/v3/BusArrival'
      });
    }

    const ltaEndpoint = new URL('https://datamall2.mytransport.sg/ltaodataservice/v3/BusArrival');
    ltaEndpoint.searchParams.set('BusStopCode', busStopCode);
    if (serviceNo) {
      ltaEndpoint.searchParams.set('ServiceNo', serviceNo);
    }

    const response = await fetch(ltaEndpoint.toString(), {
      method: 'GET',
      headers: {
        'AccountKey': accountKey,
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      const errorBody = await response.text();
      return res.status(response.status).json({
        error: `LTA DataMall responded with HTTP status ${response.status}`,
        details: errorBody
      });
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error: any) {
    console.error('LTA DataMall BusArrival error:', error);
    return res.status(500).json({
      error: 'Failed to fetch bus arrival data from LTA DataMall',
      message: error?.message || 'Internal server error'
    });
  }
}

export { busArrivalHandler };
