import { defineStore } from 'pinia';

import { loginApi } from '@/api/login';
import { getApiUserInfo } from '@/api/user';
import { usePermissionStore } from '@/store';
import type { UserInfo } from '@/types/interface';

const InitUserInfo: UserInfo = {
  name: '', // 用户名，用于展示在页面右上角头像处
  roles: [], // 前端权限模型使用 如果使用请配置modules/permission-fe.ts使用,
  id: '',
  account: '',
  email: '',
  identity: '',
  department: '',
  phone: '',
  sex: '',
  status: false,
};

export const useUserStore = defineStore('user', {
  state: () => ({
    token: '',
    userInfo: { ...InitUserInfo },
  }),
  getters: {
    roles: (state) => {
      return state.userInfo?.roles;
    },
    userToken: (state) => {
      return state.token;
    },
  },
  actions: {
    async login(userInfo: Record<string, unknown>) {
      const res = await loginApi(userInfo);
      console.log(res);
      this.token = res.token;
    },
    async getUserInfo() {
      // const mockRemoteUserInfo = async (token: string) => {
      //   if (token === 'main_token') {
      //     return {
      //       name: 'Tencent',
      //       roles: ['all'], // 前端权限模型使用 如果使用请配置modules/permission-fe.ts使用
      //     };
      //   }
      //   return {
      //     name: 'td_dev',
      //     roles: ['UserIndex', 'DashboardBase', 'login'], // 前端权限模型使用 如果使用请配置modules/permission-fe.ts使用
      //   };
      // };
      const res = await getApiUserInfo();

      this.userInfo = res;
    },
    async logout() {
      this.token = '';
      this.userInfo = { ...InitUserInfo };
    },
  },
  persist: {
    afterRestore: () => {
      const permissionStore = usePermissionStore();
      permissionStore.initRoutes();
    },
    key: 'user',
    paths: ['token'],
  },
});
