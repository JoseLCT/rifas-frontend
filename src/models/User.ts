export interface User {
    id?: number;
    usuario: UserDjango;
    telefono: string;
}

export interface UserDjango {
    id: number;
    username: string;
    first_name: string;
    last_name: string;
}
