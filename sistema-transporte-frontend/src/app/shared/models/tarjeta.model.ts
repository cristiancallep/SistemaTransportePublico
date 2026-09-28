export interface Tarjeta {
  id: number;
  numero: string;
  saldo: number;
  estado: 'activa' | 'bloqueada' | 'vencida';
  fechaUltimaRecarga: Date;
  fechaVencimiento?: Date;
  usuarioId: number;
  usuario?: Usuario;
}

export interface TarjetaCreate {
  documento: string;
  tipo_tarjeta: 'Estudiante' | 'Normal' | 'Frecuente';
  estado: 'Activa' | 'Inactiva';
  saldo: number;
}

export interface TarjetaUpdate {
  saldo?: number;
  estado?: 'activa' | 'bloqueada' | 'vencida';
  fechaVencimiento?: Date;
}

export interface RecargaTarjeta {
  monto: number;
  metodoPago: 'efectivo' | 'transferencia' | 'tarjeta_credito';
  referencia?: string;
}

export interface TransaccionTarjeta {
  id: number;
  tarjetaId: number;
  tipo: 'recarga' | 'pago' | 'bloqueo' | 'desbloqueo';
  monto: number;
  saldoAnterior: number;
  saldoNuevo: number;
  fecha: Date;
  descripcion?: string;
  transporteId?: number;
}

import { Usuario } from './usuario.model';