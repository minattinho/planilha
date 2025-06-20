import express from 'express';
import supabase from '../config/database.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      companyid,
      active,
      search
    } = req.query;

    const offset = (page - 1) * limit;
    
    // Iniciando a query do Supabase
    let query = supabase
      .from('user')
      .select('*', { count: 'exact' });

    // Aplicando os filtros
    if (companyid) {
      query = query.eq('companyid', companyid);
    }

    if (active !== undefined) {
      query = query.eq('active', active === 'true');
    }

    if (search) {
      query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%`);
    }

    // Aplicando paginação
    const { data: users, count: total, error } = await query
      .range(offset, offset + limit - 1)
      .order('id');

    if (error) {
      throw error;
    }

    res.json({
      users,
      total,
      page: parseInt(page),
      limit: parseInt(limit)
    });

  } catch (error) {
    console.error('Erro ao buscar usuários:', error);
    
    if (error.code === 'PGRST301') {
      return res.status(500).json({ 
        error: 'Erro de conexão com o banco de dados',
        details: 'Não foi possível conectar ao Supabase. Verifique as configurações de conexão.'
      });
    }
    
    if (error.code === 'PGRST204') {
      return res.status(500).json({ 
        error: 'Erro na estrutura do banco de dados',
        details: 'A tabela "user" não foi encontrada. Verifique se o banco de dados está corretamente configurado.'
      });
    }

    res.status(500).json({ 
      error: 'Erro interno do servidor',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

export default router; 