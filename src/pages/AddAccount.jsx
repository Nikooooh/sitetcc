import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Input from "../components/Input";

export default function AddAccount() {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [dueDate, setDueDate] = useState("");
  const navigate = useNavigate();

  const handleAddAccount = async () => {
    try {
      await axios.post(
        "https://backendtcc-production-b1b7.up.railway.app/api/accounts",
        { description, amount, due_date: dueDate },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      alert("Conta adicionada com sucesso!");
      navigate("/dashboard");
    } catch (err) {
      console.error(err.response?.data);
      alert("Erro ao adicionar conta.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full">
        <h2 className="text-3xl font-bold text-center mb-6">Adicionar Conta</h2>
        <Input
          label="Descrição"
          placeholder="Digite a descrição"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <Input
          label="Valor"
          type="number"
          placeholder="R$"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <Input
          label="Vencimento"
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />
        <button
          onClick={handleAddAccount}
          className="w-full bg-blue-500 text-white py-2 rounded-lg mt-4 hover:bg-blue-600 transition-colors"
        >
          Adicionar
        </button>
      </div>
    </div>
  );
}
