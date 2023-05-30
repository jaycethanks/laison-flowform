import { axios } from '@/utils/request';

export const add = (data) =>
  axios({
    url: '/processFormTemplate/add',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });

export const listPlatformGroup = (data) =>
  axios({
    url: '/processFormTemplate/listTemplateGroup',
    method: 'post',
    data: {},
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });

export const listDesignGroup = () =>
  axios({
    url: '/processFormTemplate/listDesignGroup',
    method: 'post',
    data: {},

    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });

export const update = (data) =>
  axios({
    url: '/processFormTemplate/update',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });

export const deleteById = (id) =>
  axios({
    url: `/processFormTemplate/deleteById/${id}`,
    method: 'delete',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });

export const findById = (id) =>
  axios({
    url: `/processFormTemplate/findById/${id}`,
    method: 'get',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
