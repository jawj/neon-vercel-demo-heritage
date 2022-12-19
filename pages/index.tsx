import Head from 'next/head';
import Image from 'next/image';
import useSWR, { SWRConfig } from 'swr';
import type { SitesData } from './api/sites';

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
  // some dubious copy-and-paste coding here, but useSWR does hate to be called in a loop ...

  const { data: a_1 } = useSWR<SitesData>(/*        */ `/api/sites?db=neon&tls=subtls&fast=no&coalesce=no&x=1`);
  const { data: a_2 } = useSWR<SitesData>(() => a_1 && `/api/sites?db=neon&tls=subtls&fast=no&coalesce=no&x=2`);
  const { data: a_3 } = useSWR<SitesData>(() => a_2 && `/api/sites?db=neon&tls=subtls&fast=no&coalesce=no&x=3`);
  const { data: a_4 } = useSWR<SitesData>(() => a_3 && `/api/sites?db=neon&tls=subtls&fast=no&coalesce=no&x=4`);
  const { data: a_5 } = useSWR<SitesData>(() => a_4 && `/api/sites?db=neon&tls=subtls&fast=no&coalesce=no&x=5`);

  const { data: b_1 } = useSWR<SitesData>(() => a_5 && `/api/sites?db=gm&tls=subtls&fast=no&coalesce=no&x=1`);
  const { data: b_2 } = useSWR<SitesData>(() => b_1 && `/api/sites?db=gm&tls=subtls&fast=no&coalesce=no&x=2`);
  const { data: b_3 } = useSWR<SitesData>(() => b_2 && `/api/sites?db=gm&tls=subtls&fast=no&coalesce=no&x=3`);
  const { data: b_4 } = useSWR<SitesData>(() => b_3 && `/api/sites?db=gm&tls=subtls&fast=no&coalesce=no&x=4`);
  const { data: b_5 } = useSWR<SitesData>(() => b_4 && `/api/sites?db=gm&tls=subtls&fast=no&coalesce=no&x=5`);

  const { data: c_1 } = useSWR<SitesData>(() => b_5 && `/api/sites?db=gm&tls=wss&fast=no&coalesce=no&x=1`);
  const { data: c_2 } = useSWR<SitesData>(() => c_1 && `/api/sites?db=gm&tls=wss&fast=no&coalesce=no&x=2`);
  const { data: c_3 } = useSWR<SitesData>(() => c_2 && `/api/sites?db=gm&tls=wss&fast=no&coalesce=no&x=3`);
  const { data: c_4 } = useSWR<SitesData>(() => c_3 && `/api/sites?db=gm&tls=wss&fast=no&coalesce=no&x=4`);
  const { data: c_5 } = useSWR<SitesData>(() => c_4 && `/api/sites?db=gm&tls=wss&fast=no&coalesce=no&x=5`);

  const { data: d_1 } = useSWR<SitesData>(() => c_5 && `/api/sites?db=gm&tls=wss&fast=yes&coalesce=no&x=1`);
  const { data: d_2 } = useSWR<SitesData>(() => d_1 && `/api/sites?db=gm&tls=wss&fast=yes&coalesce=no&x=2`);
  const { data: d_3 } = useSWR<SitesData>(() => d_2 && `/api/sites?db=gm&tls=wss&fast=yes&coalesce=no&x=3`);
  const { data: d_4 } = useSWR<SitesData>(() => d_3 && `/api/sites?db=gm&tls=wss&fast=yes&coalesce=no&x=4`);
  const { data: d_5 } = useSWR<SitesData>(() => d_4 && `/api/sites?db=gm&tls=wss&fast=yes&coalesce=no&x=5`);

  const { data: e_1 } = useSWR<SitesData>(() => d_5 && `/api/sites?db=gm&tls=wss&fast=yes&coalesce=yes&x=1`);
  const { data: e_2 } = useSWR<SitesData>(() => e_1 && `/api/sites?db=gm&tls=wss&fast=yes&coalesce=yes&x=2`);
  const { data: e_3 } = useSWR<SitesData>(() => e_2 && `/api/sites?db=gm&tls=wss&fast=yes&coalesce=yes&x=3`);
  const { data: e_4 } = useSWR<SitesData>(() => e_3 && `/api/sites?db=gm&tls=wss&fast=yes&coalesce=yes&x=4`);
  const { data: e_5 } = useSWR<SitesData>(() => e_4 && `/api/sites?db=gm&tls=wss&fast=yes&coalesce=yes&x=5`);

  return <>
    <h2>Timings</h2>
    <ul>
      <li>
        Ordinary WebSocket (ws://) + <a href="https://github.com/jawj/subtls">subtls</a> to separate proxy and Neon DB:<br />
        {a_1?.duration ?? '...'} ms, {' '}
        {a_2?.duration ?? '...'} ms, {' '}
        {a_3?.duration ?? '...'} ms, {' '}
        {a_4?.duration ?? '...'} ms, {' '}
        {a_5?.duration ?? '...'} ms {' '}
      </li>
      <li>
        Ordinary WebSocket (ws://) + <a href="https://github.com/jawj/subtls">subtls</a> to co-located proxy and DB:<br />
        {b_1?.duration ?? '...'} ms, {' '}
        {b_2?.duration ?? '...'} ms, {' '}
        {b_3?.duration ?? '...'} ms, {' '}
        {b_4?.duration ?? '...'} ms, {' '}
        {b_5?.duration ?? '...'} ms  {' '}
      </li>
      <li>
        Secure WebSocket (wss://) to co-located proxy and DB:<br />
        {c_1?.duration ?? '...'} ms, {' '}
        {c_2?.duration ?? '...'} ms, {' '}
        {c_3?.duration ?? '...'} ms, {' '}
        {c_4?.duration ?? '...'} ms, {' '}
        {c_5?.duration ?? '...'} ms  {' '}
      </li>
      <li>
        Secure WebSocket (wss://) to co-located proxy and DB, pipelined:<br />
        {d_1?.duration ?? '...'} ms, {' '}
        {d_2?.duration ?? '...'} ms, {' '}
        {d_3?.duration ?? '...'} ms, {' '}
        {d_4?.duration ?? '...'} ms, {' '}
        {d_5?.duration ?? '...'} ms  {' '}
      </li>
      <li>
        Secure WebSocket (wss://) to co-located proxy and DB, pipelined, coalesced writes:<br />
        {e_1?.duration ?? '...'} ms, {' '}
        {e_2?.duration ?? '...'} ms, {' '}
        {e_3?.duration ?? '...'} ms, {' '}
        {e_4?.duration ?? '...'} ms, {' '}
        {e_5?.duration ?? '...'} ms  {' '}
      </li>
    </ul>
  </>;
}

