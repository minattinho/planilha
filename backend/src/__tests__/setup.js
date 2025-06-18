// Mock do pool de conexão com o banco de dados
jest.mock('../config/database', () => ({
  query: jest.fn()
}));

// Limpa todos os mocks após cada teste
afterEach(() => {
  jest.clearAllMocks();
}); 