import { Client } from 'pg';
import type { NextApiRequest, NextApiResponse } from 'next'

interface Data {
  longitude: number;
  latitude: number;
  nearestSites: any[];
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  function getCoord(coord: 'latitude' | 'longitude') {
    const sources: [any, string][] = [
      [req.query, coord],  // try query string: ?longitude=-12.34&latitude=56.78
      [req.headers, `x-vercel-ip-${coord}`],  // try Vercel geolocation headers
      [{ latitude: '37.81', longitude: '-122.47' }, coord]  // fall back to San Francisco
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

  res.status(200).json({ longitude, latitude, nearestSites: rows });
  await client.end();
}
