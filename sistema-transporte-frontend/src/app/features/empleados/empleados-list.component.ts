import { Component, OnInit, ViewChild, TemplateRef, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDividerModule } from '@angular/material/divider';
import { MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIcon } from '@angular/material/icon';
import { MatTableDataSource } from '@angular/material/table';
import { EmpleadoFormComponent } from './empleado-form.component';
import { EmpleadoService } from './services/empleado.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-empleados-list',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatToolbarModule,
    MatDividerModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatDialogModule,
    MatSnackBarModule,
    EmpleadoFormComponent
  ],
  template: `
  <div class="dashboard-container">
    <ng-template #confirmDialog let-data>
      <h2 mat-dialog-title>
        <mat-icon color="warn" style="vertical-align:middle; margin-right:8px">help_outline</mat-icon>
        {{ data?.title || 'Confirmar' }}
      </h2>
      <mat-dialog-content>
        <p>{{ data?.message }}</p>
      </mat-dialog-content>
      <mat-dialog-actions align="end">
        <button mat-button [mat-dialog-close]="false">Cancelar</button>
        <button mat-flat-button color="warn" [mat-dialog-close]="true">Eliminar</button>
      </mat-dialog-actions>
    </ng-template>

    <mat-toolbar color="primary" class="dashboard-header">
      <span class="title">
        <mat-icon class="title-icon">badge</mat-icon>
        Gestión de Empleados
      </span>
      <div class="spacer"></div>
      <button mat-raised-button color="primary" class="btn-volver" (click)="navigateTo('/dashboard')">
        <mat-icon class="me-2">arrow_back</mat-icon>
        Volver al menú
      </button>

      <button mat-icon-button color="accent" (click)="refresh()" title="Refrescar">
        <mat-icon>refresh</mat-icon>
      </button>
    </mat-toolbar>

    <main class="main-content">
      <mat-card>
        <div class="table-actions">
          <h2>Empleados</h2>
          <div style="display:flex; gap:8px; align-items:center;">
            <div class="filter-control" style="width:120px; margin-right:8px">
              <label class="filter-label">Rol</label>
              <select #roleSelect class="filter-select" (change)="selectedRole = ($any($event.target).value === '' ? null : $any($event.target).value); onRoleChange()">
                <option value="">Todos</option>
                <option value="Supervisor">Supervisor</option>
                <option value="Operador">Operador</option>
              </select>
            </div>

            <div class="filter-control" style="width:130px; margin-right:8px">
              <label class="filter-label">Documento</label>
              <input class="filter-input" #docInput placeholder="Doc" />
            </div>

            <button type="button" class="filter-btn" (click)="buscarPorDocumento(docInput.value)">Buscar</button>

            <div class="filter-control" style="width:160px; margin-left:8px; margin-right:8px">
              <label class="filter-label">Email</label>
              <input class="filter-input" #emailInput placeholder="Email" />
            </div>
            <button type="button" class="filter-btn" (click)="buscarPorEmail(emailInput.value)">Buscar</button>

            <button type="button" class="btn-primary" style="margin-left:16px" (click)="crear()">Crear empleado</button>
            <button type="button" class="btn-clear" (click)="clearFilters()">Limpiar</button>
          </div>
        </div>

        <table mat-table [dataSource]="dataSource" matSort class="mat-elevation-z8">
          <ng-container matColumnDef="nombre">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>{{ 'Nombre' | uppercase }}</th>
            <td mat-cell *matCellDef="let element">{{element.nombre}}</td>
          </ng-container>

          <ng-container matColumnDef="apellido">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>{{ 'Apellido' | uppercase }}</th>
            <td mat-cell *matCellDef="let element">{{element.apellido}}</td>
          </ng-container>

          <ng-container matColumnDef="documento">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>{{ 'Documento' | uppercase }}</th>
            <td mat-cell *matCellDef="let element">{{element.documento}}</td>
          </ng-container>

          <ng-container matColumnDef="email">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>{{ 'Email' | uppercase }}</th>
            <td mat-cell *matCellDef="let element">{{element.email}}</td>
          </ng-container>

          <ng-container matColumnDef="rol">
            <th mat-header-cell *matHeaderCellDef>{{ 'Rol' | uppercase }}</th>
            <td mat-cell *matCellDef="let element">{{element.rol}}</td>
          </ng-container>

          <ng-container matColumnDef="acciones">
            <th mat-header-cell *matHeaderCellDef>{{ 'Acciones' | uppercase }}</th>
            <td mat-cell *matCellDef="let element">
              <button mat-icon-button color="primary" (click)="editar(element)"><mat-icon>edit</mat-icon></button>
              <button mat-icon-button color="warn" (click)="eliminar(element)"><mat-icon>delete</mat-icon></button>
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
        </table>
      </mat-card>
    </main>
  </div>
  `,
  styles: [`
    .dashboard-container { min-height: 60vh; background-color: #f5f5f5; }
    .dashboard-header { box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
    .title { display:flex; align-items:center; font-size:1.1rem; }
    .title-icon { margin-right:8px; }
    .spacer { flex:1; }
    mat-card { margin: 16px; padding: 16px; }
    .table-actions { display:flex; justify-content:space-between; margin-bottom: 8px; }
    table { width: 100%; }
    .btn-volver { color: #42a5f5; font-weight: 500; border-radius: 8px; padding: 0.6rem 1.2rem; margin-right: 16px; cursor: pointer; display: flex; align-items: center; transition: all 0.2s ease-in-out; box-shadow: 0 3px 6px rgba(0, 0, 0, 0.15); }
    .btn-volver:hover { background: #a8ccebff; transform: translateY(-2px); box-shadow: 0 4px 10px rgba(0, 0, 0, 0.25); }
    .btn-volver mat-icon { font-size: 20px; }
    .filter-control { display:flex; flex-direction:column;}
    .filter-label { font-size: 0.80rem; color: rgba(0,0,0,0.6); margin-bottom:4px; }
    .filter-input, .filter-select { height: 30px; padding: 6px 8px; border-radius:6px; border:1px solid #d0d0d0; background: #fff; font-size:0.95rem; outline:none; box-sizing:border-box; transition: box-shadow 0.12s ease, border-color 0.12s ease; }
    .filter-input:focus, .filter-select:focus { box-shadow: 0 0 0 3px rgba(66,165,245,0.12); border-color: #42a5f5; }
    .filter-select { -webkit-appearance: none; appearance: none; background-image: linear-gradient(45deg, transparent 50%, #666 50%), linear-gradient(135deg, #666 50%, transparent 50%); background-position: calc(100% - 18px) calc(1em + 2px), calc(100% - 13px) calc(1em + 2px); background-size: 5px 5px, 5px 5px; background-repeat: no-repeat; }
    .filter-btn { background: transparent; border: 1px solid #42a5f5; color: #42a5f5; padding:6px 10px; border-radius:6px; cursor:pointer; font-size:12px; margin-top:18px; }
    .filter-btn:hover { background: #3994d6ff; color: #fff; }
    .btn-primary { background:#42a5f5; color:#fff; border:none; padding:8px 12px; border-radius:6px; cursor:pointer; font-size:12px; margin-top:18px; }
    .btn-primary:hover { filter:brightness(0.95); }
    .btn-clear { background:transparent; border:1px solid #ccc; padding:6px 10px; border-radius:6px; cursor:pointer; font-size:12px; margin-top:18px; }
    .btn-clear:hover { background: #94b5d1ff }
  `]
})
export class EmpleadosListComponent implements OnInit {
  displayedColumns: string[] = ['nombre', 'apellido', 'documento', 'email', 'rol', 'acciones'];
  dataSource = new MatTableDataSource<any>([]);
    selectedRole: string | null = null;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('confirmDialog') confirmDialog!: TemplateRef<any>;
  @ViewChild('docInput') docInputRef!: ElementRef<HTMLInputElement>;
  @ViewChild('emailInput') emailInputRef!: ElementRef<HTMLInputElement>;
  @ViewChild('roleSelect') roleSelect!: ElementRef<HTMLSelectElement>;

