import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router'
//import HomeView from '../views/HomeView.vue'

const routes = [
  {
    path: "/",
    name: "main",
    component: () => import("@/pages/MainPage.vue"),
  },
  {
    path: "/view",
    name: "complexes-view",
    component: () => import("@/pages/ComplexesViewWrapper.vue"),
    children: [
      {
        path: '',
        name: 'complexes-view-list',
        component: () => import('@/pages/ComplexesView.vue'),
      },
      {
        path: ":id",
        name: "complexView",
        component: () => import("@/pages/ComplexViewMode"),
      },
      {
        path: "home/:id",
        name: "complexes-view-home",
        component: () => import("@/pages/HomePage.vue"),
        children: [
          {
            path: "view-home",
            name: "complexes-view-viewHome",
            component: () => import("@/pages/HomePage/ViewHome.vue"),        
          },
        ]
      }
      // {
      //   path: "home/:id",
      //   name: "home",
      //   component: () => import("@/pages/HomePage.vue"),
      //   children: [
      //   ]
      // }
    ]
  },
  {
    path: "/import",
    name: "import",
    component: () => import("@/pages/ImportHomes.vue"),
  },
  {
    path: "/complex/:id",
    name: "complex",
    component: () => import("@/pages/ComplexPage.vue"),
  },
  {
    path: "/home/:id",
    name: "home",
    component: () => import("@/pages/HomePage.vue"),
    children: [
      {
        path: "main",
        name: "homeMain",
        component: () => import("@/pages/HomePage/MainPage.vue"),
      },
      {
        path: "chess",
        name: "chess",
        component: () => import("@/pages/HomePage/ChessPage.vue"),
      },
      {
        path: "view-home",
        name: "viewHome",
        component: () => import("@/pages/HomePage/ViewHome.vue"),        
      },
      {
        path: "planLayout",
        name: "planLayoutPage",
        component: () => import("@/pages/HomePage/PlanLayoutPage.vue"),
      },
      {
        path: "floor-plan/:floor_plan_id",
        name: "floors",
        component: () => import("@/pages/EditPlanFloors.vue"),
      },
      {
        path: "facades",
        name: "facades",
        component: () => import("@/pages/EditFacades.vue"),
      },
    ],
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  
  routes
})

export default router
