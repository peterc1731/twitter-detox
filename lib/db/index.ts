import { connect, disconnect } from 'mongoose';

export const initDB = () =>
  connect(process.env.TD_DB_URL, {
    useNewUrlParser: true,
    poolSize: 1,
  });

export const disconnectDB = disconnect;