  constructor(
    private empleadoService: EmpleadoService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }

  ngOnInit(): void {
    this.loadEmpleados();
  }

  ngAfterViewInit(): void {
    if (this.paginator) this.dataSource.paginator = this.paginator;
    if (this.sort) this.dataSource.sort = this.sort;
  }

  loadEmpleados(): void {
    const filters: any = { page: 1, pageSize: 100 };
    if (this.selectedRole) filters.rol = (typeof this.selectedRole === 'string') ? this.selectedRole.trim() : this.selectedRole;
    this.empleadoService.getEmpleados(filters).subscribe({
      next: (resp: any) => {
        let list: any[] = [];
        if (Array.isArray(resp)) list = resp;
        else if (resp && resp.data) list = resp.data;
        else if (resp) list = resp;

        this.dataSource.data = list;
      },
      error: (err: any) => {
        console.error('Error cargando empleados', err);
        this.snackBar.open('Error cargando empleados', 'Cerrar', { duration: 3000 });
      }
    });
  }

  refresh(): void { this.loadEmpleados(); }

  crear(): void {
    const ref = this.dialog.open(EmpleadoFormComponent, { width: '480px' });
    ref.afterClosed().subscribe((res: any) => { if (res) this.loadEmpleados(); });
  }

  editar(empleado: any): void {
    const ref = this.dialog.open(EmpleadoFormComponent, { width: '480px', data: { empleado } });
    ref.afterClosed().subscribe((res) => { if (res) this.loadEmpleados(); });
  }

