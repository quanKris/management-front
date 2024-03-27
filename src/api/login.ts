import { request } from '@/utils/request';

const Api = {
  Login: '/login/login',
  Register: '/login/register',
  CardList: '/get-card-list',
};

export function loginApi(data: Record<string, unknown>) {
  return request.post({
    url: Api.Login,
    data,
  });
}
export function registerApi(data: Record<string, unknown>) {
  return request.post({
    url: Api.Register,
    data,
  });
}

export function getCardList() {
  return request.get({
    url: Api.CardList,
  });
}
