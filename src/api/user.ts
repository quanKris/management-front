import { request } from '@/utils/request';

const Api = {
  url: '/user/getUserInfo',
  changeSex: '/user/changeSex',
  changeIdentity: '/user/changeIdentity',
  changeName: '/user/changeName',
  changeEmail: '/user/changeEmail',
};

export function getApiUserInfo() {
  return request.get({
    url: Api.url,
  });
}
export function changeName(data: { name: string; id: string }) {
  return request.post({
    url: Api.changeName,
    data,
  });
}
export function changeSex(data: { sex: string; id: string }) {
  return request.post({
    url: Api.changeSex,
    data,
  });
}
export function changeIdentity(data: { identity: string; id: string }) {
  return request.post({
    url: Api.changeIdentity,
    data,
  });
}
export function changeEmail(data: { email: string; id: string }) {
  return request.post({
    url: Api.changeEmail,
    data,
  });
}
