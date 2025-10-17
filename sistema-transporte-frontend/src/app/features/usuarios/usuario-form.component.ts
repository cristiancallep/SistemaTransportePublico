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
import { UsuarioService } from './services/usuario.service';

@Component({
  selector: 'app-usuario-form',
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
        <h2 id="title-form">{{ isEdit ? 'Editar usuario' : 'Crear usuario' }}</h2>
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
            <mat-select formControlName="id_rol">
                <mat-option [value]="1">Admin</mat-option>
                <mat-option [value]="2">Cliente</mat-option>
            </mat-select>
        </mat-form-field>

        <mat-form-field *ngIf="!isEdit" appearance="outline" style="width:100%">
            <mat-label>Contraseña</mat-label>
            <input matInput type="password" formControlName="contrasena" />
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
        #fields-form:hover { background-color: #cbd6ffff; }
    `]
})
export class UsuarioFormComponent {
    form: FormGroup;
    isEdit = false;

constructor(
    public dialogRef: MatDialogRef<UsuarioFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private snackBar: MatSnackBar
) {
    const u: any = data && data.usuario ? data.usuario : null;
    this.isEdit = !!u;

    this.form = this.fb.group({
        nombre: [u?.nombre ?? '', Validators.required],
        apellido: [u?.apellido ?? '', Validators.required],
        email: [u?.email ?? '', [Validators.required, Validators.email]],
        documento: [u?.documento ?? '', Validators.required],
        id_rol: [u?.id_rol ?? null, Validators.required],
        contrasena: ['']
    });

    if (this.isEdit) {
        this.form.get('contrasena')?.clearValidators();
        this.form.get('contrasena')?.updateValueAndValidity();
    } else {
        this.form.get('contrasena')?.setValidators([Validators.required, Validators.minLength(6)]);
        this.form.get('contrasena')?.updateValueAndValidity();
        }
    }

save() {
    if (this.form.invalid) return;
    const val = this.form.value;

    if (this.isEdit && this.data && this.data.usuario) {
        const id = this.data.usuario.id_usuario || this.data.usuario.id;
        const payload: any = {
            nombre: val.nombre,
            apellido: val.apellido,
            email: val.email,
            documento: val.documento,
            id_rol: val.id_rol
        };
    this.usuarioService.actualizarUsuario(id, payload).subscribe({
        next: () => {
            this.snackBar.open('Usuario actualizado', 'Cerrar', { duration: 2000 });
            this.dialogRef.close(true);
        },
        error: (err) => {
            console.error(err);
            this.snackBar.open('Error al actualizar usuario', 'Cerrar', { duration: 3000 });
        }
    });
    } else {
    const payload: any = {
        nombre: val.nombre,
        apellido: val.apellido,
        email: val.email,
        documento: val.documento,
        contrasena: val.contrasena,
        id_rol: val.id_rol
        };
        this.usuarioService.crearUsuario(payload).subscribe({
        next: () => {
            this.snackBar.open('Usuario creado', 'Cerrar', { duration: 2000 });
            this.dialogRef.close(true);
        },
        error: (err) => {
            console.error(err);
            this.snackBar.open('Error al crear usuario', 'Cerrar', { duration: 3000 });
        }
    });
    }
}

cancel() {
    this.dialogRef.close(false);
}
}