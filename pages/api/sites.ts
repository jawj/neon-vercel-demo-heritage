import { Client, neonConfig } from '../../serverless';
import { NextRequest, NextResponse } from 'next/server';

export const config = {
  runtime: 'experimental-edge'
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

async function runQuery(dbURL: string, longitude: number, latitude: number) {
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
  return rows;
}

export default async function handler(req: NextRequest) {
  const queryParams = Object.fromEntries(new URL(req.url ?? 'http://xyz').searchParams);
  const { longitude, latitude } = getCoords(
    queryParams,                                 // (1) try URL query: ?latitude=x&longitude=y
    req.geo,                                     // (2) try IP geolocation
    { latitude: '37.81', longitude: '-122.47' }  // (3) fall back to fixed a point
  );

  const wss = queryParams.db === 'b';
  const dbURL = wss ? process.env.DATABASE_URL_B! : process.env.DATABASE_URL_A!;
  neonConfig.useSecureWebSocket = neonConfig.disableTLS = wss;

  const t0 = Date.now();
  const rows = await runQuery(dbURL, longitude, latitude);
  const duration = Date.now() - t0;

  return NextResponse.json({ longitude, latitude, nearestSites: rows, duration });
}
