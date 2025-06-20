const express = require('express');
const router = express.Router();
const pool = require('../config/database');

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
    
    let conditions = [];
    let params = [];
    let paramCount = 1;

    if (companyid) {
      conditions.push(`companyid = $${paramCount}`);
      params.push(companyid);
      paramCount++;
    }

    if (active !== undefined) {
      conditions.push(`active = $${paramCount}`);
      params.push(active === 'true');
      paramCount++;
    }

    if (search) {
      conditions.push(`(name ILIKE $${paramCount} OR email ILIKE $${paramCount})`);
      params.push(`%${search}%`);
      paramCount++;
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    // Testa a conexão com o banco antes de executar as queries
    await pool.query('SELECT 1');

    // Query para contar total de registros
    const countQuery = `
      SELECT COUNT(*) as total 
      FROM "user" 
      ${whereClause}
    `;
    
    const countResult = await pool.query(countQuery, params);
    const total = parseInt(countResult.rows[0].total);

    // Query para buscar usuários com paginação
    const usersQuery = `
      SELECT id, id_user, createdat, updateat, companyid, name, 
             "shortName", email, "phoneNumberFormatted", profile, 
             "clienteName", active 
      FROM "user" 
      ${whereClause}
      LIMIT $${paramCount} 
      OFFSET $${paramCount + 1}
    `;

    const usersResult = await pool.query(
      usersQuery,
      [...params, limit, offset]
    );

    res.json({
      users: usersResult.rows,
      total,
      page: parseInt(page),
      limit: parseInt(limit)
    });

  } catch (error) {
    console.error('Erro ao buscar usuários:', error);
    
    if (error.code === 'ECONNREFUSED') {
      return res.status(500).json({ 
        error: 'Erro de conexão com o banco de dados',
        details: 'Não foi possível conectar ao banco de dados. Verifique as configurações de conexão.'
      });
    }
    
    if (error.code === '42P01') {
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

module.exports = router; 