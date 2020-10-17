import { NextApiRequest, NextApiResponse } from 'next';
import getToxicity from '../../lib/services/getToxicity';
import { TwitterAuthUser, getTweets } from '../../lib/services/twitter';
import Cookies from 'cookies';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const cookies = new Cookies(req, res);
    const session = cookies.get('TwitterDetoxLoginSession');
    const user: TwitterAuthUser = JSON.parse(
      Buffer.from(session, 'base64').toString()
    );
    const tweets = await getTweets(200, user);
    const userToxicity = await getToxicity(tweets);
    const usersToUnfollow = userToxicity
      .filter((t) => t.toxic)
      .map((t) => t.user);

    res.statusCode = 200;
    res.json({
      userToxicity,
      usersToUnfollow,
    });
  } catch (error) {
    console.error(error);
    res.statusCode = 500;
    res.json({ error: error.message });
  }
};
