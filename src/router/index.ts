import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import RequesterView from "../views/RequesterView.vue";
import ValidatorView from "../views/ValidatorView.vue";
import { useVacationStore } from "../stores/vacationStore";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/requester",
      name: "requester",
      component: RequesterView,
      meta: { requiresRole: "Requester" },
    },
    {
      path: "/validator",
      name: "validator",
      component: ValidatorView,
      meta: { requiresRole: "Validator" },
    },
  ],
});

// Guard: redirect to home if no user selected or wrong role
router.beforeEach((to, _from, next) => {
  const store = useVacationStore();
  if (to.meta.requiresRole && (!store.currentUser || store.currentUser.role !== to.meta.requiresRole)) {
    next({ name: "home" });
  } else {
    next();
  }
});

export default router;
