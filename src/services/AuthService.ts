import axios from "axios";
import { LoginRequest } from "../models/requests/LoginRequest";
import { AuthResponse } from "../models/responses/AuthResponse";
import { BASE_URL } from "./CONSTANTS";
import api from "./interceptors";
import { User } from "../models/User";

export const AuthService = {
    login: (loginRequest: LoginRequest) => {
        return new Promise<AuthResponse>((resolve, reject) => {
            axios.post(`${BASE_URL}/auth/login`, loginRequest, {
                withCredentials: true,
            })
                .then(response => resolve(response.data))
                .catch(error => reject(error))
        });
    },
    logout: () => {
        return new Promise<void>((resolve, reject) => {
            axios.post(`${BASE_URL}/auth/logout`, {}, {
                withCredentials: true,
            })
                .then(response => resolve(response.data))
                .catch(error => reject(error))
        });
    },
    getUserInfo: () => {
        return new Promise<User>((resolve, reject) => {
            api.get('usuarios/me/',{
                withCredentials: true,
            })
            .then(response => resolve(response.data))
            .catch(error => reject(error))
        });
    }
}
