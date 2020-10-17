import React from 'react';
import styles from '../styles/Home.module.css';
import Spacer from './Spacer';

export default function ErrorBox() {
  return (
    <div className={styles.error}>
      Oops! Something went wrong.
      <Spacer height={16} />
      Please Try again later.
    </div>
  );
}
