import { Button, Modal, ModalBody, ModalContent, ModalHeader } from "@nextui-org/react";
import { FormEvent, useEffect, useState } from "react";
import { UserService } from "../services/UserService";
import { User } from "../models/User";

export default function UserFormModal({ onRegister, user, isOpen, onOpenChange }: { onRegister?: () => void, user?: User, isOpen: boolean, onOpenChange: () => void }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [lastName, setLastName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const toast = document.querySelector('.toast');

    useEffect(() => {
        if (user && isOpen) {
            setEmail(user.usuario.username);
            setName(user.usuario.first_name);
            setLastName(user.usuario.last_name);
            setPhoneNumber(user.telefono);
        }
        if (!isOpen) {
            setEmail('');
            setPassword('');
            setName('');
            setLastName('');
            setPhoneNumber('');
        }
    }, [user, isOpen]);

    const validateData = () => {
        let isValid = true;
        const nameSpan = document.querySelector('#name + span');
        const lastNameSpan = document.querySelector('#lastName + span');
        const phoneNumberSpan = document.querySelector('#phoneNumber + span');
        const emailSpan = document.querySelector('#email + span');
        const passwordSpan = document.querySelector('#password + span');

        if (name === '') {
            if (nameSpan) {
                nameSpan.textContent = 'El nombre es requerido';
            }
            isValid = false;
        } else if (nameSpan) {
            nameSpan.textContent = '';
        }

        if (lastName === '') {
            if (lastNameSpan) {
                lastNameSpan.textContent = 'El apellido es requerido';
            }
            isValid = false;
        } else if (lastNameSpan) {
            lastNameSpan.textContent = '';
        }

        if (phoneNumber === '') {
            if (phoneNumberSpan) {
                phoneNumberSpan.textContent = 'El teléfono es requerido';
            }
            isValid = false;
        } else if (phoneNumberSpan) {
            phoneNumberSpan.textContent = '';
        }

        if (email === '') {
            if (emailSpan) {
                emailSpan.textContent = 'El correo es requerido';
            }
            isValid = false;
        } else if (emailSpan) {
            emailSpan.textContent = '';
        }

        if (password === '' && user === undefined) {
            if (passwordSpan) {
                passwordSpan.textContent = 'La contraseña es requerida';
            }
            isValid = false;
        } else if (passwordSpan) {
            passwordSpan.textContent = '';
        }

        return isValid;
    }

    const onFormSubmit = (e: FormEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (!validateData()) {
            return;
        }
        if (user === undefined) {
            createUser();
        } else {
            updateUser();
        }
    }

    const createUser = () => {
        UserService.create({
            first_name: name,
            last_name: lastName,
            username: email,
            password: password,
            telefono: phoneNumber
        }).then(user => {
            console.log(user);
            if (!toast) return;
            toast.classList.add('show');
            toast.innerHTML = `
                <p class='bg-green-600 text-white px-4 py-2 rounded-lg'>Cuenta creada exitosamente</p>
            `;
            setTimeout(() => {
                toast.classList.remove('show');
            }, 5000);
            onOpenChange();
            if (onRegister) {
                onRegister();
            }
        }).catch(error => {
            console.error(error);
        });
    }

    const updateUser = () => {
        if (!user?.id) return;
        UserService.update({
            first_name: name,
            last_name: lastName,
            username: email,
            telefono: phoneNumber
        }, user!.id!).then(user => {
            console.log(user);
            if (!toast) return;
            toast.classList.add('show');
            toast.innerHTML = `
                <p class='bg-green-600 text-white px-4 py-2 rounded-lg'>Cuenta actualizada exitosamente</p>
            `;
            setTimeout(() => {
                toast.classList.remove('show');
            }, 5000);
            onOpenChange();
            if (onRegister) {
                onRegister();
            }
        }).catch(error => {
            console.error(error);
        });
    }

    return (
        <Modal isOpen={isOpen} onOpenChange={onOpenChange} className="dark">
            <ModalContent>
                {() => (
                    <>
                        <ModalHeader className="flex flex-col gap-1">
                            <h2 className="text-2xl font-bold text-white m-0">
                                {user === undefined ? 'Crear cuenta' : 'Editar cuenta'}
                            </h2>
                        </ModalHeader>
                        <ModalBody className="pb-7">
                            <form className="flex flex-col gap-4 mt-4 text-white" onSubmit={onFormSubmit}>
                                <div className='flex flex-col gap-1'>
                                    <label htmlFor="name" className='text-left text-sm'>
                                        Nombre
                                    </label>
                                    <input value={name} type="text" name='name' id='name' className='w-full rounded-lg py-2 px-3 bg-[#FFFFFF1a] text-white outline-none' onChange={(e) => setName(e.target.value)} />
                                    <span className="text-xs text-red-500">
                                    </span>
                                </div>
                                <div className='flex flex-col gap-1'>
                                    <label htmlFor="lastName" className='text-left text-sm'>
                                        Apellido
                                    </label>
                                    <input value={lastName} type="text" name='lastName' id='lastName' className='w-full rounded-lg py-2 px-3 bg-[#FFFFFF1a] text-white outline-none' onChange={(e) => setLastName(e.target.value)} />
                                    <span className="text-xs text-red-500">
                                    </span>
                                </div>
                                <div className='flex flex-col gap-1'>
                                    <label htmlFor="phoneNumber" className='text-left text-sm'>
                                        Teléfono
                                    </label>
                                    <input value={phoneNumber} type="text" name='phoneNumber' id='phoneNumber' className='w-full rounded-lg py-2 px-3 bg-[#FFFFFF1a] text-white outline-none' onChange={(e) => setPhoneNumber(e.target.value)} />
                                    <span className="text-xs text-red-500">
                                    </span>
                                </div>
                                <div className='flex flex-col gap-1'>
                                    <label htmlFor="email" className='text-left text-sm'>
                                        Correo
                                    </label>
                                    <input value={email} type="email" name='email' id='email' className='w-full rounded-lg py-2 px-3 bg-[#FFFFFF1a] text-white outline-none' onChange={(e) => setEmail(e.target.value)} />
                                    <span className="text-xs text-red-500">
                                    </span>
                                </div>
                                {user === undefined && (
                                    <div className='flex flex-col gap-1'>
                                        <label htmlFor="password" className='text-left text-sm'>
                                            Contraseña
                                        </label>
                                        <input type="password" name='password' id='password' className='w-full rounded-lg py-2 px-3 bg-[#FFFFFF1a] text-white outline-none' onChange={(e) => setPassword(e.target.value)} />

                                        <span className="text-xs text-red-500">
                                        </span>
                                    </div>
                                )}
                                <Button
                                    color="primary"
                                    className="w-full font-semibold rounded-lg mt-3"
                                    type="submit"
                                >
                                    {user === undefined ? 'Crear' : 'Actualizar'}
                                </Button>
                            </form>
                        </ModalBody>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
}