import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Input from "../components/Input";
import axios from "axios";

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleResetPassword = async () => {
    if (password !== confirmPassword) {
      alert("As senhas não coincidem!");
      return;
    }

    try {
      const res = await axios.post(
        `http://localhost:5000/api/auth/reset-password/${token}`,
        { password }
      );
      alert(res.data.message);
      navigate("/login");
    } catch (err) {
      console.error(err.response.data);
      alert(err.response.data.error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-400 to-pink-500 px-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full">
        <h2 className="text-3xl font-bold text-center mb-6">Nova Senha</h2>
        <Input
          label="Nova Senha"
          type="password"
          placeholder="Digite sua nova senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Input
          label="Confirmar Nova Senha"
          type="password"
          placeholder="Confirme sua nova senha"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <button
          onClick={handleResetPassword}
          className="w-full bg-purple-500 text-white py-2 rounded-lg mt-4 hover:bg-purple-600 transition-colors"
        >
          Redefinir Senha
        </button>
        <div className="mt-4 text-center">
          <Link to="/login" className="text-purple-500 hover:underline">
            Voltar ao login
          </Link>
        </div>
      </div>
    </div>
  );
}
