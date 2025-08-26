import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import Swal from "sweetalert2";
export default function Dashboard() {
  const [accounts, setAccounts] = useState([]);
  const [filteredAccounts, setFilteredAccounts] = useState([]);
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [modalAccount, setModalAccount] = useState(null);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // Logout
  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };
  // Excluir conta
  const deleteAccount = async (id) => {
    try {
      await axios.delete(
        `https://backendtcc-production-b1b7.up.railway.app/api/accounts/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Atualiza a lista no frontend sem precisar recarregar
      setAccounts((prev) => prev.filter((acc) => acc.id !== id));
      setFilteredAccounts((prev) => prev.filter((acc) => acc.id !== id));
    } catch (err) {
      console.error(err);
      alert("Erro ao excluir conta");
    }
  };

  // Fetch accounts
  const fetchAccounts = async () => {
    try {
      const res = await axios.get(
        "https://backendtcc-production-b1b7.up.railway.app/api/accounts",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAccounts(res.data);
      setFilteredAccounts(res.data);
    } catch (err) {
      console.error(err);
      alert("Erro ao carregar contas");
    }
  };

  // Add account
  const addAccountInline = async () => {
    if (!description || !amount || !dueDate)
      return alert("Preencha todos os campos");
    try {
      await axios.post(
        "https://backendtcc-production-b1b7.up.railway.app/api/accounts",
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

  // Pay account
  const payAccount = async (id) => {
    try {
      const res = await axios.put(
        `https://backendtcc-production-b1b7.up.railway.app/api/accounts/${id}/pay`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const updatedAccount = res.data.account;
      setAccounts((prev) =>
        prev.map((acc) => (acc.id === updatedAccount.id ? updatedAccount : acc))
      );
      setFilteredAccounts((prev) =>
        prev.map((acc) => (acc.id === updatedAccount.id ? updatedAccount : acc))
      );
      setModalAccount(null);
    } catch (err) {
      console.error(err);
      alert("Erro ao marcar conta como paga");
    }
  };

  // Filter accounts
  const handleFilter = (status) => {
    setFilter(status);
    let temp = [...accounts];
    if (status !== "all")
      temp = temp.filter((acc) => acc.translatedStatus === status);
    if (searchTerm)
      temp = temp.filter((acc) =>
        acc.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    setFilteredAccounts(temp);
  };

  // Search
  const handleSearch = (term) => {
    setSearchTerm(term);
    let temp = [...accounts];
    if (filter !== "all")
      temp = temp.filter((acc) => acc.translatedStatus === filter);
    temp = temp.filter((acc) =>
      acc.description.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredAccounts(temp);
  };

  // Sort
  const handleSort = (criteria) => {
    setSortBy(criteria);
    let temp = [...filteredAccounts];
    if (criteria === "valor") temp.sort((a, b) => a.amount - b.amount);
    else if (criteria === "vencimento")
      temp.sort((a, b) => new Date(a.due_date) - new Date(b.due_date));
    else if (criteria === "status")
      temp.sort((a, b) => a.translatedStatus.localeCompare(b.translatedStatus));
    setFilteredAccounts(temp);
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Excluir conta?",
      text: "Essa ação não pode ser desfeita.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sim, excluir",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(
          `https://backendtcc-production-b1b7.up.railway.app/api/accounts/${id}`
        );
        setAccounts(accounts.filter((acc) => acc.id !== id));
        Swal.fire("Excluído!", "A conta foi removida.", "success");
      } catch (error) {
        console.error("Erro ao excluir conta:", error);
        Swal.fire("Erro!", "Não foi possível excluir a conta.", "error");
      }
    }
  };
  // Generate PDF
  const generatePDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Resumo Financeiro", 14, 20);

    const totalPagar = accounts
      .filter((a) => a.translatedStatus === "A Pagar")
      .reduce((sum, a) => sum + Number(a.amount), 0);
    const totalPago = accounts
      .filter((a) => a.translatedStatus === "Paga")
      .reduce((sum, a) => sum + Number(a.amount), 0);
    const totalVencido = accounts
      .filter((a) => a.translatedStatus === "Vencida")
      .reduce((sum, a) => sum + Number(a.amount), 0);
    const totalGeral = accounts.reduce((sum, a) => sum + Number(a.amount), 0);

    doc.setFontSize(14);
    doc.text(`A Pagar: R$ ${totalPagar}`, 14, 40);
    doc.text(`Pagas: R$ ${totalPago}`, 14, 50);
    doc.text(`Vencidas: R$ ${totalVencido}`, 14, 60);
    doc.text(`Total: R$ ${totalGeral}`, 14, 70);

    doc.save("resumo_financeiro.pdf");
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Dashboard - Contas</h1>
        <button
          onClick={logout}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>

      {/* Botão gerar PDF */}
      <div className="mb-4">
        <button
          onClick={generatePDF}
          className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
        >
          Gerar PDF do Resumo
        </button>
      </div>

      {/* Resumo financeiro */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded shadow text-center">
          <h3 className="font-semibold">A Pagar</h3>
          <p>
            R${" "}
            {accounts
              .filter((a) => a.translatedStatus === "A Pagar")
              .reduce((sum, a) => sum + Number(a.amount), 0)}
          </p>
        </div>
        <div className="bg-white p-4 rounded shadow text-center">
          <h3 className="font-semibold">Pagas</h3>
          <p>
            R${" "}
            {accounts
              .filter((a) => a.translatedStatus === "Paga")
              .reduce((sum, a) => sum + Number(a.amount), 0)}
          </p>
        </div>
        <div className="bg-white p-4 rounded shadow text-center">
          <h3 className="font-semibold">Vencidas</h3>
          <p>
            R${" "}
            {accounts
              .filter((a) => a.translatedStatus === "Vencida")
              .reduce((sum, a) => sum + Number(a.amount), 0)}
          </p>
        </div>
        <div className="bg-white p-4 rounded shadow text-center">
          <h3 className="font-semibold">Total</h3>
          <p>R$ {accounts.reduce((sum, a) => sum + Number(a.amount), 0)}</p>
        </div>
      </div>

      {/* Filtros, pesquisa e ordenação */}
      <div className="mb-6 flex flex-col md:flex-row gap-2 items-center">
        <input
          type="text"
          placeholder="Buscar por descrição"
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          className="border rounded px-2 py-1 w-full md:w-1/3"
        />
        <div className="flex gap-2 mt-2 md:mt-0">
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
        <select
          value={sortBy}
          onChange={(e) => handleSort(e.target.value)}
          className="border rounded px-2 py-1 ml-auto"
        >
          <option value="">Ordenar por</option>
          <option value="valor">Valor</option>
          <option value="vencimento">Vencimento</option>
          <option value="status">Status</option>
        </select>
      </div>

      {/* Inputs inline */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <h2 className="text-xl font-semibold mb-4">Adicionar nova conta</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          {/* Input de descrição */}
          <div className="flex flex-col">
            <span className="text-md text-gray-800 mb-1">Descrição:</span>
            <input
              type="text"
              placeholder="Descrição"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="border rounded px-2 py-1"
            />
          </div>

          {/* Input de valor */}
          <div className="flex flex-col">
            <span className="text-md text-gray-800 mb-1">Valor:</span>
            <input
              type="number"
              placeholder="Valor"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="border rounded px-2 py-1"
            />
          </div>

          {/* Input de data */}
          <div className="flex flex-col">
            <span className="text-md text-gray-800 mb-1">
              Data de vencimento:
            </span>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="border rounded px-2 py-1"
            />
          </div>

          {/* Botão */}
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

          const today = new Date();
          const due = new Date(acc.due_date);

          if (
            acc.translatedStatus === "A Pagar" &&
            (due - today) / (1000 * 60 * 60 * 24) <= 2
          ) {
            bgColor = "bg-orange-300";
          }

          return (
            <div key={acc.id} className={`${bgColor} p-4 rounded-lg shadow`}>
              <h3 className="font-bold">{acc.description}</h3>
              <p>Valor: R$ {acc.amount}</p>
              <p>
                Vencimento:{" "}
                {acc.due_date
                  ? new Date(acc.due_date).toLocaleDateString("pt-BR", {
                      timeZone: "UTC",
                    })
                  : ""}
              </p>
              <p>Status: {acc.translatedStatus}</p>
              {(acc.translatedStatus === "A Pagar" ||
                acc.translatedStatus === "Vencida") && (
                <button
                  onClick={() => setModalAccount(acc)}
                  className="mt-2 bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                >
                  Marcar como paga
                </button>
              )}{" "}
              <button
                onClick={() => {
                  if (
                    window.confirm("Tem certeza que deseja excluir esta conta?")
                  ) {
                    deleteAccount(acc.id);
                  }
                }}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
              >
                Excluir
              </button>
            </div>
          );
        })}
      </div>

      {/* Modal de confirmação */}
      {modalAccount && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-lg w-80">
            <h2 className="text-lg font-bold mb-4">Confirmar pagamento</h2>
            <p>
              Deseja marcar <strong>{modalAccount.description}</strong> como
              paga?
            </p>
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => setModalAccount(null)}
                className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
              >
                Cancelar
              </button>
              <button
                onClick={() => payAccount(modalAccount.id)}
                className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
