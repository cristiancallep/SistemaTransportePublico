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

@Component({
    selector: 'app-reportes',
    standalone: true,
    imports: [CommonModule, MatCardModule, MatIconModule, MatToolbarModule, MatButtonModule, MatSnackBarModule],
template: `
    <div class="reportes-container">
    <mat-toolbar color="primary">
        <mat-icon>assessment</mat-icon>
        <span style="margin-left:8px">Reportes — Datos de tablas</span>
        <div class="spacer"></div>
        <button mat-raised-button color="primary" class="btn-volver" (click)="navigateTo('/dashboard')">
        <mat-icon class="me-2">arrow_back</mat-icon>
        Volver al menú
        </button>
        <button mat-icon-button (click)="refreshAll()" title="Refrescar todo" style="margin-left:8px"><mat-icon>refresh</mat-icon></button>
    </mat-toolbar>

    <main style="padding:16px">
                <section style="display:flex; gap:12px; flex-wrap:wrap; margin-bottom:12px; justify-content:center">
                    <mat-card *ngFor="let s of stats" style="padding:10px; min-width:140px; text-align:center; background:#fff8e1">
                        <div style="font-size:12px; color:#666">{{ s.title | uppercase }}</div>
                        <div style="font-size:20px; font-weight:600; padding:5px 0">{{ s.count }}</div>
                    </mat-card>
                </section>
        <mat-card *ngFor="let table of tables" style="margin-bottom:12px; padding:12px">
            <h3>{{ table.title }}</h3>
            
            <div *ngIf="table.loading">Cargando...</div>
            <div *ngIf="!table.loading && table.error" style="color:crimson">{{ table.error }}</div>
            <div *ngIf="!table.loading && !table.error">
              <div *ngIf="table.data.length > 0 && table.data.length === 1" style="font-size:12px; color:#666; margin-bottom:6px">Respuesta única (se muestra envuelta como arreglo).</div>
              <table *ngIf="table.data.length > 0" style="width:100%; border-collapse: collapse;">
                <thead>
                <tr>
                    <th *ngFor="let col of table.columns" style="text-align:left; padding:6px; border-bottom:1px solid #ddd">{{ col | uppercase }}</th>
                </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let row of table.data">
                    <td *ngFor="let col of table.columns" style="padding:6px; border-bottom:1px solid #f0f0f0">{{ formatCell(row[col]) }}</td>
                </tr>
                </tbody>
            </table>
              <div *ngIf="table.data.length === 0" style="margin-top:8px; color:#666">No hay registros.</div>
            </div>
        </mat-card>
    </main>
    </div>
`,
styles: [`
    .reportes-container { min-height: 60vh; background:#fafafa }
    .spacer { flex:1 }
    mat-card h3 { margin: 0 0 8px 0 }
    .btn-volver { color: #42a5f5; font-weight: 500; border-radius: 8px; padding: 0.4rem 0.8rem; margin-right: 8px; }
    .btn-volver:hover { background: #a8ccebff; transform: translateY(-1px); }
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
