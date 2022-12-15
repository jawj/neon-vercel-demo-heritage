import Head from 'next/head';
import Image from 'next/image';
import useSWR from 'swr';
import type { SitesData } from './api/sites';

export default function Home() {
  const fetcher = (url: string) => fetch(url).then(res => res.json());
  const { data, error } = useSWR<SitesData>('/api/sites?db=gm-wss', fetcher);

  const { data: gmwss_1_data, error: gmwss_1_error } = useSWR<SitesData>(`/api/sites?db=gm-wss&x=1`, fetcher);
  const { data: gmwss_2_data, error: gmwss_2_error } = useSWR<SitesData>(() => gmwss_1_data && `/api/sites?db=gm-wss&x=2`, fetcher);
  const { data: gmwss_3_data, error: gmwss_3_error } = useSWR<SitesData>(() => gmwss_2_data && `/api/sites?db=gm-wss&x=3`, fetcher);
  const { data: gmwss_4_data, error: gmwss_4_error } = useSWR<SitesData>(() => gmwss_3_data && `/api/sites?db=gm-wss&x=4`, fetcher);
  const { data: gmwss_5_data, error: gmwss_5_error } = useSWR<SitesData>(() => gmwss_4_data && `/api/sites?db=gm-wss&x=5`, fetcher);

  return (
    <div>
      <Head>
        <title>World heritage sites</title>
        <meta name="description" content="Your nearest UNESCO World Heritage Sites, powered by Neon and Vercel" />
        <meta name="viewport" content="initial-scale=.55"></meta>
      </Head>

      <h1>Your nearest world heritage sites</h1>

      {error ? <p className="error">Error: failed to load</p> :
        !data ? <p className="loading"><Image src="/loading.svg" alt="Loading spinner" width="66" height="66" /><br />Loading &hellip;</p> :
          <div className="sites"><ul>{
            data.nearestSites.map(site =>
              <li key={site.id_no}><a href={`https://whc.unesco.org/en/list/${site.id_no}/`}
                style={{ backgroundImage: `url(https://whc.unesco.org/uploads/sites/gallery/google/site_${site.id_no}.jpg` }}>
                <span className="name">{site.name_en}</span>
                <span className="category">{site.category}</span>
                <span className="distance">{Math.round(site.distance / 1000)} km</span>
              </a></li>
            )}
          </ul></div>
      }
      <h2>Timing</h2>
      <ul>
        <li>
          Secure WebSocket (wss://) to co-located proxy and DB:
          {gmwss_1_data?.duration ?? gmwss_1_error}
          {gmwss_2_data?.duration ?? gmwss_2_error}
          {gmwss_3_data?.duration ?? gmwss_3_error}
          {gmwss_4_data?.duration ?? gmwss_4_error}
          {gmwss_5_data?.duration ?? gmwss_5_error}
        </li>
      </ul>
      <p>
        Heritage site data copyright &copy; 1992 – {new Date().getFullYear()} {' '}
        <a href="https://whc.unesco.org">UNESCO/World Heritage Centre</a>. All rights reserved.
      </p>
    </div>
  )
}
