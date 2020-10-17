import { NextApiRequest, NextApiResponse } from 'next';
import Cookies from 'cookies';
import { LoginSession } from '../../lib/db/LoginSession';
import { initDB, disconnectDB } from '../../lib/db';
import { callback } from '../../lib/services/twitter';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    await initDB();
    const cookies = new Cookies(req, res);
    const session = cookies.get('TwitterDetoxLoginSession');
    const loginSession = await LoginSession.findOne({ session }).exec();
    const { oauth_token, oauth_verifier } = req.query;
    const user = await callback(
      oauth_token as string,
      oauth_verifier as string,
      loginSession.tokenSecret
    );
    await LoginSession.findOneAndDelete({ session }).exec();
    cookies.set(
      'TwitterDetoxLoginSession',
      Buffer.from(JSON.stringify(user)).toString('base64')
    );
    await disconnectDB();
    res.redirect('/results');
  } catch (error) {
    console.error(error);
    res.statusCode = 500;
    res.json({ error: error.message });
  }
};
