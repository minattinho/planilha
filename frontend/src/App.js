import React, { useState, useEffect } from 'react';

function App() {
  const [users, setUsers] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({
    companyid: '',
    active: '',
    search: ''
  });

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams({
        page,
        limit: 10,
        ...filters
      });

      const response = await fetch(`http://localhost:3001/users?${queryParams}`);
      const data = await response.json();

      setUsers(data.users);
      setTotal(data.total);
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page, filters]);

  const handleFilterChange = (name, value) => {
    setFilters(prev => ({ ...prev, [name]: value }));
    setPage(1);
  };

  const totalPages = Math.ceil(total / 10);

  return (
    <div className="container">
      <h1>Gerenciamento de Usuários</h1>
      
      <div className="filters">
        <div className="filter-item">
          <select
            value={filters.companyid}
            onChange={(e) => handleFilterChange('companyid', e.target.value)}
          >
            <option value="">Todas as empresas</option>
            <option value="1">Empresa 1</option>
            <option value="2">Empresa 2</option>
            <option value="3">Empresa 3</option>
          </select>
        </div>

        <div className="filter-item">
          <select
            value={filters.active}
            onChange={(e) => handleFilterChange('active', e.target.value)}
          >
            <option value="">Todos os status</option>
            <option value="true">Ativo</option>
            <option value="false">Inativo</option>
          </select>
        </div>

        <div className="filter-item">
          <input
            type="text"
            placeholder="Buscar por nome ou email"
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="loader"></div>
      ) : (
        <>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>ID Usuário</th>
                  <th>Nome</th>
                  <th>Nome Curto</th>
                  <th>Email</th>
                  <th>Telefone</th>
                  <th>Perfil</th>
                  <th>Cliente</th>
                  <th>Status</th>
                  <th>ID Empresa</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user.id}>
                    <td>{user.id_user}</td>
                    <td>{user.name}</td>
                    <td>{user.shortName}</td>
                    <td>{user.email}</td>
                    <td>{user.phoneNumberFormatted}</td>
                    <td>{user.profile}</td>
                    <td>{user.clienteName}</td>
                    <td>{user.active ? 'Ativo' : 'Inativo'}</td>
                    <td>{user.companyid}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="pagination">
            <button
              onClick={() => setPage(p => p - 1)}
              disabled={page === 1}
            >
              Anterior
            </button>
            <span>Página {page} de {totalPages}</span>
            <button
              onClick={() => setPage(p => p + 1)}
              disabled={page >= totalPages}
            >
              Próxima
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default App; 