import { createRouter, createWebHistory } from 'vue-router'
import AnalysisView from '@/views/AnalysisView.vue'
import NotFoundView from '@/views/NotFoundView.vue'
import HomeView from '@/views/HomeView.vue'
import BotsView from '@/views/BotsView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: HomeView,
    },
    {
      path: '/analysis',
      component: AnalysisView,
    },
    {
      path: '/bots/:bot',
      component: BotsView,
    },
    {
      path: "/:not_found(.*)*",
      component: NotFoundView,
    },
  ],
})

export default router
