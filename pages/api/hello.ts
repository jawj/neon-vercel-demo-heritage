// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

interface Data {
  longitude: number;
  latitude: number;
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  function getCoordinate(name: 'latitude' | 'longitude') {
    let result = NaN;
    const sources: [any, string][] = [[req.query, ''], [req.headers, 'x-vercel-ip-'], [{ latitude: '37.81', longitude: '-122.47' }, '']];
    for (const [source, prefix] of sources) {
      const param = source[prefix + name];
      result = typeof param === 'string' ? parseFloat(param) : Array.isArray(param) ? parseFloat(param[0]) : result;
      if (!isNaN(result)) break;
    }
    return result;
  }
  const longitude = getCoordinate('longitude');
  const latitude = getCoordinate('latitude');

  res.status(200).json({ longitude, latitude })
}
