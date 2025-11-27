import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EmpleadoService } from './services/empleado.service';

@Component({
  selector: 'app-empleado-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatSnackBarModule
  ],
  template: `
    <mat-card>
      <h2 id="title-form">{{ isEdit ? 'Editar empleado' : 'Crear empleado' }}</h2>
      <form [formGroup]="form" class="user-form">
        <mat-form-field appearance="outline" style="width:100%">
          <mat-label>Nombre</mat-label>
          <input matInput formControlName="nombre" />
        </mat-form-field>

        <mat-form-field appearance="outline" style="width:100%">
          <mat-label>Apellido</mat-label>
          <input matInput formControlName="apellido" />
        </mat-form-field>

        <mat-form-field appearance="outline" style="width:100%">
          <mat-label>Email</mat-label>
          <input matInput formControlName="email" />
        </mat-form-field>

        <mat-form-field appearance="outline" style="width:100%">
          <mat-label>Documento</mat-label>
          <input matInput formControlName="documento" />
        </mat-form-field>

        <mat-form-field appearance="outline" style="width:100%">
          <mat-label>Rol</mat-label>
          <mat-select formControlName="rol">
            <mat-option value="Supervisor">Supervisor</mat-option>
            <mat-option value="Operador">Operador</mat-option>
          </mat-select>
        </mat-form-field>

        <div style="display:flex; gap:8px; justify-content:flex-end; margin-top:12px">
          <button mat-stroked-button color="warn" type="button" (click)="cancel()">Cancelar</button>
          <button mat-flat-button color="primary" type="button" (click)="save()" [disabled]="form.invalid">Guardar</button>
        </div>
      </form>
    </mat-card>
  `,
  styles: [`
    .user-form{padding: 16px;}
    #title-form {padding: 8px; padding-left: 18px;}
  `]
})
export class EmpleadoFormComponent {
  form: FormGroup;
  isEdit = false;

  constructor(
    public dialogRef: MatDialogRef<EmpleadoFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private empleadoService: EmpleadoService,
    private snackBar: MatSnackBar
  ) {
    const e: any = data && data.empleado ? data.empleado : null;
    this.isEdit = !!e;

    this.form = this.fb.group({
      nombre: [e?.nombre ?? '', Validators.required],
      apellido: [e?.apellido ?? '', Validators.required],
      email: [e?.email ?? '', [Validators.required, Validators.email]],
      documento: [e?.documento ?? '', Validators.required],
      rol: [e?.rol ?? null, Validators.required]
    });
    if (this.isEdit) {
      this.form.get('documento')?.disable();
    }
  }

  save() {
    if (this.form.invalid) return;
    const val = this.form.value;

    if (this.isEdit && this.data && this.data.empleado) {
      const id = this.data.empleado.id_empleado || this.data.empleado.id;
      // If documento control is disabled it will be omitted from form.value; use original documento in that case
      const documentoVal = this.data.empleado?.documento ?? val.documento;
      const payload: any = {
        nombre: val.nombre,
        apellido: val.apellido,
        email: val.email,
        documento: documentoVal,
        rol: val.rol
      };
      this.empleadoService.actualizarEmpleado(id, payload).subscribe({
        next: () => {
          this.snackBar.open('Empleado actualizado', 'Cerrar', { duration: 2000 });
          this.dialogRef.close(true);
        },
        error: (err) => {
          console.error(err);
          this.snackBar.open('Error al actualizar empleado', 'Cerrar', { duration: 3000 });
        }
      });
    } else {
      const payload: any = {
        nombre: val.nombre,
        apellido: val.apellido,
        email: val.email,
        documento: val.documento,
        rol: val.rol
      };
      this.empleadoService.crearEmpleado(payload).subscribe({
        next: () => {
          this.snackBar.open('Empleado creado', 'Cerrar', { duration: 2000 });
          this.dialogRef.close(true);
        },
        error: (err) => {
          console.error(err);
          this.snackBar.open('Error al crear empleado', 'Cerrar', { duration: 3000 });
        }
      });
    }
  }

  cancel() {
    this.dialogRef.close(false);
  }
}
