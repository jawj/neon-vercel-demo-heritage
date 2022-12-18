import { Client, neonConfig } from '@jawj/test-serverless';
import { NextRequest, NextResponse } from 'next/server';

export const config = {
  runtime: 'experimental-edge',
  regions: ['fra1'],
};

export interface SitesData {
  longitude: number;
  latitude: number;
  nearestSites: {
    id_no: number;
    name_en: string;
    category: string;
    distance: number;
  }[];
  duration: number;
}

function getCoords(...coordSources: any[]) {
  return (<const>['longitude', 'latitude']).reduce((coords, coord) => {
    coords[coord] = coordSources.reduce((result, source) => {
      if (!isNaN(result)) return result;  // already got a result? just feed it forwards
      const param = source[coord] as any;
      return typeof param === 'string' ? parseFloat(param) :
        Array.isArray(param) ? parseFloat(param[0]) : result;
    }, NaN);
    return coords;
  }, {} as { longitude: number; latitude: number; });
}

export default async function handler(req: NextRequest) {
  const queryParams = Object.fromEntries(new URL(req.url ?? 'http://xyz').searchParams);
  const { longitude, latitude } = getCoords(
    queryParams,                                 // (1) try URL query: ?latitude=x&longitude=y
    req.geo,                                     // (2) try IP geolocation
    { latitude: '37.81', longitude: '-122.47' }  // (3) fall back to fixed a point
  );

  // db: 'gm' | 'neon'
  // tls: 'wss' | 'subtls'
  // fast: 'no' | 'yes'

  const dbURL = queryParams.db === 'neon' ? process.env.DATABASE_URL_NEON! : process.env.DATABASE_URL_GM!;
  const wss = queryParams.tls !== 'subtls';
  const fast = queryParams.fast === 'yes';

  neonConfig.useSecureWebSocket = neonConfig.disableTLS = wss;
  neonConfig.fastStart = fast;

  const t0 = Date.now();

  const client = new Client(dbURL);
  await client.connect();

  const { rows } = await client.query(`
    select 
      id_no, name_en, category,
      st_makepoint($1, $2) <-> location as distance
    from whc_sites_2021
    order by distance limit 10`,
    [longitude, latitude]
  );  // no cast needed: PostGIS casts geometry -> geography, never the reverse: https://gis.stackexchange.com/a/367374

  client.end();  // TODO: is there an equivalent to Cloudflare's `ctx.waitFor`?

  const duration = Date.now() - t0;
  return NextResponse.json({ longitude, latitude, nearestSites: rows, duration });
}
