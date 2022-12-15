import Head from 'next/head';
import Image from 'next/image';
import useSWR, { SWRConfig } from 'swr';
import type { SitesData } from './api/sites';

export default function Home() {
  const { data, error } = useSWR<SitesData>('/api/sites?db=gm-wss');

  const { data: gmwss_1_data } = useSWR<SitesData>(() => data && `/api/sites?db=gm-wss&x=1`);
  const { data: gmwss_2_data } = useSWR<SitesData>(() => gmwss_1_data && `/api/sites?db=gm-wss&x=2`);
  const { data: gmwss_3_data } = useSWR<SitesData>(() => gmwss_2_data && `/api/sites?db=gm-wss&x=3`);
  const { data: gmwss_4_data } = useSWR<SitesData>(() => gmwss_3_data && `/api/sites?db=gm-wss&x=4`);
  const { data: gmwss_5_data } = useSWR<SitesData>(() => gmwss_4_data && `/api/sites?db=gm-wss&x=5`);

  return (
    <SWRConfig value={{
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      fetcher: (url: string) => fetch(url).then(res => res.json()),
    }}>
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
            Secure WebSocket (wss://) to co-located proxy and DB: {' '}
            {gmwss_1_data?.duration ?? '...'} ms, {' '}
            {gmwss_2_data?.duration ?? '...'} ms, {' '}
            {gmwss_3_data?.duration ?? '...'} ms, {' '}
            {gmwss_4_data?.duration ?? '...'} ms, {' '}
            {gmwss_5_data?.duration ?? '...'} ms {' '}
          </li>
        </ul>
        <p>
          Heritage site data copyright &copy; 1992 – {new Date().getFullYear()} {' '}
          <a href="https://whc.unesco.org">UNESCO/World Heritage Centre</a>. All rights reserved.
        </p>
      </div>
    </SWRConfig>
  )
}
