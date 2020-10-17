export interface resData {
  usersToUnfollow: string[];
  userToxicity: {
    user: string;
    avatar: string;
    toxic: boolean;
  }[];
}
