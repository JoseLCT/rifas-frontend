import { useEffect, useState } from "react";
import Menu from "../components/Menu";
import { RifaService } from "../services/RifaService";
import { Rifa } from "../models/Rifa";
import { getStatus } from "../utils";
import { Link } from "react-router-dom";
import { Routes } from "../routes/CONSTANTS";

export default function HomePage() {
    const [rifas, setRifas] = useState<Rifa[]>([]);

    useEffect(() => {
        RifaService.list()
            .then(rifas => setRifas(rifas))
            .catch(error => console.error(error));
    }, []);

    return (
        <div className="w-screen h-screen bg-gradient-to-r from-[#0B3646] to-[#01001F]">
            <Menu />
            <main className="container mx-auto pt-10">
                <header className="flex justify-between">
                    <h1 className="text-2xl font-bold text-white">
                        Rifas
                    </h1>
                </header>
                <section className="grid grid-cols-1 gap-5 mt-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                    {rifas.map(rifa => (
                        <div key={rifa.id} className="bg-[#FFFFFF1a] p-4 mt-4 rounded-lg">
                            <h2 className="text-xl font-bold text-white text-center">
                                {rifa.titulo}
                            </h2>
                            <div className="text-sm text-white text-center mt-2">
                                <p className="inline-block mr-1">
                                    {rifa.usuarios_participantes?.length}
                                    /
                                    {rifa.cantidad_tickets}
                                </p>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512" className="w-5 h-5 fill-gray-500 inline-block ml-1">
                                    <path d="M144 0a80 80 0 1 1 0 160A80 80 0 1 1 144 0zM512 0a80 80 0 1 1 0 160A80 80 0 1 1 512 0zM0 298.7C0 239.8 47.8 192 106.7 192h42.7c15.9 0 31 3.5 44.6 9.7c-1.3 7.2-1.9 14.7-1.9 22.3c0 38.2 16.8 72.5 43.3 96c-.2 0-.4 0-.7 0H21.3C9.6 320 0 310.4 0 298.7zM405.3 320c-.2 0-.4 0-.7 0c26.6-23.5 43.3-57.8 43.3-96c0-7.6-.7-15-1.9-22.3c13.6-6.3 28.7-9.7 44.6-9.7h42.7C592.2 192 640 239.8 640 298.7c0 11.8-9.6 21.3-21.3 21.3H405.3zM224 224a96 96 0 1 1 192 0 96 96 0 1 1 -192 0zM128 485.3C128 411.7 187.7 352 261.3 352H378.7C452.3 352 512 411.7 512 485.3c0 14.7-11.9 26.7-26.7 26.7H154.7c-14.7 0-26.7-11.9-26.7-26.7z" />
                                </svg>
                            </div>
                            <div className="text-center mt-2">
                                {getStatus(rifa.estado ?? -1)}
                            </div>
                            <p className="text-sm text-white mt-2">
                                {rifa.descripcion}
                            </p>
                            <Link to={Routes.RIFAS.DETAIL_PARAM(rifa.id)} className="bg-green-500 text-white block px-4 py-2 mt-2 rounded-lg text-center">
                                Ver
                            </Link>
                        </div>
                    ))}
                </section>
            </main>
        </div>
    )
}