export interface RifaRequest {
    id?: number;
    titulo: string;
    descripcion: string;
    cantidad_tickets: number;
    codigo: string;
    usuarios_participantes_ids?: number[];
}