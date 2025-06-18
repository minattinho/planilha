const request = require('supertest');
const express = require('express');
const usersRouter = require('../routes/users');
const pool = require('../config/database');

const app = express();
app.use(express.json());
app.use('/api/users', usersRouter);

describe('Testes das rotas de usuários', () => {
  describe('GET /api/users', () => {
    it('deve retornar lista de usuários com paginação', async () => {
      const mockUsers = [
        {
          id: 1,
          name: 'Teste User',
          email: 'teste@example.com',
          active: true
        }
      ];

      pool.query.mockResolvedValueOnce({ rows: [{ total: '1' }] });
      pool.query.mockResolvedValueOnce({ rows: mockUsers });

      const response = await request(app)
        .get('/api/users')
        .query({ page: 1, limit: 10 });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('users');
      expect(response.body).toHaveProperty('total');
      expect(response.body.users).toEqual(mockUsers);
      expect(response.body.total).toBe(1);
    });

    it('deve filtrar usuários por companyid', async () => {
      const companyId = "1";
      
      pool.query.mockResolvedValueOnce({ rows: [{ total: '1' }] });
      pool.query.mockResolvedValueOnce({ rows: [] });

      const response = await request(app)
        .get('/api/users')
        .query({ companyid: companyId });

      expect(response.status).toBe(200);
      const calls = pool.query.mock.calls;
      expect(calls[0][0]).toContain('WHERE companyid = $1');
      expect(calls[0][1]).toEqual([companyId]);
    });

    it('deve filtrar usuários por status ativo', async () => {
      pool.query.mockResolvedValueOnce({ rows: [{ total: '1' }] });
      pool.query.mockResolvedValueOnce({ rows: [] });

      const response = await request(app)
        .get('/api/users')
        .query({ active: 'true' });

      expect(response.status).toBe(200);
      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining('WHERE active = $1'),
        expect.arrayContaining([true])
      );
    });

    it('deve buscar usuários por termo de pesquisa', async () => {
      const searchTerm = 'john';
      
      pool.query.mockResolvedValueOnce({ rows: [{ total: '1' }] });
      pool.query.mockResolvedValueOnce({ rows: [] });

      const response = await request(app)
        .get('/api/users')
        .query({ search: searchTerm });

      expect(response.status).toBe(200);
      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining('WHERE (name ILIKE $1 OR email ILIKE $1)'),
        expect.arrayContaining([`%${searchTerm}%`])
      );
    });

    it('deve retornar erro 500 quando ocorrer erro no banco', async () => {
      pool.query.mockRejectedValueOnce(new Error('Erro de banco de dados'));

      const response = await request(app)
        .get('/api/users');

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty('error', 'Erro interno do servidor');
    });
  });
}); 