import { axios } from '@/utils/request';

export const add = (data) =>
  axios({
    url: 'templates',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
