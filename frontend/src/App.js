import React, { useState, useEffect, useCallback } from 'react';

function App() {
  const [users, setUsers] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({
    companyid: '',
    active: '',
    search: ''
  });

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Iniciando busca de usuários...');
      
      const queryParams = new URLSearchParams({
        page,
        limit: 10,
        ...filters
      });

      const apiUrl = `/api/users?${queryParams}`;
      console.log('Fazendo requisição para:', apiUrl);

      const response = await fetch(apiUrl);
      console.log('Status da resposta:', response.status);
      
      if (!response.ok) {
        throw new Error(`Erro na API: ${response.status} - ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Dados recebidos:', data);

      setUsers(data.users || []);
      setTotal(data.total || 0);
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, [page, filters]);

  useEffect(() => {
    console.log('App montado/atualizado');
    fetchUsers();
  }, [fetchUsers]);

  const handleFilterChange = (name, value) => {
    console.log('Filtro alterado:', name, value);
    setFilters(prev => ({ ...prev, [name]: value }));
    setPage(1);
  };

  const totalPages = Math.ceil(total / 10);

  if (error) {
    return (
      <div className="container">
        <h1>Erro</h1>
        <div style={{ color: 'red', margin: '20px 0' }}>
          {error}
        </div>
        <button onClick={fetchUsers}>Tentar Novamente</button>
      </div>
    );
  }

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
      ) : users.length === 0 ? (
        <div style={{ textAlign: 'center', margin: '20px 0' }}>
          Nenhum usuário encontrado.
        </div>
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