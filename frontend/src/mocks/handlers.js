import { rest } from 'msw';

const mockUsers = [
  {
    id: 1,
    id_user: 'USR001',
    name: 'João Silva',
    shortName: 'João',
    email: 'joao@example.com',
    phoneNumberFormatted: '(11) 99999-9999',
    profile: 'Admin',
    clienteName: 'Cliente A',
    active: true,
    companyid: 1
  },
  {
    id: 2,
    id_user: 'USR002',
    name: 'Maria Santos',
    shortName: 'Maria',
    email: 'maria@example.com',
    phoneNumberFormatted: '(11) 88888-8888',
    profile: 'User',
    clienteName: 'Cliente B',
    active: true,
    companyid: 2
  }
];

export const handlers = [
  rest.get('/api/users', (req, res, ctx) => {
    const page = parseInt(req.url.searchParams.get('page')) || 1;
    const limit = parseInt(req.url.searchParams.get('limit')) || 10;
    const companyid = req.url.searchParams.get('companyid');
    const active = req.url.searchParams.get('active');
    const search = req.url.searchParams.get('search');

    let filteredUsers = [...mockUsers];

    if (companyid) {
      filteredUsers = filteredUsers.filter(user => user.companyid === parseInt(companyid));
    }

    if (active !== null && active !== '') {
      const isActive = active === 'true';
      filteredUsers = filteredUsers.filter(user => user.active === isActive);
    }

    if (search) {
      const searchLower = search.toLowerCase();
      filteredUsers = filteredUsers.filter(user => 
        user.name.toLowerCase().includes(searchLower) ||
        user.email.toLowerCase().includes(searchLower)
      );
    }

    const start = (page - 1) * limit;
    const paginatedUsers = filteredUsers.slice(start, start + limit);

    return res(
      ctx.status(200),
      ctx.json({
        users: paginatedUsers,
        total: filteredUsers.length
      })
    );
  })
]; 