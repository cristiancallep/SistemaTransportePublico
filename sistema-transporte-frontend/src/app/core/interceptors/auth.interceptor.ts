import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, switchMap, filter, take } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  
  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    
    // Agregar token de autorización si existe
    const authToken = this.authService.getToken();
    let authReq = req;

    if (authToken && !this.isPublicRoute(req.url)) {
      authReq = this.addTokenToRequest(req, authToken);
    }

    // Agregar headers comunes
    authReq = authReq.clone({
      setHeaders: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
      }
    });

    return next.handle(authReq).pipe(
      catchError((error: HttpErrorResponse) => {
        
        // Si es error 401 y no estamos ya refrescando el token
        if (error.status === 401 && !this.isRefreshing && !this.isPublicRoute(req.url)) {
          return this.handle401Error(authReq, next);
        }

        // Si es error 403, redirigir a página no autorizada
        if (error.status === 403) {
          this.router.navigate(['/unauthorized']);
        }

        // Si es error de red o servidor
        if (error.status === 0 || error.status >= 500) {
          console.error('Error de conexión o servidor:', error);
          // Aquí podrías mostrar un toast o notificación global
        }

        return throwError(() => error);
      })
    );
  }

  private addTokenToRequest(request: HttpRequest<any>, token: string): HttpRequest<any> {
    return request.clone({
      setHeaders: {
        'Authorization': `Bearer ${token}`
      }
    });
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      const refreshToken = this.authService.getRefreshToken();

      if (refreshToken) {
        return this.authService.refreshToken().pipe(
          switchMap((authResponse: any) => {
            this.isRefreshing = false;
            this.refreshTokenSubject.next(authResponse.accessToken);
            
            // Reintentar la petición original con el nuevo token
            return next.handle(this.addTokenToRequest(request, authResponse.accessToken));
          }),
          catchError((error) => {
            this.isRefreshing = false;
            
            // Si falla el refresh, hacer logout y redirigir
            this.authService.logout();
            this.router.navigate(['/auth/login']);
            
            return throwError(() => error);
          })
        );
      } else {
        // No hay refresh token, hacer logout
        this.isRefreshing = false;
        this.authService.logout();
        this.router.navigate(['/auth/login']);
        
        return throwError(() => new Error('No refresh token available'));
      }
    } else {
      // Si ya estamos refrescando, esperar a que termine
      return this.refreshTokenSubject.pipe(
        filter(token => token != null),
        take(1),
        switchMap(token => {
          return next.handle(this.addTokenToRequest(request, token));
        })
      );
    }
  }

  private isPublicRoute(url: string): boolean {
    const publicRoutes = [
      '/auth/login',
      '/auth/register',
      '/auth/forgot-password',
      '/auth/reset-password',
      '/auth/refresh-token',
      '/health'
    ];

    return publicRoutes.some(route => url.includes(route));
  }
}

@Injectable()
export class LoadingInterceptor implements HttpInterceptor {
  
  constructor() {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    
    // Mostrar indicador de carga
    // Aquí podrías integrar con un servicio de loading global
    
    return next.handle(req).pipe(
      // Ocultar indicador de carga cuando termine
      catchError((error) => {
        // Ocultar loading también en caso de error
        return throwError(() => error);
      })
    );
  }
}

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor() {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        
        let errorMessage = 'Ha ocurrido un error desconocido';

        if (error.error instanceof ErrorEvent) {
          // Error del lado del cliente
          errorMessage = `Error: ${error.error.message}`;
        } else {
          // Error del lado del servidor
          switch (error.status) {
            case 400:
              errorMessage = error.error?.message || 'Solicitud incorrecta';
              break;
            case 401:
              errorMessage = 'No autorizado. Por favor inicia sesión';
              break;
            case 403:
              errorMessage = 'Acceso prohibido. No tienes permisos suficientes';
              break;
            case 404:
              errorMessage = 'Recurso no encontrado';
              break;
            case 422:
              if (error.error?.detail) {
                // FastAPI validation errors
                const validationErrors = error.error.detail;
                if (Array.isArray(validationErrors)) {
                  errorMessage = validationErrors.map((err: any) => 
                    `${err.loc?.join('.')}: ${err.msg}`
                  ).join(', ');
                } else {
                  errorMessage = error.error.detail;
                }
              } else {
                errorMessage = error.error?.message || 'Error de validación';
              }
              break;
            case 500:
              errorMessage = 'Error interno del servidor. Intenta más tarde';
              break;
            default:
              errorMessage = `Error ${error.status}: ${error.error?.message || error.message}`;
          }
        }

        // Log del error para debugging
        console.error('HTTP Error:', {
          status: error.status,
          statusText: error.statusText,
          message: errorMessage,
          url: error.url,
          error: error.error
        });

        // Aquí podrías mostrar un toast o notificación global
        // this.notificationService.showError(errorMessage);

        return throwError(() => new Error(errorMessage));
      })
    );
  }
}