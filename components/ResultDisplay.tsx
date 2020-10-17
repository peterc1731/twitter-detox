import React from 'react';
import styles from '../styles/ResultDisplay.module.css';
import { resData } from '../lib/models/local';
import Spacer from './Spacer';

export default function ResultDisplay({ data }: { data: resData }) {
  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Results</h2>
      <Spacer height={32} />
      <h3 className={styles.subheading}>
        Here&apos;s the list of all the accounts that have been checked, with
        the toxic ones highlighted first in red.
      </h3>
      <Spacer height={8} />
      <h3 className={styles.subheading}>
        You can check back again at any time to see the latest from your
        timeline.
      </h3>
      <Spacer height={64} />
      <div className={styles.rows}>
        {[...data.userToxicity]
          .sort((a) => (a.toxic ? -1 : 1))
          .map((u) => (
            <div key={u.user}>
              <a
                className={styles.row}
                style={{ borderColor: u.toxic ? '#d64933' : '#0b5d1e' }}
                href={`https://twitter.com/${u.user}`}
                target="_blank"
                rel="noreferrer"
              >
                <img src={u.avatar} className={styles.avatar} />
                <span className={styles.name}>{u.user}</span>
                {u.toxic && <img src="/assets/toxic-sign.svg" width="30"></img>}
              </a>
              <Spacer height={16} />
            </div>
          ))}
      </div>
    </div>
  );
}
