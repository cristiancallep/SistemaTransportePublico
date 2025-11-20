import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ApiService } from '../../core/services/api.service';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { MatTableModule } from '@angular/material/table';

@Component({
    selector: 'app-reportes',
    standalone: true,
    imports: [
        CommonModule, 
        MatCardModule, 
        MatIconModule, 
        MatToolbarModule, 
        MatButtonModule, 
        MatSnackBarModule,
        MatTableModule
    ],
template: `
    <div class="reportes-container">
    <mat-toolbar color="primary" class="dashboard-header">
        <span class="title">
            <mat-icon class="title-icon">assessment</mat-icon>
            Reportes — Datos de tablas
        </span>
        <div class="spacer"></div>
        <button mat-icon-button (click)="refreshAll()" title="Refrescar todo">
            <mat-icon>refresh</mat-icon>
        </button>
    </mat-toolbar>

    <main class="main-content">
        <section class="stats-section">
            <mat-card *ngFor="let s of stats" class="stat-card-mini">
                <div class="stat-title">{{ s.title | uppercase }}</div>
                <div class="stat-value">{{ s.count }}</div>
            </mat-card>
        </section>
        
        <mat-card *ngFor="let table of tables" class="table-card">
            <mat-card-header>
                <mat-card-title>{{ table.title }}</mat-card-title>
            </mat-card-header>
            
            <mat-card-content>
                <div *ngIf="table.loading" class="loading-state">Cargando...</div>
                <div *ngIf="!table.loading && table.error" class="error-message">{{ table.error }}</div>
                
                <div *ngIf="!table.loading && !table.error">
                    <div *ngIf="table.key !== 'asignaciones' && table.data.length > 0 && table.data.length === 1" class="info-message">
                        Respuesta única (se muestra envuelta como arreglo).
                    </div>
                    
                    <div class="table-wrapper" *ngIf="table.data.length > 0">
                        <table mat-table [dataSource]="table.data" class="data-table">
                            <ng-container *ngFor="let col of table.columns" [matColumnDef]="col">
                                <th mat-header-cell *matHeaderCellDef>{{ col | uppercase }}</th>
                                <td mat-cell *matCellDef="let row">{{ formatCell(row[col]) }}</td>
                            </ng-container>
                            
                            <tr mat-header-row *matHeaderRowDef="table.columns"></tr>
                            <tr mat-row *matRowDef="let row; columns: table.columns;"></tr>
                        </table>
                    </div>
                    
                    <div *ngIf="table.data.length === 0" class="empty-state">
                        <mat-icon>inbox</mat-icon>
                        <p>No hay registros.</p>
                    </div>
                </div>
            </mat-card-content>
        </mat-card>
    </main>
    </div>
`,
styles: [`
    .reportes-container { 
        width: 100%;
        max-width: 100%;
        background: #fafafa;
        overflow-x: hidden;
    }
    
    .main-content {
        padding: 24px;
        max-width: 100%;
        box-sizing: border-box;
    }
    
    .spacer { 
        flex: 1;
    }
    
    .stats-section {
        display: flex;
        gap: 16px;
        flex-wrap: wrap;
        margin-bottom: 24px;
        justify-content: center;
    }
    
    .stat-card-mini {
        padding: 16px !important;
        min-width: 140px;
        text-align: center;
        background: linear-gradient(135deg, #fff8e1 0%, #fff3e0 100%) !important;
        border-left: 4px solid #FF9800 !important;
    }
    
    .stat-title {
        font-size: 12px;
        color: #666;
        font-weight: 600;
        margin-bottom: 8px;
    }
    
    .stat-value {
        font-size: 24px;
        font-weight: 700;
        color: #FF9800;
    }
    
    .table-card {
        margin-bottom: 24px !important;
        max-width: 100%;
        overflow: hidden;
    }
    
    .table-wrapper {
        width: 100%;
        overflow-x: auto;
        margin-top: 16px;
    }
    
    .data-table {
        width: 100%;
        min-width: 600px;
    }
    
    .loading-state {
        padding: 32px;
        text-align: center;
        color: #666;
    }
    
    .error-message {
        padding: 16px;
        background: #ffebee;
        color: #c62828;
        border-radius: 8px;
        border-left: 4px solid #c62828;
    }
    
    .info-message {
        padding: 12px;
        background: #e3f2fd;
        color: #1565c0;
        border-radius: 8px;
        font-size: 12px;
        margin-bottom: 16px;
    }
    
    .empty-state {
        padding: 48px;
        text-align: center;
        color: #999;
    }
    
    .empty-state mat-icon {
        font-size: 64px;
        width: 64px;
        height: 64px;
        margin-bottom: 16px;
        opacity: 0.5;
    }
    
    @media (max-width: 768px) {
        .main-content {
            padding: 16px;
        }
        
        .stats-section {
            gap: 12px;
        }
        
        .stat-card-mini {
            min-width: 120px;
        }
    }
`]
})
export class ReportesComponent implements OnInit {
    tables: Array<{ key: string; title: string; endpoint: string; data: any[]; columns: string[]; loading: boolean; error?: string }> = [];
    stats: Array<{ key: string; title: string; count: number | string }> = [];

