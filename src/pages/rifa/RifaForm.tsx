import { Button, Checkbox } from "@nextui-org/react";
import Menu from "../../components/Menu";
import { FormEvent, useEffect, useState } from "react";
import { User } from "../../models/User";
import { UserService } from "../../services/UserService";
import { RifaService } from "../../services/RifaService";
import { useNavigate, useParams } from "react-router-dom";
import { Routes } from "../../routes/CONSTANTS";

export default function RifaFormPage() {
    const { id } = useParams();
    const [users, setUsers] = useState<User[]>([]);
    const [selectedUsers, setSelectedUsers] = useState<User[]>([]);

    const [title, setTitle] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [tickets, setTickets] = useState<number>(0);
    const [code, setCode] = useState<string>('');

    const toast = document.querySelector('.toast');
    const navigate = useNavigate();

    useEffect(() => {
        if (!id) {
            RifaService.generateCode()
                .then(code => setCode(code))
                .catch(error => console.error(error));
        }
        UserService.list()
            .then(users => {
                setUsers(users);
                if (id) {
                    RifaService.get(parseInt(id))
                        .then(rifa => {
                            setTitle(rifa.titulo);
                            setDescription(rifa.descripcion);
                            setTickets(rifa.cantidad_tickets);
                            setCode(rifa.codigo);
                            setSelectedUsers(rifa.usuarios_rifa?.map(item => item.usuario) ?? []);
                        })
                        .catch(error => console.error(error));
                }
            })
            .catch(error => console.error(error));
    }, [id]);

    const validate = () => {
        const titleSpan = document.querySelector('#title + span');
        const descriptionSpan = document.querySelector('#description + span');
        const ticketsSpan = document.querySelector('#tickets + span');
        const codeSpan = document.querySelector('#code + span');

        let isValid = true;

        if (title === '') {
            if (titleSpan) {
                titleSpan.textContent = 'El título es requerido';
            }
            isValid = false;
        } else if (titleSpan) {
            titleSpan.textContent = '';
        }

        if (description === '') {
            if (descriptionSpan) {
                descriptionSpan.textContent = 'La descripción es requerida';
            }
            isValid = false;
        } else if (descriptionSpan) {
            descriptionSpan.textContent = '';
        }

        if (tickets <= 0) {
            if (ticketsSpan) {
                ticketsSpan.textContent = 'La cantidad de tickets es requerida';
            }
            isValid = false;
        } else if (ticketsSpan) {
            ticketsSpan.textContent = '';
        }

        if (code === '') {
            if (codeSpan) {
                codeSpan.textContent = 'El código de los tickets es requerido';
            }
            isValid = false;
        } else if (codeSpan) {
            codeSpan.textContent = '';
        }

        return isValid;
    }

    const create = () => {
        RifaService.create({
            titulo: title,
            descripcion: description,
            cantidad_tickets: tickets,
            codigo: code,
            usuarios_participantes_ids: selectedUsers.map(user => user.id ?? 0)
        }).then(rifa => {
            console.log(rifa);
            navigate(Routes.RIFAS.LIST);
        }).catch(error => {
            console.error(error);
        });
    }

    const update = () => {
        const ids = selectedUsers.map(user => user.id ?? 0);
        RifaService.update({
            titulo: title,
            descripcion: description,
            cantidad_tickets: tickets,
            codigo: code,
            usuarios_participantes_ids: ids
        }, parseInt(id!)).then(rifa => {
            console.log(rifa);
            if (!toast) return;
            toast.classList.add('show');
            toast.innerHTML = `
                <p class='bg-green-500 text-white px-4 py-2 rounded-lg'>Rifa actualizada correctamente</p>
            `;
            setTimeout(() => {
                toast.classList.remove('show');
            }, 5000);
        }).catch(error => {
            console.error(error);
        });
    }

    const onFormSubmit = (event: FormEvent) => {
        event.preventDefault();
        event.stopPropagation();
        if (!validate()) {
            return;
        }
        if (selectedUsers.length > tickets) {
            if (!toast) return;
            toast.classList.add('show');
            toast.innerHTML = `
                <p class='bg-red-500 text-white px-4 py-2 rounded-lg'>Los usuarios seleccionados superan la cantidad de tickets</p>
            `;
            setTimeout(() => {
                toast.classList.remove('show');
            }, 5000);
            return;
        }
        if (id) {
            update();
        } else {
            create();
        }
    }

    const onUserSelect = (user: User) => {
        const selected = selectedUsers.some(item => item.usuario.id === user.usuario.id);
        if (selected) {
            setSelectedUsers(selectedUsers.filter(item => item.usuario.id !== user.usuario.id));
        } else {
            setSelectedUsers([...selectedUsers, user]);
        }
    }

    const getNewCode = () => {
        RifaService.generateCode()
            .then(code => setCode(code))
            .catch(error => console.error(error));
    }

    return (
        <div className="w-screen h-screen bg-gradient-to-r from-[#0B3646] to-[#01001F]">
            <Menu />
            <main className="flex flex-col items-center pt-8">
                <header className="text-center">
                    <h1 className="text-2xl font-bold text-white mb-3">
                        {id ? 'Editar Rifa' : 'Crear Rifa'}
                    </h1>
                    <p className="text-sm text-white">
                        {id ? ' Edita los campos de la rifa' : 'Crea una nueva rifa'}
                    </p>
                </header>
                <div className="flex gap-20 mt-10 w-full justify-center">
                    <div className="w-1/4">
                        <div className="flex flex-col gap-1 text-white">
                            <p className="text-left text-sm">
                                Código de los tickets
                            </p>
                            <div className="flex gap-2 items-center">
                                <p className="bg-[#FFFFFF1a] rounded-lg p-2 text-center text-white w-20">
                                    {code}
                                </p>
                                {!id && (
                                    <Button className="bg-blue-500 text-white rounded-lg p-2" onClick={getNewCode}>
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="w-4 h-4 fill-current">
                                            <path d="M142.9 142.9c62.2-62.2 162.7-62.5 225.3-1L327 183c-6.9 6.9-8.9 17.2-5.2 26.2s12.5 14.8 22.2 14.8H463.5c0 0 0 0 0 0H472c13.3 0 24-10.7 24-24V72c0-9.7-5.8-18.5-14.8-22.2s-19.3-1.7-26.2 5.2L413.4 96.6c-87.6-86.5-228.7-86.2-315.8 1C73.2 122 55.6 150.7 44.8 181.4c-5.9 16.7 2.9 34.9 19.5 40.8s34.9-2.9 40.8-19.5c7.7-21.8 20.2-42.3 37.8-59.8zM16 312v7.6 .7V440c0 9.7 5.8 18.5 14.8 22.2s19.3 1.7 26.2-5.2l41.6-41.6c87.6 86.5 228.7 86.2 315.8-1c24.4-24.4 42.1-53.1 52.9-83.7c5.9-16.7-2.9-34.9-19.5-40.8s-34.9 2.9-40.8 19.5c-7.7 21.8-20.2 42.3-37.8 59.8c-62.2 62.2-162.7 62.5-225.3 1L185 329c6.9-6.9 8.9-17.2 5.2-26.2s-12.5-14.8-22.2-14.8H48.4h-.7H40c-13.3 0-24 10.7-24 24z" />
                                        </svg>
                                    </Button>
                                )}
                            </div>
                        </div>
                        <form onSubmit={onFormSubmit}>
                            <div className="flex flex-col gap-7 mt-4 text-white">
                                <div className="flex flex-col gap-1">
                                    <label htmlFor="title" className="text-left text-sm">
                                        Título <span className="text-red-500">*</span>
                                    </label>
                                    <input value={title} type="text" name="title" id="title" className="w-full rounded-lg py-2 px-3 bg-[#FFFFFF1a] text-white outline-none" required onChange={(e) => setTitle(e.target.value)} />
                                    <span className="text-xs text-red-500">
                                    </span>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <label htmlFor="description" className="text-left text-sm">
                                        Descripción <span className="text-red-500">*</span>
                                    </label>
                                    <textarea value={description} name="description" id="description" className="w-full rounded-lg py-2 px-3 bg-[#FFFFFF1a] text-white outline-none resize-none h-20" required onChange={(e) => setDescription(e.target.value)} />
                                    <span className="text-xs text-red-500">
                                    </span>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <label htmlFor="tickets" className="text-left text-sm">
                                        Cantidad de tickets <span className="text-red-500">*</span>
                                    </label>
                                    <input value={tickets} type="number" name="tickets" id="tickets" className="w-full rounded-lg py-2 px-3 bg-[#FFFFFF1a] text-white outline-none" required onChange={(e) => setTickets(parseInt(e.target.value))} />
                                    <span className="text-xs text-red-500">
                                    </span>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <Button className="bg-red-500 text-white rounded-lg p-2 w-full mt-4" onClick={() => navigate(Routes.RIFAS.LIST)}>
                                        Cancelar
                                    </Button>
                                    <Button type="submit" className="bg-blue-500 text-white rounded-lg p-2 w-full mt-4">
                                        {id ? 'Actualizar' : 'Crear'}
                                    </Button>
                                </div>
                            </div>
                        </form>
                    </div>
                    <div className="w-1/4">
                        <h2 className="text-xl font-semibold text-white mb-3 text-center">
                            Lista de usuarios
                        </h2>
                        <p className="text-sm text-white text-center">
                            Seleccione los usuarios que estarán participando en la rifa.
                        </p>
                        <div className="bg-[#FFFFFF1a] rounded-lg p-4 h-[480px] overflow-y-auto mt-5">
                            {users.map(user => (
                                <Checkbox
                                    key={user.usuario.id}
                                    className="flex p-2 rounded-lg mb-2 w-full"
                                    onChange={() => onUserSelect(user)}
                                    isSelected={selectedUsers.some(item => item.usuario.id === user.usuario.id)}
                                >
                                    <span className="text-white">{user.usuario.first_name}</span>
                                    <span className="text-gray-500"> {user.usuario.username}</span>
                                </Checkbox>
                            ))}
                        </div>
                    </div>
                </div>
            </main>
            <div className="toast"></div>
        </div>
    )
}