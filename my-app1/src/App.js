import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import TaskManager from './pages/TasksPage';  
import LogIn from './pages/LogIn/LogInPage';
import SignUp from './pages/LogIn/SignUpPage';
import React, { useState, useEffect } from 'react';
import { auth } from './firebase'; // Ajuste o caminho conforme sua configuração


export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
      // Verifica se o usuário está autenticado
      const unsubscribe = auth.onAuthStateChanged((user) => {
          setIsLoggedIn(!!user);
      });

      // Limpa o listener (para nao haver leaks e parar de ouvir mudanças de autenticação)
      return () => unsubscribe();
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        {
          isLoggedIn &&
          <Route path="/tasks" element={<TaskManager />} /> 
        }
        <Route path="/login" element={<LogIn />} />
        <Route path='/signup' element={<SignUp/>}/>
      </Routes>
    </Router>
  );
}