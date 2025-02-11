import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { toQueryRef } from 'firebase/data-connect';

export default function HomePage() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        // Verifica se o usuário está autenticado
        const unsubscribe = auth.onAuthStateChanged((user) => {
            setIsLoggedIn(!!user);
        });

        // Limpa o listener (para nao haver leaks e parar de ouvir mudanças de autenticação)
        return () => unsubscribe();
    }, []);

    const handleNovaTarefaClick = () => {
        if (isLoggedIn) {
            navigate('/tasks'); // Se estiver logado, vai para a página de tarefas
        } else {
            navigate('/login'); // Se não estiver logado, vai para a página de login
        }
    };

    return (
        <div className="bg-gray-900 flex items-center justify-center h-screen"> 
            <div className="lg:flex lg:items-center lg:justify-between lg:gap-x-8 px-8">
                <div className="max-w-md text-center lg:text-left lg:flex-auto">
                    <h2 className="text-8xl font-bold tracking-tight text-white sm:text-7xl">
                    <span className="text-green-500">Task</span> 
                    <span className="text-red-500"> Manager</span>
                    </h2>
                    <p className="mt-6 text-3xl leading-9 text-gray-300">
                        Task management system that allows you to view, create, edit, and delete tasks.
                    </p>
                    <div className="mt-10 flex items-center justify-center gap-x-6 lg:justify-start">
                        <button
                            onClick={handleNovaTarefaClick}
                            className="rounded-md bg-white px-10 py-3 text-lg font-semibold hover:bg-gray-100"
                        >
                            Nova tarefa
                        </button>
                        <Link 
                            to="/login" 
                            className="text-lg font-semibold leading-5 text-white">
                            LogIn <span aria-hidden="true">→</span>
                        </Link>
                    </div>
                </div>
                <div className="px-4">
                    <img
                        alt="App screenshot"
                        src="/images/ScreenshotApp.png"
                        className="w-full h-auto rounded-md bg-white/5"
                    />
                </div>
            </div>
        </div>
    );
}