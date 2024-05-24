import { useParams } from "react-router-dom";
import Menu from "../../components/Menu";
import { useEffect, useState } from "react";
import { RifaService } from "../../services/RifaService";
import { Rifa } from "../../models/Rifa";
import { Button, Chip, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from "@nextui-org/react";
import { User } from "../../models/User";
import { AuthService } from "../../services/AuthService";

export default function RifaDetailPage() {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [rifa, setRifa] = useState<Rifa>();
    const { id } = useParams();
    const [userMe, setUserMe] = useState<User>();
    const [cantidadGanadores, setCantidadGanadores] = useState<number>(0);
    const [sorteoInProgress, setSorteoInProgress] = useState<boolean>(false);
    const [isInputError, setIsInputError] = useState<boolean>(true);
    const [isCreador, setIsCreador] = useState<boolean>(false);
    const [intervalo, setIntervalo] = useState<boolean>(false);

    useEffect(() => {
        if (!id) return;
        AuthService.getUserInfo()
            .then(user => {
                setUserMe(user);
                RifaService.get(Number(id))
                    .then(rifa => {
                        setRifa(rifa);
                        setIsCreador(rifa.usuario_creador === user.id);
                    })
                    .catch(error => console.error(error));
            })
            .catch(error => console.error(error));
    }, [id]);

    const getRifa = () => {
        RifaService.get(Number(id))
            .then(rifa => {
                setRifa(rifa);
            })
            .catch(error => console.error(error));
    }

    if (!isCreador && !intervalo) {
        setIntervalo(true);
        setInterval(() => {
            getRifa();
        }, 5000);
    }

    const sortear = async () => {
        const chips = document.querySelectorAll('.usuario');
        let tiempo = 500;

        const chipsArray = Array.from(chips);
        chipsArray.sort(() => Math.random() - 0.5);


        const animaciones = chipsArray.reduce(async (promesa, chip) => {
            if (chip.classList.contains('bg-blue-500')) return promesa;
            await promesa;
            return await new Promise<void>((resolve) => {
                chip.classList.add('bg-green-500');
                setTimeout(() => {
                    chip.classList.remove('bg-green-500');
                    chip.classList.add('bg-[#FFFFFF1a]');
                    resolve();
                }, tiempo);
                tiempo += 150;
            });
        }, Promise.resolve());

        await animaciones;

        RifaService.obtenerGanador(Number(id))
            .then(() => {
                getRifa();
                setCantidadGanadores(cantidadGanadores - 1);
            })
            .catch(error => console.error(error));
    }

    const leaveRifa = () => {
        RifaService.leave(Number(id))
            .then(() => {
                getRifa();
            })
            .catch(error => console.error(error));
    }

    const joinRifa = () => {
        RifaService.join(Number(id))
            .then(() => {
                getRifa();
            })
            .catch(error => console.error(error));
    }

    const onSortearButtonClick = () => {
        onOpen();
    }

    const onInputCantidadGanadoresChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCantidadGanadores(Number(e.target.value));
        if (rifa?.usuarios_rifa && Number(e.target.value) > rifa.usuarios_rifa.length || Number(e.target.value) <= 0) {
            setIsInputError(true);
        } else {
            setIsInputError(false);
        }
    }

    const onConfirmSorteo = () => {
        if (isInputError) return;
        setSorteoInProgress(true);
        onOpenChange();
    }

    const finalizarSorteo = () => {
        RifaService.finalizarSorteo(Number(id))
            .then(() => {
                getRifa();
            })
            .catch(error => console.error(error));
    }

    return (
        <div className="w-screen h-screen bg-gradient-to-r from-[#0B3646] to-[#01001F]">
            <Menu />
            <main className="container mx-auto pt-10">
                <header className="flex flex-col items-center">
                    <h1 className="text-2xl font-bold text-white">
                        {rifa?.titulo}
                    </h1>
                    <div className="text-sm text-white text-center mt-5">
                        <p className="inline-block mr-1">
                            {rifa?.usuarios_participantes?.length}
                            /
                            {rifa?.cantidad_tickets}
                        </p>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512" className="w-5 h-5 fill-gray-500 inline-block ml-1">
                            <path d="M144 0a80 80 0 1 1 0 160A80 80 0 1 1 144 0zM512 0a80 80 0 1 1 0 160A80 80 0 1 1 512 0zM0 298.7C0 239.8 47.8 192 106.7 192h42.7c15.9 0 31 3.5 44.6 9.7c-1.3 7.2-1.9 14.7-1.9 22.3c0 38.2 16.8 72.5 43.3 96c-.2 0-.4 0-.7 0H21.3C9.6 320 0 310.4 0 298.7zM405.3 320c-.2 0-.4 0-.7 0c26.6-23.5 43.3-57.8 43.3-96c0-7.6-.7-15-1.9-22.3c13.6-6.3 28.7-9.7 44.6-9.7h42.7C592.2 192 640 239.8 640 298.7c0 11.8-9.6 21.3-21.3 21.3H405.3zM224 224a96 96 0 1 1 192 0 96 96 0 1 1 -192 0zM128 485.3C128 411.7 187.7 352 261.3 352H378.7C452.3 352 512 411.7 512 485.3c0 14.7-11.9 26.7-26.7 26.7H154.7c-14.7 0-26.7-11.9-26.7-26.7z" />
                        </svg>
                    </div>
                    <p className="text-sm text-white mt-5">
                        {rifa?.descripcion}
                    </p>
                    {rifa?.estado !== 2 && rifa?.usuario_creador === userMe?.id && !sorteoInProgress && rifa?.usuarios_rifa && rifa?.usuarios_rifa.length > 0 && (
                        <Button className="text-white bg-green-500 px-4 py-2 rounded-lg mt-5" onClick={onSortearButtonClick}>
                            Sortear
                        </Button>
                    )}
                    {sorteoInProgress && rifa?.usuario_creador === userMe?.id && rifa?.usuarios_rifa && cantidadGanadores > 0 && (
                        <>
                            <Button className="text-white bg-blue-500 px-4 py-2 rounded-lg mt-5" onClick={sortear}>
                                Obtener ganador
                            </Button>
                            {cantidadGanadores > 0 && (
                                <p className="text-white text-sm mt-2">
                                    Ganadores restantes: {cantidadGanadores}
                                </p>
                            )}
                        </>
                    )}
                    {cantidadGanadores === 0 && rifa?.estado === 1 && rifa.usuario_creador === userMe?.id && sorteoInProgress && (
                        <Button className="text-white bg-red-500 px-4 py-2 rounded-lg mt-5" onClick={finalizarSorteo}>
                            Finalizar sorteo
                        </Button>
                    )}
                    {rifa?.usuarios_participantes?.find(id => id === userMe?.id) && rifa?.estado === 0 ? (
                        <Button className="text-white bg-red-500 px-4 py-2 rounded-lg mt-5" onClick={leaveRifa}>
                            Abandonar
                        </Button>
                    ) : rifa?.usuario_creador !== userMe?.id && rifa?.estado === 0 && (
                        <Button className="text-white bg-green-500 px-4 py-2 rounded-lg mt-5" onClick={joinRifa}>
                            Participar
                        </Button>
                    )}
                </header>
                <section className="flex flex-wrap mt-16 gap-y-10 gap-x-8">
                    {rifa?.usuarios_rifa?.map(user => (
                        <Chip key={user.id} className={`usuario bg-[#FFFFFF1a] relative p-1 h-9 ${user.es_ganador ? 'bg-blue-500' : ''}`}>
                            <span className="w-fit absolute top-[-14px] right-0 left-0 mx-auto bg-white px-2 rounded-lg text-black">
                                {user.numero_ticket}
                            </span>
                            <span>{user.usuario.usuario.first_name} {user.usuario.usuario.last_name}</span>
                            {rifa?.usuario_creador === userMe?.id && (
                                <span className={`ml-2 text-xs ${user.es_ganador ? 'text-gray-300' : 'text-gray-400'}`}>
                                    {user.usuario.telefono}
                                </span>
                            )}
                        </Chip>
                    ))}
                </section>
            </main>
            <Modal isOpen={isOpen} onOpenChange={onOpenChange} className="dark">
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1 text-white">
                                Sortear
                            </ModalHeader>
                            <ModalBody>
                                <p className="text-white">
                                    Ingrese el número de ganadores:
                                </p>
                                <Input
                                    type="number"
                                    label="Número de ganadores"
                                    className="text-white"
                                    onChange={onInputCantidadGanadoresChange}
                                    value={cantidadGanadores.toString()}
                                    min={1}
                                    max={rifa?.usuarios_rifa?.length}
                                />
                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant="light" onPress={onClose}>
                                    Cancelar
                                </Button>
                                {rifa?.usuarios_rifa && (
                                    <Button color="primary" onPress={onConfirmSorteo} disabled={isInputError}>
                                        Confirmar
                                    </Button>
                                )}
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </div>
    )
}