    constructor(private api: ApiService, private snackBar: MatSnackBar, private router: Router) {
    const apiUrl = environment.apiUrl?.replace(/\/$/, '');

    // Define the tables we want to fetch. These keys map to API endpoints.
    this.tables = [
    { key: 'usuarios', title: 'Usuarios', endpoint: environment.endpoints.usuarios || 'api/usuarios', data: [], columns: [], loading: false },
    { key: 'empleados', title: 'Empleados', endpoint: environment.endpoints.empleados || 'api/empleados', data: [], columns: [], loading: false },
    { key: 'transportes', title: 'Transportes', endpoint: environment.endpoints.transportes || 'api/transportes', data: [], columns: [], loading: false },
    { key: 'lineas', title: 'Líneas', endpoint: (environment.endpoints as any).lineas || 'api/lineas', data: [], columns: [], loading: false },
    { key: 'tarjetas', title: 'Tarjetas', endpoint: environment.endpoints.tarjetas || 'api/tarjetas', data: [], columns: [], loading: false },
    { key: 'rutas', title: 'Rutas', endpoint: (environment.endpoints as any).rutas || 'api/rutas', data: [], columns: [], loading: false },
    { key: 'paradas', title: 'Paradas', endpoint: 'api/paradas', data: [], columns: [], loading: false },
    { key: 'asignaciones', title: 'Asignaciones', endpoint: 'api/asignaciones', data: [], columns: [], loading: false }
    ];
}

    ngOnInit(): void {
        this.refreshAll();
        this.loadStats();
    }

    private loadStats() {
        // prepare observables for each table to fetch a lightweight count
        const calls: any = {};
        for (const t of this.tables) {
            // try to GET the endpoint and count results; errors -> 'N/A'
            calls[t.key] = this.api.get<any>(t.endpoint).pipe(
                catchError((err: any) => of({ __error: true }))
            );
        }

        forkJoin(calls).subscribe((results: any) => {
            this.stats = this.tables.map(t => {
                const res = results[t.key];
                if (!res) return { key: t.key, title: t.title, count: 'N/A' };
                if (Array.isArray(res)) return { key: t.key, title: t.title, count: res.length };
                if (res && res.data && Array.isArray(res.data)) return { key: t.key, title: t.title, count: res.data.length };
                // single object or error
                if (res && res.__error) return { key: t.key, title: t.title, count: 'N/A' };
                return { key: t.key, title: t.title, count: 1 };
            });
        }, (e) => {
            console.error('Error loading stats', e);
            this.stats = this.tables.map(t => ({ key: t.key, title: t.title, count: 'N/A' }));
        });
    }

    navigateTo(route: string): void {
        this.router.navigate([route]);
    }

    refreshAll() {
        for (const t of this.tables) {
            this.fetchTable(t);
        }
    }

    public fetchTable(table: any, params?: any) {
        table.loading = true;
        table.error = undefined;
        // call ApiService.get with endpoint (ApiService will prepend base url)
            this.api.get<any>(table.endpoint, params).subscribe({
        next: (resp: any) => {
            // Normalize response into an array so the template can iterate safely.
            let data: any[] = [];
            if (Array.isArray(resp)) {
            data = resp;
            } else if (resp && resp.data && Array.isArray(resp.data)) {
            data = resp.data;
            } else if (resp && typeof resp === 'object') {
            // Single-object responses (e.g. { saldo: 123 }) -> wrap into an array
            data = [resp];
            } else if (resp !== undefined && resp !== null) {
            // Primitive responses -> wrap
            data = [resp];
            }

            table.data = data;
            table.columns = this.inferColumns(table.data);
            table.loading = false;
        },
        error: (err: any) => {
            table.loading = false;
            // Provide a clearer message depending on status if available
            const status = err?.status || (err?.error && err.error.status) || null;
            if (status === 404) {
            table.error = 'No existe un endpoint de listado (GET) para esta entidad en el backend (404).';
            } else if (status === 405) {
            table.error = 'Método GET no permitido en este endpoint (405).';
            } else if (status === 401 || status === 403) {
            table.error = 'Sin autorización para acceder a estos datos. Inicia sesión con permisos adecuados.';
            } else if (err?.error && typeof err.error === 'string') {
            table.error = err.error;
            } else if (err?.message) {
            table.error = err.message;
            } else {
            table.error = 'Error cargando datos';
            }

            console.error('Error fetching', table.endpoint, err);
        }
        });
    }

    private inferColumns(data: any[]): string[] {
        if (!data || data.length === 0) return ['-'];
        const keys = Object.keys(data[0]);
        // limit columns to a reasonable number
        return keys.slice(0, 8);
    }

    formatCell(value: any): string {
        if (value === null || value === undefined) return '';
        // Dates (ISO strings) -> show only YYYY-MM-DD (first 10 chars)
        if (value instanceof Date) return value.toISOString().slice(0, 10);
        if (typeof value === 'string') {
            // Match ISO date prefix
            const m = value.match(/^(\d{4}-\d{2}-\d{2})/);
            if (m) return m[1];
        }

        if (typeof value === 'object') return JSON.stringify(value);
        return String(value);
    }
    }
