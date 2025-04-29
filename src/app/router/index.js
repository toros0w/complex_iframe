import { createRouter, createWebHashHistory, createWebHistory, RouterLink, RouterView } from 'vue-router'
//import HomeView from '../views/HomeView.vue'

const routes = [
  {
    path: "/:token/view",
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
              {
                path: "apartment/:apartment_id",
                name: "apartment-detail",
                component: () => import("@/pages/HomePage/ViewHome.vue"),
              }
              // {
              //   path: "apartment-view/:apartment_id",
              //   name: "apartment-view",
              //   component: () => import("@/shared/layouts/ViewApartment.vue")
              // }
            ],
          }
        ]
      },
    ],
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
    // redirect: { path: '/view' }
  },
  {
    path:"/test-layout",
    component: () => import("@/shared/layouts/TestLayout.vue"),
  },
  {
    path: "/access-denied",
    component: () => import("@/shared/layouts/AccessDenied.vue"),
  }
]

const router = createRouter({
  history: createWebHashHistory('/complexes-iframe/'),
  
  routes
})

export default router
