import { createRouter, createWebHashHistory, createWebHistory, RouterLink, RouterView } from 'vue-router'
//import HomeView from '../views/HomeView.vue'

const routes = [
  {
    path: "/view",
    name: "view-pages",
    component: () => import("@/pages/View"),
    meta: {
      isViewPage: true,
    },
    children: [
      {
        path: '',
        name: 'complexes-list',
        component: () => import('@/pages/ComplexesView.vue'),
      },
      {
        path: ":id",
        name: "complex-homes-router",
        // component: () => import("@/pages/ComplexViewMode"),
        component: RouterView,
        children: [
          {
            path: '',
            name: 'complex-homes',
            component: () => import("@/pages/ComplexViewMode"),
          },
          {
            path: 'apartments',
            name: 'complex-apartments',
            component: () => import('@/pages/ApartmentsList.vue')
          },
          {
            path: "home/:house_id",
            name: "home",
            component: () => import("@/pages/HomePage.vue"),
            children: [
              {
                path: "",
                name: "view-home",
                component: () => import("@/pages/HomePage/ViewHome.vue"),        
              },
            ]
          }
        ]
      },
      // {
      //   path: "home/:id",
      //   name: "home",
      //   component: () => import("@/pages/HomePage.vue"),
      //   children: [
      //   ]
      // }
    ],

  },
  {
    path: "/my-objects",
    name: "edit-pages",
    component: () => import("@/pages/Edit"),
    children: [
      {
        path: "",
        name: "main",
        component: () => import("@/pages/MainPage.vue"),
      },
      {
        path: "import",
        name: "import",
        component: () => import("@/pages/ImportHomes.vue"),
      },
      {
        path: ":id",
        name: "complex-router",
        component: RouterView,
        children: [
          {
            path: '',
            name: 'complex',
            component: () => import("@/pages/ComplexPage.vue"),
          },
          {
            path: 'apartments',
            name: 'complex-apartments-edit',
            component: () => import('@/pages/ApartmentsList.vue')
          },
          {
            path: "home/:house_id",
            name: "edit-home",
            component: () => import("@/pages/HomePage.vue"),
            children: [
              {
                path: "",
                name: "homeMain",
                component: () => import("@/pages/HomePage/MainPage.vue"),
              },
              {
                path: "chess",
                name: "chess",
                component: () => import("@/pages/HomePage/ChessPage.vue"),
              },
              {
                path: "view",
                name: "viewHome",
                component: () => import("@/pages/HomePage/ViewHome.vue"),        
              },
              {
                path: "planLayout/:tab",
                name: "planLayoutPage",
                children: [
                  {
                    path: "",
                    name: "planLayoutList",
                    component: () => import("@/pages/HomePage/PlanLayoutPage.vue"),
                  },
                  {
                    path: ":floor_plan_id",
                    name: "editPlanFloors",
                    component: () => import("@/pages/EditPlanFloors.vue"),
                    beforeEnter: (to, from, next) => {
                      if (to.params.tab == 'floors') {
                        next();
                      } else {
                        next(false);
                      }
                    },
                  },
                ],
              },
              {
                path: "facades",
                name: "facades",
                component: () => import("@/pages/EditFacades.vue"),
              },
            ],
          },
        ]
      },
    ]
  },
  {
    path: "/archived-objects",
    name: "archived-objects-page",
    component: () => import("@/pages/Edit"),
    children: [
      {
        path: "",
        name: "archive-main",
        component: () => import("@/pages/MainPage.vue"),
      },
    ]
  },
  {
    path: "/apartments/:apartment_id",
    name: "apartment",
    component: () => import("@/pages/Apartment"),
  },
  {
    path: "/:catchAll(.*)",
    redirect: { path: '/my-objects' }
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  
  routes
})

export default router
