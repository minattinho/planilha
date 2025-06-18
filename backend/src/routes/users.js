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

    if (companyid) {
      conditions.push('companyid = ?');
      params.push(companyid);
    }

    if (active !== undefined) {
      conditions.push('active = ?');
      params.push(active === 'true' ? 1 : 0);
    }

    if (search) {
      conditions.push('(name LIKE ? OR email LIKE ?)');
      params.push(`%${search}%`, `%${search}%`);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    // Query para contar total de registros
    const [countResult] = await pool.execute(
      `SELECT COUNT(*) as total FROM users ${whereClause}`,
      params
    );

    // Query para buscar usuários com paginação
    const [users] = await pool.execute(
      `SELECT id, id_user, createdat, updateat, companyid, name, shortName, 
       email, phoneNumberFormatted, profile, clienteName, active 
       FROM users ${whereClause} 
       LIMIT ? OFFSET ?`,
      [...params, parseInt(limit), parseInt(offset)]
    );

    res.json({
      users,
      total: countResult[0].total
    });

  } catch (error) {
    console.error('Erro ao buscar usuários:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

module.exports = router; 