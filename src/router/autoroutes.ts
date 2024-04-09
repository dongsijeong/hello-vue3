import { RouteRecordRaw } from 'vue-router';

export const routes: Array<RouteRecordRaw> = [
  { name: 'appbar', path: '/appbar', component: () => import(/*  webpackChunkName: "appbar" */ '../views/AppBar.vue'), props: true },
];
