export const environment = {
  production: false,
  apiUrl: 'http://127.0.0.1:8000',
  
  // Configuración de la aplicación
  appName: 'Sistema Transporte Público',
  version: '1.0.0',
  
  // URLs de endpoints específicos
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

  // Configuración de autenticación
  auth: {
    tokenKey: 'auth_token',
    refreshTokenKey: 'refresh_token',
    userKey: 'current_user',
    tokenExpiryBuffer: 5 * 60 * 1000 // 5 minutos en ms
  },

  // Configuración de paginación
  pagination: {
    defaultPageSize: 10,
    pageSizeOptions: [5, 10, 25, 50, 100]
  },

  // Configuración de la interfaz
  ui: {
    sidebarCollapsed: false,
    theme: 'light',
    language: 'es'
  },

  // Configuración de archivos
  files: {
    maxSizeBytes: 5 * 1024 * 1024, // 5MB
    allowedTypes: ['image/jpeg', 'image/png', 'application/pdf', 'text/csv']
  }
};