import Head from 'next/head';
import useSWR from 'swr';
import styles from '../styles/Home.module.css';

export default function Home() {
  const { data, error } = useSWR('/api/sites', (...args) => fetch(...args).then(res => res.json()));

  return (
    <div className={styles.container}>
      <Head>
        <title>World heritage sites</title>
        <meta name="description" content="Your nearest UNESCO World Heritage Sites, powered by Neon and Vercel" />
        <meta name="viewport" content="initial-scale=.55"></meta>
      </Head>

      {error ? <p>Failed to load</p> :
        !data ? <p>Loading...</p> :
          <ul>{
            data.map((site: any) =>
              <li key={site.id_no}><a href={`https://whc.unesco.org/en/list/${site.id_no}/`}
                style={{ backgroundImage: `url(https://whc.unesco.org/uploads/sites/gallery/google/site_${site.id_no}.jpg` }}>
                <span className="name">{site.name_en}</span>
                <span className="category">{site.category}</span>
                <span className="distance">{Math.round(site.distance / 1000)} km</span>
              </a></li>
            )}
          </ul>}
    </div>
  )
}
