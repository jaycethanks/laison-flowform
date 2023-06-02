import { axios } from '@/utils/request';

export const myApplyList = (condition) =>
  axios({
    url: 'processOpenAPI/myApplyList',
    method: 'post',
    data: {},
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
      uniTenantId: condition.uniTenantId,
      bizToken: condition.bizToken,
    },
  });
