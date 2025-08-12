import { createRouter, createWebHistory } from 'vue-router'
import AnalysisView from '@/views/AnalysisView.vue'
import NotFoundView from '@/views/NotFoundView.vue'
import HomeView from '@/views/HomeView.vue'
import BotsView from '@/views/BotsView.vue'
import PuzzlesView from '@/views/PuzzlesView.vue'

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
      path: '/puzzles',
      component: PuzzlesView,
    },
    {
      path: "/:not_found(.*)*",
      component: NotFoundView,
    },
  ],
})

export default router
