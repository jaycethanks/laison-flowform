import { axios } from '@/utils/request';

export const findPage = (pageInfo) =>
  axios({
    url: `/platformInfo/findPage/${pageInfo.pagination.current}/${pageInfo.pagination.pageSize}`,
    method: 'post',
    data: pageInfo.condition,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });

export const add = (data) =>
  axios({
    url: '/platformInfo/add',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });

export const update = (data) =>
  axios({
    url: '/platformInfo/update',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
