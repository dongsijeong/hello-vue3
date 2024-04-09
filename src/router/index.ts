import {createRouter, createWebHistory} from 'vue-router';
import { onAppNavigate } from './navigationManager';
import { routes } from './autoroutes';

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeResolve(onAppNavigate);

export default router;
