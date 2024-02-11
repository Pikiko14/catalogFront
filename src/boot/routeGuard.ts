import { boot } from 'quasar/wrappers';
import { notification } from './notification';
import { useAuthStore } from 'src/stores/auth';
import { computed } from 'vue';

const store = useAuthStore();

const userData = computed(() => {
  return store.user;
});

const roles = userData.value && userData.value._id ? userData.value.scopes : [];
// more info on params: https://v2.quasar.dev/quasar-cli/boot-files
export default boot(async ({ router, app }) => {
  const i18n = app.config.globalProperties.$i18n;

  router.beforeEach((to, from, next) => {
    if (to && to.fullPath === '/login' && userData.value._id || to && to.fullPath === '/' && userData.value._id) {
      next('/dashboard');
      return true;
    }
    if (to.matched.some((record) => record.meta.auth) && !userData.value._id) {
      notification(
        'negative',
        i18n.locale === 'es'
          ? 'Necesitas estar logueado para acceder a esta sección'
          : 'You need to be logged in to access this section',
        'red-9'
      );
      store.doLogout();
      next('/login');
      return true;
    } else {
      if (to.matched.some((record) => record.meta.available)) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
        const available: any = to.meta.available;
        let hasPermission = false;
        if (available.length > 0 && roles && roles.length > 0) {
          const permissions = roles;
          for (const permission of permissions) {
            if (available && !available.includes(permission)) {
              hasPermission = false;
            } else {
              hasPermission = true;
              break;
            }
          }
          if (!hasPermission) {
            notification(
              'negative',
              i18n.locale === 'es'
                ? 'No tienes permiso para poder ver esta sección de la app'
                : 'You do not have permission to view this section of the app',
              'red-9'
            );
            next(false);
            return true;
          }
        }
      }
      if (to.path === '/login/' && userData.value._id) {
        next('/dashboard');
        return true;
      }
      next();
    }
  });
});
