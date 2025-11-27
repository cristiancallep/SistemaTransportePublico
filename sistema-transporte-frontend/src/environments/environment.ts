export const environment = {
  production: false,
  apiUrl: 'http://127.0.0.1:8000',
  
  appName: 'Sistema Transporte Público',
  version: '1.0.0',
  
  endpoints: {
    auth: {
      login: 'api/auth/login',
      logout: 'api/auth/logout',
      refresh: 'api/auth/refresh-token',
      changePassword: 'api/auth/change-password',
      forgotPassword: 'api/auth/forgot-password',
      resetPassword: 'api/auth/reset-password'
    },
    usuarios: 'api/usuarios',
    tarjetas: 'api/tarjetas',
    transportes: 'api/transportes',
    empleados: 'api/empleados',
    roles: 'api/roles',
    reportes: 'api/reportes',
    dashboard: 'api/dashboard'
  },

  auth: {
    tokenKey: 'auth_token',
    refreshTokenKey: 'refresh_token',
    userKey: 'current_user',
    tokenExpiryBuffer: 5 * 60 * 1000
  },

  pagination: {
    defaultPageSize: 10,
    pageSizeOptions: [5, 10, 25, 50, 100]
  },

  ui: {
    sidebarCollapsed: false,
    theme: 'light',
    language: 'es'
  },

  files: {
    maxSizeBytes: 5 * 1024 * 1024,
    allowedTypes: ['image/jpeg', 'image/png', 'application/pdf', 'text/csv']
  }
};