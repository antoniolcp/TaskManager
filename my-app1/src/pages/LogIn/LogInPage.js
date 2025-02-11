import { Link, useNavigate } from "react-router-dom"; 
import { auth } from "../../firebase.js"; 
import { signInWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";

export default function LogIn() {
  // Definindo estados para email, senha e possíveis mensagens de erro
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  //chamada quando o formulário é enviado
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Tenta fazer login com email e senha usando Firebase Auth
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/tasks"); 
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <>
      {/* Container principal que define a estrutura e o estilo da página de login */}
      <div className="bg-gray-900 flex h-screen flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="mt-10 text-center text-3xl font-bold leading-9 tracking-tight text-white">
            Sign in to your account
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          {/* Formulário de login */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Exibe uma mensagem de erro caso ocorra um erro no login */}
            {error && <p className="text-red-500">{error}</p>}
            <div>
              {/* Campo de entrada para o email */}
              <label htmlFor="email" className="block text-sm font-medium leading-6 text-white">
                Email address
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)} // Atualiza o estado do email conforme o usuário digita
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              {/* Campo de entrada para a senha */}
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-medium leading-6 text-white">
                  Password
                </label>
              </div>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)} // Atualiza o estado da senha conforme o usuário digita
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              {/* Botão de envio para fazer login */}
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Sign in
              </button>
            </div>
          </form>

          {/* Link para redirecionar o usuário à página de criação de conta caso ele não tenha uma */}
          <p className="mt-10 text-center text-sm text-gray-500">
            Not a member?{' '}
            <Link to="/signup" className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
