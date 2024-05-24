import { Avatar, Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Link, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Navbar, NavbarContent, NavbarItem, useDisclosure } from "@nextui-org/react";
import { Routes } from "../routes/CONSTANTS";
import UserFormModal from "./UserFormModal";
import {  useState } from "react";
import { AuthService } from "../services/AuthService";
import { User } from "../models/User";

export default function Menu() {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const { isOpen: isOpenModal, onOpenChange: onOpenChangeModal } = useDisclosure();
    const [user, setUser] = useState<User>();
    const routes = [
        {
            name: 'Inicio',
            url: Routes.HOME
        },
        {
            name: 'Mis Rifas',
            url: Routes.RIFAS.LIST
        },
        {
            name: 'Usuarios',
            url: Routes.USER.LIST
        }
    ];

    const logout = () => {
        AuthService.logout()
            .then(() => {
                window.location.href = Routes.AUTH.LOGIN;
            })
            .catch(error => console.error(error));
    }

    const onOpenUserModal = () => {
        AuthService.getUserInfo()
            .then(user => {
                setUser(user);
                onOpenChangeModal();
            })
            .catch(error => console.error(error));
    }

    return (
        <>
        <Navbar>
            <NavbarContent justify="start" className="w-full">
                {routes.map((route) => (
                    <NavbarItem key={route.name} isActive={route.url === window.location.pathname}>
                        <Link color="foreground" href={route.url}>
                            {route.name}
                        </Link>
                    </NavbarItem>
                ))}
            </NavbarContent>
            <NavbarContent justify="end" className="w-full">
                <NavbarItem>
                    <Dropdown placement="bottom-end" className="dark text-white">
                        <DropdownTrigger>
                            <Avatar
                                isBordered
                                as="button"
                                className="transition-transform"
                                content='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512H418.3c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304H178.3z"/></svg>'
                            />
                        </DropdownTrigger>
                        <DropdownMenu aria-label="Profile Actions" variant="flat">
                            <DropdownItem key="profile" onPress={onOpenUserModal}>
                                Perfil
                            </DropdownItem>
                            <DropdownItem key="logout" color="danger" className="text-red-500" onPress={onOpen}>
                                Cerrar sesión
                            </DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                </NavbarItem>
            </NavbarContent>
        </Navbar>
        <Modal isOpen={isOpen} onOpenChange={onOpenChange} className="dark">
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1 text-white">
                                Cerrar sesión
                            </ModalHeader>
                            <ModalBody>
                                <p className="text-white">
                                    ¿Estás seguro de cerrar sesión?
                                </p>
                            </ModalBody>
                            <ModalFooter>
                                <Button color="primary" variant="light" onPress={onClose}>
                                    Cancelar
                                </Button>
                                <Button color="danger" onPress={logout}>
                                    Cerrar sesión
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
            <UserFormModal isOpen={isOpenModal} onOpenChange={onOpenChangeModal} user={user} />
        </>
    )
}