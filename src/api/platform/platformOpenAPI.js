import { axios } from '@/utils/request';

export const listAllTemplate = () =>
  axios({
    url: 'platformOpenAPI/listAllTemplate',
    method: 'post',
    data: {},
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });

export const queryTemplate = ({ id }) =>
  axios({
    url: 'platformOpenAPI/queryTemplate',
    method: 'post',
    data: { id },
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });

export const listTemplateAndPublish = (condition) =>
  axios({
    url: 'platformOpenAPI/listTemplateAndPublish',
    method: 'post',
    data: {},
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
      platformId: condition.platformId,
    },
  });

export const addTemplate = (condition) =>
  axios({
    url: 'platformOpenAPI/addTemplate',
    method: 'post',
    data: { id: condition.id },
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
      platformId: condition.platformId,
    },
  });
/**
 * 发布流程表单，即部署
 */
export const publishProcessForm = (condition) =>
  axios({
    url: 'platformOpenAPI/publishProcessForm',
    method: 'post',
    data: condition.data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
      platformId: condition.platformId,
    },
  });

/**
 * 更新流程表单，即重新部署
 */
export const updateProcessForm = (condition) =>
  axios({
    url: 'platformOpenAPI/updateProcessForm',
    method: 'post',
    data: condition.data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
      platformId: condition.platformId,
    },
  });

/**
 * 查询已发布的流程表单的详情
 */
export const queryProcessForm = ({ id }) =>
  axios({
    url: 'platformOpenAPI/queryProcessForm',
    method: 'post',
    data: { id },
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });

/**
 * 获取三方平台的组织架构
 */
export const organizationStructure = (condition) =>
  axios({
    url: 'platformOpenAPI/organizationStructure',
    method: 'post',
    data: {},
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
      platformId: condition.platformId,
      bizToken: condition.bizToken,
    },
  });

export const listDesignGroup = (condition) =>
  axios({
    url: 'platformOpenAPI/listDesignGroup',
    method: 'post',
    data: {},
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
      platformId: condition.platformId,
    },
  });
