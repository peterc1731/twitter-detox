import React from 'react';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import styles from '../styles/Home.module.css';
import Spacer from '../components/Spacer';
import Cookies from 'cookies';

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Twitter Detox</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Twitter Detox</h1>
        <Spacer height={16} />
        <h2 className={styles.subtitle}>
          Discover sources of daily toxicity, then remove them from your life.
        </h2>
        <Spacer height={36} />
        <Link href="/api/login">
          <a className={styles.button}>Continue with Twitter</a>
        </Link>
      </main>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  try {
    const cookies = new Cookies(req, res);
    const session = cookies.get('TwitterDetoxLoginSession');
    const user = JSON.parse(Buffer.from(session, 'base64').toString('utf-8'));
    if (user && user.userName) {
      res.setHeader('location', '/results');
      res.statusCode = 302;
      res.end();
    }
  } catch (error) {
    // ignore error
  }
  return {
    props: {},
  };
};
