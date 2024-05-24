import api from "./interceptors";
import { User } from "../models/User";
import { UserRequest } from "../models/requests/UserRequest";

export const UserService = {
    create: (user: UserRequest) => {
        return new Promise<User>((resolve, reject) => {
            api.post('usuarios/', user)
                .then(response => resolve(response.data))
                .catch(error => reject(error))
        });
    },
    list: () => {
        return new Promise<User[]>((resolve, reject) => {
            api.get('usuarios/', {
                withCredentials: true,
            })
                .then(response => resolve(response.data))
                .catch(error => reject(error))
        });
    },
    update: (user: UserRequest, id: number) => {
        return new Promise<User>((resolve, reject) => {
            api.put(`usuarios/${id}/`, user)
                .then(response => resolve(response.data))
                .catch(error => reject(error))
        });
    },
    delete: (id: number) => {
        return new Promise((resolve, reject) => {
            api.delete(`usuarios/${id}/`)
                .then(response => resolve(response.data))
                .catch(error => reject(error))
        });
    },
}