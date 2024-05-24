import { Chip } from "@nextui-org/react";

export const getStatus = (status: number) => {
    switch (status) {
        case 0:
            return (
                <Chip className="bg-gray-500 text-white">
                    Pendiente
                </Chip>
            )
        case 1:
            return (
                <Chip color="success">
                    En curso
                </Chip>
            )
        case 2:
            return (
                <Chip className="bg-red-500 text-white">
                    Finalizado
                </Chip>
            )
        default:
            return (
                <Chip className="bg-gray-500 text-white">
                    Desconocido
                </Chip>
            )
    }
}