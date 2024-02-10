import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('src/layouts/index.vue'),
    children: [
      {
        path: '',
        component: () => import('pages/auth/login.vue'),
        meta: {
          auth: false,
        },
      },
      {
        path: '/login',
        component: () => import('pages/auth/login.vue'),
        meta: {
          auth: false,
        },
        name: 'login',
      },
      {
        path: '/dashboard',
        component: () => import('src/layouts/dashboard.vue'),
        children: [
          {
            path: '',
            component: () => import('pages/dashboard/main.vue'),
            meta: {
              auth: true,
            },
            name: 'dasboard',
          },
          {
            path: 'users',
            component: () => import('pages/dashboard/users/index.vue'),
            meta: {
              auth: true,
              available: ['list-user'],
            },
            name: 'users',
          },
          {
            path: 'profile',
            component: () => import('pages/dashboard/profile/profile.vue'),
            meta: {
              auth: true,
              available: [],
            },
            name: 'profile',
          },
          {
            path: 'catalogs',
            component: () => import('pages/dashboard/catalogs/index.vue'),
            meta: {
              auth: true,
              available: ['list-catalogues'],
            },
            name: 'catalogs',
          },
          {
            path: 'catalogs/pages/:catalogId',
            component: () => import('pages/dashboard/pages/index.vue'),
            meta: {
              auth: true,
              available: ['list-catalogues'],
            },
            name: 'catalogsPages',
          },
          {
            path: 'categories',
            component: () => import('pages/dashboard/categories/index.vue'),
            meta: {
              auth: true,
              available: ['list-categories'],
            },
            name: 'categories',
          },
          {
            path: 'products',
            component: () => import('pages/dashboard/products/index.vue'),
            meta: {
              auth: true,
              available: ['list-products'],
            },
            name: 'products',
          },
        ],
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
