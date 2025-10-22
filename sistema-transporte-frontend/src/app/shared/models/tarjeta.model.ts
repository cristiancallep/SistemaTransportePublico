export interface Tarjeta {
  id: number;
  numero: string;
  saldo: number;
  estado: 'activa' | 'bloqueada' | 'vencida';
  fechaCreacion: Date;
  fechaVencimiento?: Date;
  usuarioId: number;
  usuario?: Usuario;
}

export interface TarjetaCreate {
  numero: string;
  saldoInicial?: number;
  usuarioId: number;
  fechaVencimiento?: Date;
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