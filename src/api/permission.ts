import { request } from '@/utils/request';

const Api = {
  MenuList: '/user/getMenuList',
};

export function getMenuList() {
  return request.get({
    url: Api.MenuList,
  });
}
