import { useState } from "react";
import { Link } from "react-router-dom";
import Input from "../components/Input";
import axios from "axios";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const handleRegister = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/auth/register", {
        name,
        email,
        password,
      });
      console.log(res.data); // usuário cadastrado
      alert("Cadastro realizado com sucesso!");
    } catch (err) {
      console.error(err.response.data);
      alert(err.response.data.error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-green-400 to-teal-500 px-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full">
        <h2 className="text-3xl font-bold text-center mb-6">Cadastro</h2>
        <Input
          label="Nome"
          placeholder="Digite seu nome"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Input
          label="Email"
          type="email"
          placeholder="Digite seu email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          label="Senha"
          type="password"
          placeholder="Crie uma senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          onClick={handleRegister}
          className="w-full bg-green-500 text-white py-2 rounded-lg mt-4 hover:bg-green-600 transition-colors"
        >
          Cadastrar
        </button>

        <div className="mt-4 text-center">
          Já tem conta?{" "}
          <Link to="/login" className="text-green-500 hover:underline">
            Faça login
          </Link>
        </div>
      </div>
    </div>
  );
}
