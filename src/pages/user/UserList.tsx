import { useEffect, useState } from "react";
import Menu from "../../components/Menu";
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, Tooltip, useDisclosure } from "@nextui-org/react";
import { User } from "../../models/User";
import { UserService } from "../../services/UserService";
import UserFormModal from "../../components/UserFormModal";

export default function UserListPage() {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const { isOpen: isOpenModal, onOpen: onOpenModal, onOpenChange: onOpenChangeModal } = useDisclosure();
    const [usuarios, setUsuarios] = useState<User[]>([]);

    const [usuarioDelete, setUsuarioDelete] = useState<User | null>(null);
    const [userEdit, setUserEdit] = useState<User>();

    const toast = document.querySelector('.toast');

    useEffect(() => {
        getUsuarios();
    }, []);

    const getUsuarios = () => {
        UserService.list()
            .then(usuarios => setUsuarios(usuarios))
            .catch(error => console.error(error));
    }

    const openDeleteModal = (id?: number) => {
        if (id === undefined) return;
        setUsuarioDelete(usuarios.find(usuario => usuario.id === id) || null);
        onOpen();
    }

    const deleteUser = () => {
        UserService.delete(usuarioDelete!.id!)
            .then(() => {
                getUsuarios();
                onOpenChange();
                if (!toast) return;
                toast.classList.add('show');
                toast.innerHTML = `<p class='bg-green-600 text-white px-4 py-2 rounded-lg'>Usuario eliminado correctamente</p>`;
                setTimeout(() => {
                    toast.classList.remove('show');
                }, 4000);
            })
            .catch(error => console.error(error));
    }

    const openEditModal = (id?: number) => {
        if (id === undefined) return;
        setUserEdit(usuarios.find(usuario => usuario.id === id));
        onOpenModal();
    }

    const onOpenCreate = () => {
        setUserEdit(undefined);
        onOpenModal();
    }

    return (
        <div className="w-screen h-screen bg-gradient-to-r from-[#0B3646] to-[#01001F]">
            <Menu />
            <main className="container mx-auto pt-10">
                <header className="flex justify-between">
                    <h1 className="text-2xl font-bold text-white">
                        Lista de Usuarios
                    </h1>
                    <Button
                        color="primary"
                        className="text-white bg-green-500 px-4 py-2 rounded-lg"
                        onClick={onOpenCreate}
                    >
                        Crear
                    </Button>
                </header>
                <Table className="mt-4 text-white">
                    <TableHeader>
                        <TableColumn>ID</TableColumn>
                        <TableColumn>Nombre completo</TableColumn>
                        <TableColumn>Teléfono</TableColumn>
                        <TableColumn>Correo</TableColumn>
                        <TableColumn>Acciones</TableColumn>
                    </TableHeader>
                    <TableBody>
                        {usuarios.map((item) => (
                            <TableRow key={item.id}>
                                <TableCell>{item.id}</TableCell>
                                <TableCell>
                                    {item.usuario.first_name} {item.usuario.last_name}
                                </TableCell>
                                <TableCell>{item.telefono}</TableCell>
                                <TableCell>{item.usuario.username}</TableCell>
                                <TableCell className="flex gap-2">
                                    <Tooltip content="Editar">
                                        <Button color="success" onClick={() => openEditModal(item.id)} isIconOnly>
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="w-4 h-4 fill-white">
                                                <path d="M362.7 19.3L314.3 67.7 444.3 197.7l48.4-48.4c25-25 25-65.5 0-90.5L453.3 19.3c-25-25-65.5-25-90.5 0zm-71 71L58.6 323.5c-10.4 10.4-18 23.3-22.2 37.4L1 481.2C-1.5 489.7 .8 498.8 7 505s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L421.7 220.3 291.7 90.3z" />
                                            </svg>
                                        </Button>
                                    </Tooltip>
                                    <Tooltip content="Eliminar">
                                        <Button color="warning" onClick={() => openDeleteModal(item.id)} isIconOnly>
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" className="w-4 h-4 fill-white">
                                                <path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z" />
                                            </svg>
                                        </Button>
                                    </Tooltip>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </main>
            <Modal isOpen={isOpen} onOpenChange={onOpenChange} className="dark">
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1 text-white">
                                Eliminar Usuario
                            </ModalHeader>
                            <ModalBody>
                                <p className="text-white">
                                    ¿Estás seguro de eliminar este usuario?
                                </p>
                            </ModalBody>
                            <ModalFooter>
                                <Button color="primary" variant="light" onPress={onClose}>
                                    Cancelar
                                </Button>
                                <Button color="danger" onPress={deleteUser}>
                                    Eliminar
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
            <UserFormModal isOpen={isOpenModal} onOpenChange={onOpenChangeModal} onRegister={getUsuarios} user={userEdit} />
            <div className="toast">

            </div>
        </div>
    )
}