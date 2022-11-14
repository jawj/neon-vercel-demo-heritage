import Head from 'next/head';
import useSWR from 'swr';
import styles from '../styles/Home.module.css';
import type { SitesData } from './api/sites';

export default function Home() {
  const { data, error } = useSWR<SitesData>('/api/sites', url => fetch(url).then(res => res.json()));

  return (
    <div className={styles.container}>
      <Head>
        <title>World heritage sites</title>
        <meta name="description" content="Your nearest UNESCO World Heritage Sites, powered by Neon and Vercel" />
        <meta name="viewport" content="initial-scale=.55"></meta>
      </Head>

      <h1>Your nearest world heritage sites</h1>

      {error ? <p>Failed to load</p> :
        !data ? <p>Loading...</p> :
          <ul className="sites">{
            data.nearestSites.map(site =>
              <li key={site.id_no}><a href={`https://whc.unesco.org/en/list/${site.id_no}/`}
                style={{ backgroundImage: `url(https://whc.unesco.org/uploads/sites/gallery/google/site_${site.id_no}.jpg` }}>
                <span className="name">{site.name_en}</span>
                <span className="category">{site.category}</span>
                <span className="distance">{Math.round(site.distance / 1000)} km</span>
              </a></li>
            )}
          </ul>}

      <p>
        Heritage site data copyright &copy; 1992 – {new Date().getFullYear()}
        <a href="https://whc.unesco.org">UNESCO/World Heritage Centre</a>. All rights reserved.
      </p>
    </div>
  )
}
