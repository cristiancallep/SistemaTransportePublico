import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    
    // Verificar si el usuario está autenticado
    if (!this.authService.isAuthenticated()) {
      console.log('Usuario no autenticado, redirigiendo al login');
      this.router.navigate(['/auth/login'], { 
        queryParams: { returnUrl: state.url } 
      });
      return false;
    }

    const currentUser = this.authService.getCurrentUser();
    
    if (!currentUser) {
      console.log('No se pudo obtener datos del usuario');
      this.authService.logout();
      this.router.navigate(['/auth/login']);
      return false;
    }

    // Verificar permisos específicos si se definen en la ruta
    const requiredPermissions = route.data['permissions'] as string[];
    const requiredRoles = route.data['roles'] as string[];

    // Si se requieren permisos específicos
    if (requiredPermissions && requiredPermissions.length > 0) {
      const hasPermission = requiredPermissions.some(permission => 
        this.authService.hasPermission(permission)
      );
      
      if (!hasPermission) {
        console.log('Usuario sin permisos suficientes:', requiredPermissions);
        this.router.navigate(['/unauthorized']);
        return false;
      }
    }

    // Si se requieren roles específicos
    if (requiredRoles && requiredRoles.length > 0) {
      const hasRole = this.authService.hasRole(...requiredRoles);
      
      if (!hasRole) {
        console.log('Usuario sin rol requerido:', requiredRoles);
        this.router.navigate(['/unauthorized']);
        return false;
      }
    }

    return true;
  }
}

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(): boolean {
    if (this.authService.hasRole('Super Administrador', 'Administrador')) {
      return true;
    }
    
    this.router.navigate(['/unauthorized']);
    return false;
  }
}

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const expectedRoles = route.data['expectedRoles'] as string[];
    
    if (!expectedRoles || expectedRoles.length === 0) {
      return true; // Si no hay roles específicos requeridos, permitir acceso
    }

    if (this.authService.hasRole(...expectedRoles)) {
      return true;
    }
    
    this.router.navigate(['/unauthorized']);
    return false;
  }
}

@Injectable({
  providedIn: 'root'
})
export class PermissionGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const requiredPermissions = route.data['requiredPermissions'] as string[];
    
    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true; // Si no hay permisos específicos requeridos, permitir acceso
    }

    // Verificar si el usuario tiene al menos uno de los permisos requeridos
    const hasPermission = requiredPermissions.some(permission => 
      this.authService.hasPermission(permission)
    );

    if (hasPermission) {
      return true;
    }
    
    this.router.navigate(['/unauthorized']);
    return false;
  }
}