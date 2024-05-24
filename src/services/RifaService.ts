import { Rifa } from "../models/Rifa";
import { RifaRequest } from "../models/requests/RifaRequest";
import api from "./interceptors";

export const RifaService = {
    create: (rifa: RifaRequest) => {
        return new Promise<Rifa>((resolve, reject) => {
            api.post('rifas/', rifa, {
                withCredentials: true,
            })
                .then(response => resolve(response.data))
                .catch(error => reject(error))
        });
    },
    update: (rifa: RifaRequest, id: number) => {
        console.log("rifa", rifa);
        return new Promise<Rifa>((resolve, reject) => {
            api.put(`rifas/${id}/`, rifa, {
                withCredentials: true,
            })
                .then(response => resolve(response.data))
                .catch(error => reject(error))
        });
    },
    list: () => {
        return new Promise<Rifa[]>((resolve, reject) => {
            api.get('rifas/disponibles/')
                .then(response => resolve(response.data))
                .catch(error => reject(error))
        });
    },
    get: (id: number) => {
        return new Promise<Rifa>((resolve, reject) => {
            api.get(`rifas/${id}/`)
                .then(response => resolve(response.data))
                .catch(error => reject(error))
        });
    },
    delete: (id: number) => {
        return new Promise((resolve, reject) => {
            api.delete(`rifas/${id}/`)
                .then(response => resolve(response.data))
                .catch(error => reject(error))
        });
    },
    misRifasCreadas: () => {
        return new Promise<Rifa[]>((resolve, reject) => {
            api.get('rifas/mis-rifas-creadas/')
                .then(response => resolve(response.data))
                .catch(error => reject(error))
        });
    },
    misRifas: () => {
        return new Promise<Rifa[]>((resolve, reject) => {
            api.get('rifas/mis-rifas/')
                .then(response => resolve(response.data))
                .catch(error => reject(error))
        });
    },
    join: (id: number) => {
        return new Promise((resolve, reject) => {
            api.post(`rifas/participar/`, {
                rifa_id: id
            }, {
                withCredentials: true,
            })
                .then(response => resolve(response.data))
                .catch(error => reject(error))
        });
    },
    leave: (id: number) => {
        return new Promise((resolve, reject) => {
            api.delete(`rifas/abandonar/`, {
                data: { rifa_id: id },
                withCredentials: true,
            })
                .then(response => resolve(response.data))
                .catch(error => reject(error))
        });
    },
    obtenerGanador: (id: number) => {
        return new Promise((resolve, reject) => {
            api.get(`rifas/obtener-ganador/`, {
                params: { id },
                withCredentials: true,
            })
                .then(response => resolve(response.data))
                .catch(error => reject(error))
        });
    },
    generateCode: () => {
        return new Promise<string>((resolve, reject) => {
            api.get('rifas/generar-codigo/', {
                withCredentials: true,
            })
                .then(response => resolve(response.data))
                .catch(error => reject(error))
        });
    },
    finalizarSorteo: (id: number) => {
        return new Promise((resolve, reject) => {
            api.post(`rifas/finalizar-sorteo/`, {
                rifa_id: id
            }, {
                withCredentials: true,
            })
                .then(response => resolve(response.data))
                .catch(error => reject(error))
        });
    }
}