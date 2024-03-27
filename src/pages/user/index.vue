<template>
  <t-row :gutter="[24, 24]">
    <t-col :flex="3">
      <div class="user-left-greeting">
        <div>
          Hi，Image
          <span class="regular"> 下午好～</span>
        </div>
      </div>

      <t-card class="user-info-list" title="个人信息" :bordered="false">
        <template #actions>
          <t-dropdown :options="options" trigger="click" @click="clickHandler">
            <t-space>
              <t-button theme="default" shape="square" variant="text">
                <t-icon name="ellipsis" />
              </t-button>
            </t-space>
          </t-dropdown>
        </template>
        <t-row class="content" justify="start" :gutter="16">
          <t-col class="contract" :span="3">
            <div class="contract-title">账号：</div>
            <div class="flex">
              <t-input v-model="userInfo.account" disabled></t-input>
            </div>
          </t-col>
          <t-col class="contract" :span="3">
            <div class="contract-title">姓名：</div>
            <div class="flex">
              <t-input v-model="userInfo.name"></t-input>
              <t-button type="primary" @click="saveName">保存</t-button>
            </div>
          </t-col>
          <t-col class="contract" :span="3">
            <div class="contract-title">电话：</div>
            <div class="flex">
              <t-input v-model="userInfo.phone"></t-input>
              <t-button type="primary" @click="savePhone">保存</t-button>
            </div>
          </t-col>
          <t-col class="contract" :span="3">
            <div class="contract-title">邮箱：</div>
            <div class="flex">
              <t-input v-model="userInfo.email"></t-input>
              <t-button type="primary" @click="saveEmail">保存</t-button>
            </div>
          </t-col>
          <t-col class="contract" :span="3">
            <div class="contract-title">身份：</div>
            <div class="flex">
              <t-select v-model="userInfo.identity">
                <t-option label="超级管理员" value="超级管理员" />
                <t-option label="用户" value="用户" />
              </t-select>
              <t-button type="primary" @click="saveIdentity">保存</t-button>
            </div>
          </t-col>
          <t-col class="contract" :span="3">
            <div class="contract-title">部门：</div>
            <div class="flex">
              <t-input v-model="userInfo.department"></t-input>
              <t-button type="primary" @click="saveDepartment">保存</t-button>
            </div>
          </t-col>
          <t-col class="contract" :span="3">
            <div class="contract-title">性别</div>
            <div class="flex">
              <t-select v-model="userInfo.sex">
                <t-option label="男" value="男" />
                <t-option label="女" value="女" />
              </t-select>
              <t-button type="primary" @click="saveSex">保存</t-button>
            </div>
          </t-col>
        </t-row>
      </t-card>

      <t-card class="content-container" :bordered="false">
        <t-tabs value="second">
          <t-tab-panel value="first" label="内容列表">
            <p>内容列表</p>
          </t-tab-panel>
          <t-tab-panel value="second" label="内容列表">
            <t-card :bordered="false" class="card-padding-no" title="主页访问数据" describe="（次）">
              <template #actions>
                <t-date-range-picker
                  class="card-date-picker-container"
                  :default-value="LAST_7_DAYS"
                  theme="primary"
                  mode="date"
                  @change="onLineChange"
                />
              </template>
              <div id="lineContainer" style="width: 100%; height: 328px" />
            </t-card>
          </t-tab-panel>
          <t-tab-panel value="third" label="内容列表">
            <p>内容列表</p>
          </t-tab-panel>
        </t-tabs>
      </t-card>
    </t-col>

    <t-col :flex="1">
      <t-card class="user-intro" :bordered="false">
        <t-avatar size="80px">T</t-avatar>
        <div class="name">My Account</div>
        <div class="position">XXG 港澳业务拓展组员工 直客销售</div>
      </t-card>

      <t-card title="团队成员" class="user-team" :bordered="false">
        <template #actions>
          <t-button theme="default" shape="square" variant="text">
            <t-icon name="ellipsis" />
          </t-button>
        </template>
        <t-list :split="false">
          <t-list-item v-for="(item, index) in TEAM_MEMBERS" :key="index">
            <t-list-item-meta :image="item.avatar" :title="item.title" :description="item.description" />
          </t-list-item>
        </t-list>
      </t-card>

      <t-card title="服务产品" class="product-container" :bordered="false">
        <template #actions>
          <t-button theme="default" shape="square" variant="text">
            <t-icon name="ellipsis" />
          </t-button>
        </template>
        <t-row class="content" :getters="16">
          <t-col v-for="(item, index) in PRODUCT_LIST" :key="index" :span="3">
            <component :is="getIcon(item)"></component>
          </t-col>
        </t-row>
      </t-card>
    </t-col>
  </t-row>
