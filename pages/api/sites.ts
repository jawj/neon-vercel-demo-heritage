import { Client } from '../../serverless';
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
}

export default async function handler(req: NextRequest) {
  function getCoord(coord: 'latitude' | 'longitude') {
    const sources: any[] = [
      Object.fromEntries(new URL(req.url ?? 'http://xyz').searchParams),  // ?latitude=x,longitude=y
      req.geo,  // IP geolocation
      { latitude: '37.81', longitude: '-122.47' }  // fallback
    ];
    let result = NaN;
    for (const [source, key] of sources) {
      const param = source[key];
      result = typeof param === 'string' ? parseFloat(param) : Array.isArray(param) ? parseFloat(param[0]) : result;
      if (!isNaN(result)) break;
    }
    return result;
  }
  const longitude = getCoord('longitude');
  const latitude = getCoord('latitude');

  const client = new Client(process.env.DATABASE_URL);
  await client.connect();

  const { rows } = await client.query(`
    select 
      id_no, name_en, category,
      st_makepoint($1, $2) <-> location as distance
    from whc_sites_2021
    order by distance limit 10`,
    [longitude, latitude]
  );  // no cast needed: PostGIS casts geometry -> geography, never the reverse: https://gis.stackexchange.com/a/367374

  await client.end();
  return NextResponse.json({ longitude, latitude, nearestSites: rows });
}
