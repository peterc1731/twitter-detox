import LoginWithTwitter from 'login-with-twitter';
import { Tweet } from '../models/twitter';
import Twit from 'twit';

export interface TwitterAuthUser {
  userId: string;
  userName: string;
  userToken: string;
  userTokenSecret: string;
}

interface TimelineData {
  text: string;
  user: {
    screen_name: string;
    profile_image_url_https: string;
  };
}

const tw = new LoginWithTwitter({
  consumerKey: process.env.TD_CONSUMER_KEY,
  consumerSecret: process.env.TD_CONSUMER_SECRET,
  callbackUrl: process.env.DEV_MODE
    ? 'http://localhost:3000/api/callback'
    : 'https://twitter-detox.herokuapp.com/api/callback',
});

export const login = () =>
  new Promise<{ tokenSecret: string; url: string }>((res, rej) =>
    tw.login((err: Error, tokenSecret: string, url: string) => {
      if (err) {
        return rej(err);
      }
      return res({ tokenSecret, url });
    })
  );

export const callback = (
  oauth_token: string,
  oauth_verifier: string,
  tokenSecret: string
) =>
  new Promise<TwitterAuthUser>((res, rej) => {
    tw.callback(
      {
        oauth_token,
        oauth_verifier,
      },
      tokenSecret,
      (err: Error, user: TwitterAuthUser) => {
        if (err) {
          return rej(err);
        }
        return res(user);
      }
    );
  });

export async function getTweets(
  count: number,
  user: TwitterAuthUser
): Promise<Tweet[]> {
  const T = new Twit({
    consumer_key: process.env.TD_CONSUMER_KEY,
    consumer_secret: process.env.TD_CONSUMER_SECRET,
    access_token: user.userToken,
    access_token_secret: user.userTokenSecret,
    timeout_ms: 60 * 1000,
    strictSSL: true,
  });
  const { data } = await T.get('statuses/home_timeline', {
    count: 100,
  });
  return (data as TimelineData[]).map((t) => ({
    text: t.text,
    user: t.user.screen_name,
    avatar: t.user.profile_image_url_https,
  }));
}
