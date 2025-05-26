import { http } from '@src/services';
import { fetchedProfile } from '.';

export const apiGetProfile = () =>
  new Promise((resolve, reject) =>
    http
      .get('auth/profile')
      .then((rs) => resolve(rs))
      .catch((e) => reject(e)),
  );


export const requestFetchProfile = async () => {
  const data = await apiGetProfile();

  if (data) {
    fetchedProfile(data)
  }
};