  eliminar(empleado: any): void {
    const dialogRef = this.dialog.open(this.confirmDialog, {
      width: '420px',
      data: { title: 'Eliminar empleado', message: `¿Eliminar empleado ${empleado.nombre} ${empleado.apellido}?` }
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (!confirmed) return;
      const id = empleado.id_empleado || empleado.id;
      this.empleadoService.eliminarEmpleado(id).subscribe({
        next: () => { this.snackBar.open('Empleado eliminado', 'Cerrar', { duration: 2000 }); this.loadEmpleados(); },
        error: (err: any) => { console.error(err); this.snackBar.open('Error al eliminar empleado', 'Cerrar', { duration: 3000 }); }
      });
    });
  }

  buscarPorDocumento(documento: string): void {
    const doc = documento ? documento.trim() : '';
    if (!doc) return this.loadEmpleados();
    this.empleadoService.getEmpleadoByDocumento(doc).subscribe({
      next: (u: any) => { this.dataSource.data = [u]; },
      error: (err: any) => { this.snackBar.open('Empleado no encontrado', 'Cerrar', { duration: 2000 }); }
    });
  }

  buscarPorEmail(email: string): void {
    const em = email ? email.trim() : '';
    if (!em) return this.loadEmpleados();
    this.empleadoService.getEmpleadoByEmail(em).subscribe({
      next: (u: any) => { this.dataSource.data = [u]; },
      error: (err: any) => { this.snackBar.open('Empleado no encontrado', 'Cerrar', { duration: 2000 }); }
    });
  }

  clearFilters(): void {
    try { if (this.roleSelect && this.roleSelect.nativeElement) this.roleSelect.nativeElement.value = ''; } catch {}
    try { this.docInputRef.nativeElement.value = ''; } catch {};
    try { this.emailInputRef.nativeElement.value = ''; } catch {};
    this.selectedRole = null;
    this.loadEmpleados();
  }

  onRoleChange(): void { this.loadEmpleados(); }
}
