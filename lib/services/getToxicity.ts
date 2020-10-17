import { isToxic, preLoadToxModel } from '../ml/sentiment';
import { Tweet } from '../models/twitter';

export default async function getToxicity(tweets: Tweet[]) {
  await preLoadToxModel();
  const userToxicity = await Promise.all(
    Object.entries(
      tweets.reduce((acc, val) => {
        if (acc[val.user]) {
          acc[val.user].tweets.push(val.text);
        } else {
          acc[val.user] = {
            tweets: [val.text],
            avatar: val.avatar,
          };
        }
        return acc;
      }, {} as { [key: string]: { avatar: string; tweets: string[] } })
    ).map(async ([user, { tweets, avatar }]) => ({
      user,
      toxic: await isToxic(tweets),
      avatar,
    }))
  );

  return userToxicity;
}
