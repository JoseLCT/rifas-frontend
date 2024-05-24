export const Routes = {
    HOME: '/',
    RIFAS: {
        LIST: '/rifas',
        CREATE: '/rifa/create',
        EDIT: '/rifas/:id',
        EDIT_PARAM: (id?: number) => `/rifas/${id}`,
        DETAIL: '/rifas/detail/:id',
        DETAIL_PARAM: (id?: number) => `/rifas/detail/${id}`,
    },
    USER: {
        LIST: '/users',
        PROFILE: '/profile',
    },
    AUTH:{
        LOGIN: '/login',
        REGISTER: '/register',
    }
}