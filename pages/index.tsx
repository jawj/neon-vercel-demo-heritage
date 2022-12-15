import Head from 'next/head';
import Image from 'next/image';
import useSWR, { SWRConfig } from 'swr';
import type { SitesData } from './api/sites';

function Nearest() {
  const { data, error } = useSWR<SitesData>('/api/sites?db=gm-wss');

  return <>
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
  </>;
}

function Timings() {
  // some dubious copy-and-paste coding here, but useSWR hates to be called in a loop ...

  const { data: gmwss_1 } = useSWR<SitesData>(`/api/sites?db=gm-wss&x=1`);
  const { data: gmwss_2 } = useSWR<SitesData>(() => gmwss_1 && `/api/sites?db=gm-wss&x=2`);
  const { data: gmwss_3 } = useSWR<SitesData>(() => gmwss_2 && `/api/sites?db=gm-wss&x=3`);
  const { data: gmwss_4 } = useSWR<SitesData>(() => gmwss_3 && `/api/sites?db=gm-wss&x=4`);
  const { data: gmwss_5 } = useSWR<SitesData>(() => gmwss_4 && `/api/sites?db=gm-wss&x=5`);

  const { data: gmsubtls_1 } = useSWR<SitesData>(() => gmwss_5 && `/api/sites?db=gm-subtls&x=1`);
  const { data: gmsubtls_2 } = useSWR<SitesData>(() => gmsubtls_1 && `/api/sites?db=gm-subtls&x=2`);
  const { data: gmsubtls_3 } = useSWR<SitesData>(() => gmsubtls_2 && `/api/sites?db=gm-subtls&x=3`);
  const { data: gmsubtls_4 } = useSWR<SitesData>(() => gmsubtls_3 && `/api/sites?db=gm-subtls&x=4`);
  const { data: gmsubtls_5 } = useSWR<SitesData>(() => gmsubtls_4 && `/api/sites?db=gm-subtls&x=5`);

  const { data: neonsubtls_1 } = useSWR<SitesData>(() => gmsubtls_5 && `/api/sites?db=neon-subtls&x=1`);
  const { data: neonsubtls_2 } = useSWR<SitesData>(() => neonsubtls_1 && `/api/sites?db=neon-subtls&x=2`);
  const { data: neonsubtls_3 } = useSWR<SitesData>(() => neonsubtls_2 && `/api/sites?db=neon-subtls&x=3`);
  const { data: neonsubtls_4 } = useSWR<SitesData>(() => neonsubtls_3 && `/api/sites?db=neon-subtls&x=4`);
  const { data: neonsubtls_5 } = useSWR<SitesData>(() => neonsubtls_4 && `/api/sites?db=neon-subtls&x=5`);

  return <>
    <h2>Timings</h2>

    <ul>
      <li>
        Secure WebSocket (wss://) to co-located proxy and DB:<br />
        {gmwss_1?.duration ?? '...'} ms, {' '}
        {gmwss_2?.duration ?? '...'} ms, {' '}
        {gmwss_3?.duration ?? '...'} ms, {' '}
        {gmwss_4?.duration ?? '...'} ms, {' '}
        {gmwss_5?.duration ?? '...'} ms  {' '}
      </li>
      <li>
        Ordinary WebSocket (ws://) + <a href="https://github.com/jawj/subtls">subtls</a> to co-located proxy and DB:<br />
        {gmsubtls_1?.duration ?? '...'} ms, {' '}
        {gmsubtls_2?.duration ?? '...'} ms, {' '}
        {gmsubtls_3?.duration ?? '...'} ms, {' '}
        {gmsubtls_4?.duration ?? '...'} ms, {' '}
        {gmsubtls_5?.duration ?? '...'} ms  {' '}
      </li>
      <li>
        Ordinary WebSocket (ws://) + <a href="https://github.com/jawj/subtls">subtls</a> to separate proxy and Neon DB:<br />
        {neonsubtls_1?.duration ?? '...'} ms, {' '}
        {neonsubtls_2?.duration ?? '...'} ms, {' '}
        {neonsubtls_3?.duration ?? '...'} ms, {' '}
        {neonsubtls_4?.duration ?? '...'} ms, {' '}
        {neonsubtls_5?.duration ?? '...'} ms  {' '}
      </li>
    </ul>
  </>;
}

export default function Home() {
  return (
    <SWRConfig value={{
      fetcher: (url: string) => fetch(url).then(res => res.json()),
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }}>
      <div>
        <Head>
          <title>World heritage sites</title>
          <meta name="description" content="Your nearest UNESCO World Heritage Sites, powered by Neon and Vercel" />
          <meta name="viewport" content="initial-scale=.55"></meta>
        </Head>

        <Nearest />
        <Timings />

        <p>
          Heritage site data copyright &copy; 1992 – {new Date().getFullYear()} {' '}
          <a href="https://whc.unesco.org">UNESCO/World Heritage Centre</a>. All rights reserved.
        </p>
      </div>
    </SWRConfig>
  )
}
