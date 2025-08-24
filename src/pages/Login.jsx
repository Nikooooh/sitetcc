import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Input from "../components/Input";
import axios from "axios";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Redireciona se já estiver logado
    if (localStorage.getItem("token")) {
      navigate("/dashboard");
    }
  }, [navigate]);

  const handleLogin = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });
      localStorage.setItem("token", res.data.token); // salvar token JWT
      alert("Login realizado com sucesso!");
      navigate("/dashboard"); // redireciona para dashboard
    } catch (err) {
      console.error(err.response?.data);
      alert(err.response?.data?.error || "Erro no login");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-400 to-purple-500 px-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full">
        <h2 className="text-3xl font-bold text-center mb-6">Login</h2>
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
          placeholder="Digite sua senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          onClick={handleLogin}
          className="w-full bg-blue-500 text-white py-2 rounded-lg mt-4 hover:bg-blue-600 transition-colors"
        >
          Entrar
        </button>

        <div className="mt-4 text-center">
          <Link to="/forgot-password" className="text-blue-500 hover:underline">
            Esqueceu a senha?
          </Link>
        </div>
        <div className="mt-2 text-center">
          Não tem conta?{" "}
          <Link to="/register" className="text-blue-500 hover:underline">
            Cadastre-se
          </Link>
        </div>
      </div>
    </div>
  );
}
