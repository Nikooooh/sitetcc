import { useState } from "react";
import { Link } from "react-router-dom";
import Input from "../components/Input";
import axios from "axios";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");

  const handleForgotPassword = async (e) => {
    e.preventDefault(); // Evita reload da página
    try {
      const res = await axios.post(
        "https://backendtcc-production-b1b7.up.railway.app/api/auth/forgot-password",
        { email }
      );
      alert(res.data.message); // Email enviado
    } catch (err) {
      console.error(err.response?.data);
      alert(err.response?.data?.error || "Erro ao enviar email");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-yellow-400 to-orange-500 px-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full">
        <h2 className="text-3xl font-bold text-center mb-6">Recuperar Senha</h2>

        <form onSubmit={handleForgotPassword}>
          <Input
            label="Email"
            type="email"
            placeholder="Digite seu email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button
            type="submit"
            className="w-full bg-yellow-500 text-white py-2 rounded-lg mt-4 hover:bg-yellow-600 transition-colors"
          >
            Enviar link de recuperação
          </button>
        </form>

        <div className="mt-4 text-center">
          Lembrou a senha?{" "}
          <Link to="/login" className="text-yellow-500 hover:underline">
            Faça login
          </Link>
        </div>
      </div>
    </div>
  );
}
