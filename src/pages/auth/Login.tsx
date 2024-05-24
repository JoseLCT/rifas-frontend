import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEnvelope, faLock } from '@fortawesome/free-solid-svg-icons'
import { Button, useDisclosure } from '@nextui-org/react'
import { FormEvent, useState } from 'react'
import UserFormModal from '../../components/UserFormModal';
import { AuthService } from '../../services/AuthService';
import { useNavigate } from 'react-router-dom';
import { Routes } from '../../routes/CONSTANTS';

export default function LoginPage() {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const toast = document.querySelector('.toast');
    const navigate = useNavigate();

    const onFormSubmit = (e: FormEvent) => {
        e.preventDefault();
        e.stopPropagation();
        AuthService.login({
            username: email,
            password: password
        }).then((response) => {
            console.log(response);
            navigate(Routes.HOME);
        }).catch((error) => {
            console.log(error);
            if (!toast) return;
            toast.classList.add('show');
            toast.innerHTML = `
                <p class='bg-red-500 text-white px-4 py-2 rounded-lg'>Correo o contraseña incorrectos</p>
            `;
            setTimeout(() => {
                toast.classList.remove('show');
            }, 5000);
        });
    }

    return (
        <div className="w-screen h-screen flex justify-center items-center bg-gradient-to-r from-[#0B3646] to-[#01001F]">
            <main className="bg-[#FFFFFF1a] p-8 rounded-lg shadow-lg w-96 text-center">
                <header>
                    <h1 className="text-2xl font-bold text-white mb-3">
                        Iniciar Sesión
                    </h1>
                    <p className="text-sm text-white">
                        Inicia sesión para poder participar en las rifas y sorteos de la plataforma.
                    </p>
                </header>
                <form className="flex flex-col gap-4 mt-4 text-white" onSubmit={onFormSubmit}>
                    <div className='flex flex-col gap-1'>
                        <label htmlFor="email" className='text-left text-sm'>
                            Correo
                        </label>
                        <div className='relative'>
                            <input type="email" name='email' id='email' className='w-full rounded-lg p-2 pl-10 bg-[#FFFFFF1a] text-white outline-none' onChange={(e) => setEmail(e.target.value)} required />
                            <FontAwesomeIcon icon={faEnvelope} className='absolute top-1/2 transform -translate-y-1/2 left-3 text-gray-400' />
                        </div>
                    </div>
                    <div className='flex flex-col gap-1'>
                        <label htmlFor="password" className='text-left text-sm'>
                            Contraseña
                        </label>
                        <div className='relative'>
                            <input type="password" name='password' id='password' className='w-full rounded-lg p-2 pl-10 bg-[#FFFFFF1a] text-white outline-none' onChange={(e) => setPassword(e.target.value)} required />
                            <FontAwesomeIcon icon={faLock} className='absolute top-1/2 transform -translate-y-1/2 left-3 text-gray-400' />
                        </div>
                    </div>
                    <Button
                        color="primary"
                        className="w-full font-semibold rounded-lg mt-3"
                        type="submit"
                    >
                        Iniciar Sesión
                    </Button>
                </form>
                <span className="text-white mt-4 block text-sm">
                    ¿No tienes cuenta?
                    <button onClick={onOpen} className="text-blue-500 ml-2 hover:underline focus:outline-none">
                        Regístrate
                    </button>
                </span>
            </main>
            <UserFormModal isOpen={isOpen} onOpenChange={onOpenChange} />
            <div className='toast'>
            </div>
        </div>
    )
}