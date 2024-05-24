import { User } from "./User";

export interface UsuarioRifa {
    id?: number;
    es_ganador: boolean;
    numero_ticket: string;
    rifa: number;
    usuario: User;
}