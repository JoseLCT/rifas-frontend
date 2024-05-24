import { UsuarioRifa } from "./UsuarioRifa";

export interface Rifa {
    id?: number;
    titulo: string;
    descripcion: string;
    estado?: number;
    cantidad_tickets: number;
    codigo: string;
    usuario_creador?: number;
    usuarios_participantes?: number[];
    usuarios_rifa?: UsuarioRifa[];
}