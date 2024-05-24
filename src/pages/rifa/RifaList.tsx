import { useEffect, useState } from "react";
import { Rifa } from "../../models/Rifa";
import { RifaService } from "../../services/RifaService";
import Menu from "../../components/Menu";
import { getStatus } from "../../utils";
import { Link, useNavigate } from "react-router-dom";
import { Routes } from "../../routes/CONSTANTS";
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from "@nextui-org/react";

export default function RifaListPage() {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [rifas, setRifas] = useState<Rifa[]>([]);
    const [rifasCreadas, setRifasCreadas] = useState<Rifa[]>([]);
    const navigate = useNavigate();
    const [rifaId, setRifaId] = useState<number>(0);
    const toast = document.querySelector('.toast');

    useEffect(() => {
        getRifas();
        getRifasCreadas();
    }, []);

    const getRifasCreadas = () => {
        RifaService.misRifasCreadas()
            .then(rifas => setRifasCreadas(rifas))
            .catch(error => console.error(error));
    }

    const getRifas = () => {
        RifaService.misRifas()
            .then(rifas => {
                setRifas(rifas);
            })
            .catch(error => console.error(error));
    }

    const openDeleteModal = (id?: number) => {
        if (id === undefined) return;
        setRifaId(id);
        onOpen();
    }

    const deleteRifa = () => {
        RifaService.delete(rifaId)
            .then(() => {
                getRifasCreadas();
                onOpenChange();
                if (!toast) return;
                toast.classList.add('show');
                toast.innerHTML = `<p class='bg-green-600 text-white px-4 py-2 rounded-lg'>Rifa eliminada exitosamente</p>`;
                setTimeout(() => {
                    toast.classList.remove('show');
                }, 4000);
            })
            .catch(error => console.error(error));
    }

    return (
        <div className="w-screen h-screen bg-gradient-to-r from-[#0B3646] to-[#01001F]">
            <Menu />
            <main className="container mx-auto pt-10">
                <header className="flex justify-between">
                    <h1 className="text-2xl font-bold text-white">
                        Mis Rifas
                    </h1>
                    <Link to={Routes.RIFAS.CREATE} className="text-white bg-green-500 px-4 py-2 rounded-lg">
                        Crear
                    </Link>
                </header>
                <section className="flex flex-col mt-4">
                    <h2 className="text-medium font-bold text-white text-left m-0">Rifas Creadas</h2>
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5" >
                        {rifasCreadas.map(rifa => (
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
                                <div className="flex justify-center gap-2 mt-2">
                                    <Button size="sm" isIconOnly className="text-white rounded-full bg-red-500" onClick={() => openDeleteModal(rifa.id)}>
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" className="w-4 h-4 fill-current">
                                            <path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z" />
                                        </svg>
                                    </Button>
                                    {rifa.estado !== 2 && (
                                        <Button size="sm" isIconOnly className="text-white rounded-full bg-green-500" onClick={() => navigate(Routes.RIFAS.EDIT_PARAM(rifa.id))}>
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="w-4 h-4 fill-current">
                                                <path d="M362.7 19.3L314.3 67.7 444.3 197.7l48.4-48.4c25-25 25-65.5 0-90.5L453.3 19.3c-25-25-65.5-25-90.5 0zm-71 71L58.6 323.5c-10.4 10.4-18 23.3-22.2 37.4L1 481.2C-1.5 489.7 .8 498.8 7 505s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L421.7 220.3 291.7 90.3z" />
                                            </svg>
                                        </Button>
                                    )}
                                    <Button size="sm" isIconOnly className="text-white rounded-full bg-blue-500" onClick={() => navigate(Routes.RIFAS.DETAIL_PARAM(rifa.id))}>
                                        {rifa.estado === 0 ? (
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="w-4 h-4 fill-current">
                                                <path d="M142.9 142.9c62.2-62.2 162.7-62.5 225.3-1L327 183c-6.9 6.9-8.9 17.2-5.2 26.2s12.5 14.8 22.2 14.8H463.5c0 0 0 0 0 0H472c13.3 0 24-10.7 24-24V72c0-9.7-5.8-18.5-14.8-22.2s-19.3-1.7-26.2 5.2L413.4 96.6c-87.6-86.5-228.7-86.2-315.8 1C73.2 122 55.6 150.7 44.8 181.4c-5.9 16.7 2.9 34.9 19.5 40.8s34.9-2.9 40.8-19.5c7.7-21.8 20.2-42.3 37.8-59.8zM16 312v7.6 .7V440c0 9.7 5.8 18.5 14.8 22.2s19.3 1.7 26.2-5.2l41.6-41.6c87.6 86.5 228.7 86.2 315.8-1c24.4-24.4 42.1-53.1 52.9-83.7c5.9-16.7-2.9-34.9-19.5-40.8s-34.9 2.9-40.8 19.5c-7.7 21.8-20.2 42.3-37.8 59.8c-62.2 62.2-162.7 62.5-225.3 1L185 329c6.9-6.9 8.9-17.2 5.2-26.2s-12.5-14.8-22.2-14.8H48.4h-.7H40c-13.3 0-24 10.7-24 24z" />
                                            </svg>
                                        ) : (
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="w-6 h-4 fill-current">
                                                <path d="M288 32c-80.8 0-145.5 36.8-192.6 80.6C48.6 156 17.3 208 2.5 243.7c-3.3 7.9-3.3 16.7 0 24.6C17.3 304 48.6 356 95.4 399.4C142.5 443.2 207.2 480 288 480s145.5-36.8 192.6-80.6c46.8-43.5 78.1-95.4 93-131.1c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C433.5 68.8 368.8 32 288 32zM144 256a144 144 0 1 1 288 0 144 144 0 1 1 -288 0zm144-64c0 35.3-28.7 64-64 64c-7.1 0-13.9-1.2-20.3-3.3c-5.5-1.8-11.9 1.6-11.7 7.4c.3 6.9 1.3 13.8 3.2 20.7c13.7 51.2 66.4 81.6 117.6 67.9s81.6-66.4 67.9-117.6c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3z" />
                                            </svg>
                                        )}
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
                <section className="flex flex-col mt-8">
                    <h2 className="text-medium font-bold text-white text-left m-0">Rifas Participadas</h2>
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5" >
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
                                <div className="flex justify-center gap-2 mt-2">
                                    <Button size="sm" isIconOnly className="text-white rounded-full bg-blue-500" onClick={() => navigate(Routes.RIFAS.DETAIL_PARAM(rifa.id))}>
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="w-6 h-4 fill-current">
                                            <path d="M288 32c-80.8 0-145.5 36.8-192.6 80.6C48.6 156 17.3 208 2.5 243.7c-3.3 7.9-3.3 16.7 0 24.6C17.3 304 48.6 356 95.4 399.4C142.5 443.2 207.2 480 288 480s145.5-36.8 192.6-80.6c46.8-43.5 78.1-95.4 93-131.1c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C433.5 68.8 368.8 32 288 32zM144 256a144 144 0 1 1 288 0 144 144 0 1 1 -288 0zm144-64c0 35.3-28.7 64-64 64c-7.1 0-13.9-1.2-20.3-3.3c-5.5-1.8-11.9 1.6-11.7 7.4c.3 6.9 1.3 13.8 3.2 20.7c13.7 51.2 66.4 81.6 117.6 67.9s81.6-66.4 67.9-117.6c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3z" />
                                        </svg>
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </main>
            <Modal isOpen={isOpen} onOpenChange={onOpenChange} className="dark">
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1 text-white">
                                Eliminar Rifa
                            </ModalHeader>
                            <ModalBody>
                                <p className="text-white">
                                    ¿Estás seguro de eliminar esta rifa?
                                </p>
                            </ModalBody>
                            <ModalFooter>
                                <Button color="primary" variant="light" onPress={onClose}>
                                    Cancelar
                                </Button>
                                <Button color="danger" onPress={deleteRifa}>
                                    Eliminar
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
            <div className="toast">

            </div>
        </div>
    )
}