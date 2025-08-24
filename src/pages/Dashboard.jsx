import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [accounts, setAccounts] = useState([]);
  const [filteredAccounts, setFilteredAccounts] = useState([]);
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [filter, setFilter] = useState("all");
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  // Dentro do seu Dashboard, acima do return ou junto dos outros hooks:
  const logout = () => {
    localStorage.removeItem("token"); // remove o token
    navigate("/login"); // redireciona para a página de login
  };

  const fetchAccounts = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/accounts", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAccounts(res.data);
      setFilteredAccounts(res.data);
    } catch (err) {
      console.error(err);
      alert("Erro ao carregar contas");
    }
  };

  const addAccountInline = async () => {
    try {
      await axios.post(
        "http://localhost:5000/api/accounts",
        { description, amount, due_date: dueDate },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setDescription("");
      setAmount("");
      setDueDate("");
      fetchAccounts();
    } catch (err) {
      console.error(err);
      alert("Erro ao adicionar conta");
    }
  };

  const payAccount = async (id) => {
    try {
      const res = await axios.put(
        `http://localhost:5000/api/accounts/${id}/pay`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const updatedAccount = res.data.account;
      setAccounts((prev) =>
        prev.map((acc) => (acc.id === updatedAccount.id ? updatedAccount : acc))
      );

      // Atualiza também o filtro
      setFilteredAccounts((prev) =>
        prev.map((acc) => (acc.id === updatedAccount.id ? updatedAccount : acc))
      );
    } catch (err) {
      console.error(err);
      alert("Erro ao marcar conta como paga");
    }
  };

  const handleFilter = (status) => {
    setFilter(status);
    if (status === "all") setFilteredAccounts(accounts);
    else
      setFilteredAccounts(
        accounts.filter((acc) => acc.translatedStatus === status)
      );
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Dashboard - Contas</h1>
        <button
          onClick={logout}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>

      {/* Filtros */}
      <div className="mb-6 flex gap-2">
        <button
          onClick={() => handleFilter("all")}
          className={`px-4 py-2 rounded ${
            filter === "all" ? "bg-blue-500 text-white" : "bg-gray-300"
          }`}
        >
          Todas
        </button>
        <button
          onClick={() => handleFilter("A Pagar")}
          className={`px-4 py-2 rounded ${
            filter === "A Pagar" ? "bg-blue-500 text-white" : "bg-gray-300"
          }`}
        >
          A pagar
        </button>
        <button
          onClick={() => handleFilter("Vencida")}
          className={`px-4 py-2 rounded ${
            filter === "Vencida" ? "bg-blue-500 text-white" : "bg-gray-300"
          }`}
        >
          Vencidas
        </button>
        <button
          onClick={() => handleFilter("Paga")}
          className={`px-4 py-2 rounded ${
            filter === "Paga" ? "bg-blue-500 text-white" : "bg-gray-300"
          }`}
        >
          Pagas
        </button>
      </div>

      {/* Botão para ir para a tela separada */}
      {/*<button
        onClick={() => navigate("/add-account")}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mb-6"
      >
        Adicionar nova conta (tela separada)
      </button>*/}

      {/* Inputs inline */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <h2 className="text-xl font-semibold mb-4">Adicionar nova conta</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input
            type="text"
            placeholder="Descrição"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="border rounded px-2 py-1"
          />
          <input
            type="number"
            placeholder="Valor"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="border rounded px-2 py-1"
          />
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="border rounded px-2 py-1"
          />
          <button
            onClick={addAccountInline}
            className="bg-green-500 text-white rounded px-4 py-2 hover:bg-green-600"
          >
            Adicionar
          </button>
        </div>
      </div>

      {/* Lista de contas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {filteredAccounts.map((acc) => {
          let bgColor = "bg-yellow-200";
          if (acc.translatedStatus === "Paga") bgColor = "bg-green-200";
          if (acc.translatedStatus === "Vencida") bgColor = "bg-red-200";

          return (
            <div key={acc.id} className={`${bgColor} p-4 rounded-lg shadow`}>
              <h3 className="font-bold">{acc.description}</h3>
              <p>Valor: R$ {acc.amount}</p>
              <p>
                Vencimento: {new Date(acc.due_date).toLocaleDateString("pt-BR")}
              </p>
              <p>Status: {acc.translatedStatus}</p>
              {acc.translatedStatus === "A Pagar" && (
                <button
                  onClick={() => payAccount(acc.id)}
                  className="mt-2 bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                >
                  Marcar como paga
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
