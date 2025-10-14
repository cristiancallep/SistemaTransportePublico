import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { ApiService } from './api.service';
import { LoginRequest, LoginResponse, Usuario } from '../../shared/models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<Usuario | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  
  private tokenKey = 'auth_token';
  private refreshTokenKey = 'refresh_token';
  private userKey = 'current_user';

  constructor(
    private apiService: ApiService,
    private http: HttpClient
  ) {
    // Cargar usuario desde localStorage al inicializar
    this.loadUserFromStorage();
  }

  /**
   * Iniciar sesión
   */
  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.apiService.post<LoginResponse>('api/auth/login', credentials).pipe(
      map(response => {
        if (response.accessToken) {
          this.setSession(response);
        }
        return response;
      }),
      catchError(error => {
        console.error('Error en login:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Cerrar sesión
   */
  logout(): void {
    // Limpiar tokens del servidor (opcional)
    const refreshToken = this.getRefreshToken();
    if (refreshToken) {
      this.apiService.post('api/auth/logout', { refreshToken }).subscribe({
        error: (error) => console.warn('Error al cerrar sesión en el servidor:', error)
      });
    }

    this.clearSession();
  }

  /**
   * Refrescar token
   */
  refreshToken(): Observable<LoginResponse> {
    const refreshToken = this.getRefreshToken();
    
    if (!refreshToken) {
      return throwError(() => new Error('No refresh token available'));
    }

    return this.apiService.post<LoginResponse>('api/auth/refresh', { refreshToken }).pipe(
      map(response => {
        if (response.accessToken) {
          this.setSession(response);
        }
        return response;
      }),
      catchError(error => {
        this.clearSession();
        return throwError(() => error);
      })
    );
  }

  /**
   * Verificar si el usuario está autenticado
   */
  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) {
      return false;
    }

    // Verificar si el token ha expirado
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expiry = payload.exp * 1000;
      return Date.now() < expiry;
    } catch {
      return false;
    }
  }

  /**
   * Obtener usuario actual
   */
  getCurrentUser(): Usuario | null {
    return this.currentUserSubject.value;
  }

  /**
   * Obtener token de acceso
   */
  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  /**
   * Obtener refresh token
   */
  getRefreshToken(): string | null {
    return localStorage.getItem(this.refreshTokenKey);
  }

  /**
   * Verificar si el usuario tiene un permiso específico
   */
  hasPermission(permission: string): boolean {
    const user = this.getCurrentUser();
    return user?.rol?.permisos?.includes(permission) || false;
  }

  /**
   * Verificar si el usuario tiene uno de los roles especificados
   */
  hasRole(...roles: string[]): boolean {
    const user = this.getCurrentUser();
    return user?.rol ? roles.includes(user.rol.nombre) : false;
  }

  /**
   * Cambiar contraseña
   */
  changePassword(currentPassword: string, newPassword: string): Observable<any> {
    return this.apiService.post('auth/change-password', {
      currentPassword,
      newPassword
    });
  }

  /**
   * Solicitar restablecimiento de contraseña
   */
  forgotPassword(email: string): Observable<any> {
    return this.apiService.post('auth/forgot-password', { email });
  }

  /**
   * Restablecer contraseña
   */
  resetPassword(token: string, newPassword: string): Observable<any> {
    return this.apiService.post('auth/reset-password', {
      token,
      newPassword
    });
  }

  /**
   * Verificar email
   */
  verifyEmail(token: string): Observable<any> {
    return this.apiService.post('auth/verify-email', { token });
  }

  /**
   * Reenviar verificación de email
   */
  resendEmailVerification(): Observable<any> {
    return this.apiService.post('auth/resend-verification', {});
  }

  /**
   * Establecer sesión
   */
  private setSession(authResult: LoginResponse): void {
    localStorage.setItem(this.tokenKey, authResult.accessToken);
    localStorage.setItem(this.refreshTokenKey, authResult.refreshToken);
    localStorage.setItem(this.userKey, JSON.stringify(authResult.user));
    
    this.currentUserSubject.next(authResult.user);
  }

  /**
   * Limpiar sesión
   */
  private clearSession(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.refreshTokenKey);
    localStorage.removeItem(this.userKey);
    
    this.currentUserSubject.next(null);
  }

  /**
   * Cargar usuario desde localStorage
   */
  private loadUserFromStorage(): void {
    const userStr = localStorage.getItem(this.userKey);
    if (userStr && this.isAuthenticated()) {
      try {
        const user = JSON.parse(userStr);
        this.currentUserSubject.next(user);
      } catch (error) {
        console.error('Error parsing user from localStorage:', error);
        this.clearSession();
      }
    } else {
      this.clearSession();
    }
  }
}