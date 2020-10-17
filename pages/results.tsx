import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { motion } from 'framer-motion';
import styles from '../styles/Home.module.css';
import { GetServerSideProps } from 'next';
import Cookies from 'cookies';
import Loader from '../components/Loader';
import { resData } from '../lib/models/local';
import ResultDisplay from '../components/ResultDisplay';
import ErrorBox from '../components/ErrorBox';

export default function Results() {
  const [results, setResults] = useState<resData>(undefined);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const getResults = async () => {
    try {
      setError(false);
      setLoading(true);
      const data = await fetch('/api/results');
      const json = await data.json();
      if (Array.isArray(json.usersToUnfollow)) {
        setResults(json);
      } else {
        console.error(json);
        setError(true);
      }
      setLoading(false);
    } catch (error) {
      setError(true);
      setLoading(false);
      console.error(error);
    }
  };

  useEffect(() => {
    getResults();
  }, []);

  return (
    <div className={styles.container}>
      <Head>
        <title>Twitter Detox</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <motion.main layout className={styles.main}>
        {loading && <Loader />}
        {error && <ErrorBox />}
        {results && <ResultDisplay data={results} />}
      </motion.main>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  try {
    const cookies = new Cookies(req, res);
    const session = cookies.get('TwitterDetoxLoginSession');
    if (!session) {
      throw new Error();
    }
    const user = JSON.parse(Buffer.from(session, 'base64').toString('utf-8'));
    if (!(user && user.userName)) {
      throw new Error();
    }
  } catch (error) {
    res.setHeader('location', '/');
    res.statusCode = 302;
    res.end();
  }
  return {
    props: {},
  };
};