</template>
<script lang="ts">
export default {
  name: 'UserIndex',
};
</script>
<script setup lang="ts">
import { LineChart } from 'echarts/charts';
import { GridComponent, LegendComponent, TooltipComponent } from 'echarts/components';
import * as echarts from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import type { DateRangeValue } from 'tdesign-vue-next';
import { MessagePlugin } from 'tdesign-vue-next';
import { computed, nextTick, onMounted, onUnmounted, reactive, watch } from 'vue';

import { changeEmail, changeIdentity, changeName, changeSex } from '@/api/user';
import ProductAIcon from '@/assets/assets-product-1.svg';
import ProductBIcon from '@/assets/assets-product-2.svg';
import ProductCIcon from '@/assets/assets-product-3.svg';
import ProductDIcon from '@/assets/assets-product-4.svg';
import { useSettingStore, useUserStore } from '@/store';
import { changeChartsTheme } from '@/utils/color';
import { LAST_7_DAYS } from '@/utils/date';

import { PRODUCT_LIST, TEAM_MEMBERS } from './constants';
import { getFolderLineDataSet } from './index';

echarts.use([GridComponent, TooltipComponent, LineChart, CanvasRenderer, LegendComponent]);

let lineContainer: HTMLElement;
let lineChart: echarts.ECharts;
const store = useSettingStore();
const userStore = useUserStore();
const chartColors = computed(() => store.chartColors);

const onLineChange = (value: DateRangeValue) => {
  lineChart.setOption(
    getFolderLineDataSet({
      dateTime: value as string[],
      ...chartColors.value,
    }),
  );
};

const initChart = () => {
  lineContainer = document.getElementById('lineContainer');
  lineChart = echarts.init(lineContainer);
  lineChart.setOption({
    grid: {
      x: 30, // 默认是80px
      y: 30, // 默认是60px
      x2: 10, // 默认80px
      y2: 30, // 默认60px
    },
    ...getFolderLineDataSet({ ...chartColors.value }),
  });
};

const updateContainer = () => {
  lineChart?.resize({
    width: lineContainer.clientWidth,
    height: lineContainer.clientHeight,
  });
};
const options = [{ content: '修改信息', value: 1 }];
const clickHandler = (data: { content: any }) => {
  MessagePlugin.success(`选中【${data.content}】`);
};
interface UserInfo {
  id: string;
  name: string;
  account: string;
  email: string;
  identity: string;
  department: string;
  phone: string;
  sex: string;
  status: boolean;
}

let userInfo = reactive<UserInfo>({
  id: '',
  name: '',
  account: '',
  email: '',
  identity: '',
  department: '',
  phone: '',
  sex: '',
  status: null,
});
userInfo = userStore.userInfo;

const saveSex = async () => {
  const res = await changeSex({ sex: userInfo.sex, id: userInfo.id });
  if (res.status === 0) {
    MessagePlugin.success('修改成功');
  } else {
    MessagePlugin.error('修改失败');
  }
};
const saveName = async () => {
  const res = await changeName({ name: userInfo.name, id: userInfo.id });
  if (res.status === 0) {
    MessagePlugin.success('修改成功');
  } else {
    MessagePlugin.error('修改失败');
  }
};
const saveEmail = async () => {
  const res = await changeEmail({ email: userInfo.email, id: userInfo.id });
  if (res.status === 0) {
    MessagePlugin.success('修改成功');
  } else {
    MessagePlugin.error('修改失败');
  }
};
const saveIdentity = async () => {
  const res = await changeIdentity({ identity: userInfo.identity, id: userInfo.id });
  if (res.status === 0) {
    MessagePlugin.success('修改成功');
  } else {
    MessagePlugin.error('修改失败');
  }
};
const savePhone = async () => {};
const saveDepartment = async () => {};
onMounted(() => {
  nextTick(() => {
    initChart();
  });
  window.addEventListener('resize', updateContainer, false);
});

onUnmounted(() => {
  window.removeEventListener('resize', updateContainer);
});

const getIcon = (type: string) => {
  switch (type) {
    case 'a':
      return ProductAIcon;
    case 'b':
      return ProductBIcon;
    case 'c':
      return ProductCIcon;
    case 'd':
      return ProductDIcon;
    default:
      return ProductAIcon;
  }
};

watch(
  () => store.brandTheme,
  () => {
    changeChartsTheme([lineChart]);
  },
);
</script>

<style lang="less" scoped>
@import url('./index.less');
</style>
