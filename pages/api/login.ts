import { NextApiRequest, NextApiResponse } from 'next';
import { LoginSession } from '../../lib/db/LoginSession';
import { login } from '../../lib/services/twitter';
import { v4 as uuidv4 } from 'uuid';
import Cookies from 'cookies';
import { initDB, disconnectDB } from '../../lib/db';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    await initDB();
    const cookies = new Cookies(req, res);
    const { tokenSecret, url } = await login();
    const session = uuidv4();
    const loginSession = new LoginSession({ session, tokenSecret });
    await loginSession.save();
    cookies.set('TwitterDetoxLoginSession', session);
    await disconnectDB();
    res.redirect(url);
  } catch (error) {
    console.error(error);
    res.statusCode = 500;
    res.json({ error: error.message });
  }
};
