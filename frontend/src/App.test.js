import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

// Mock do fetch global
const mockFetch = jest.fn();
global.fetch = mockFetch;

const mockUsersResponse = {
  users: [
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
    }
  ],
  total: 1
};

describe('App Component', () => {
  beforeEach(() => {
    mockFetch.mockReset();
    mockFetch.mockImplementation(() => 
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockUsersResponse)
      })
    );
  });

  it('deve renderizar o componente corretamente', async () => {
    render(<App />);
    
    // Verifica se o título está presente
    expect(screen.getByText('Gerenciamento de Usuários')).toBeInTheDocument();
    
    // Verifica se os filtros estão presentes
    expect(screen.getByText('Todas as empresas')).toBeInTheDocument();
    expect(screen.getByText('Todos os status')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Buscar por nome ou email')).toBeInTheDocument();
    
    // Aguarda os dados serem carregados
    await waitFor(() => {
      expect(screen.getByText('João Silva')).toBeInTheDocument();
    });
  });

  it('deve filtrar usuários por empresa', async () => {
    render(<App />);
    
    const companySelect = screen.getAllByRole('combobox')[0];
    fireEvent.change(companySelect, { target: { value: '1' } });
    
    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith(expect.stringContaining('companyid=1'));
    });
  });

  it('deve filtrar usuários por status', async () => {
    render(<App />);
    
    const statusSelect = screen.getAllByRole('combobox')[1];
    fireEvent.change(statusSelect, { target: { value: 'true' } });
    
    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith(expect.stringContaining('active=true'));
    });
  });

  it('deve buscar usuários por termo de pesquisa', async () => {
    render(<App />);
    
    const searchInput = screen.getByPlaceholderText('Buscar por nome ou email');
    await userEvent.type(searchInput, 'João');
    
    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith(expect.stringContaining('search=Jo%C3%A3o'));
    });
  });

  it('deve exibir mensagem de erro quando a API falha', async () => {
    mockFetch.mockImplementationOnce(() => 
      Promise.resolve({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error'
      })
    );

    render(<App />);
    
    await waitFor(() => {
      expect(screen.getByText(/Erro na API: 500 - Internal Server Error/)).toBeInTheDocument();
    });
  });

  it('deve paginar os resultados', async () => {
    render(<App />);
    
    await waitFor(() => {
      expect(screen.getByText('Página 1 de 1')).toBeInTheDocument();
    });

    const nextButton = screen.getByText('Próxima');
    expect(nextButton).toBeDisabled();

    const prevButton = screen.getByText('Anterior');
    expect(prevButton).toBeDisabled();
  });

  it('deve exibir mensagem quando nenhum usuário é encontrado', async () => {
    mockFetch.mockImplementationOnce(() => 
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ users: [], total: 0 })
      })
    );

    render(<App />);
    
    await waitFor(() => {
      expect(screen.getByText('Nenhum usuário encontrado.')).toBeInTheDocument();
    });
  });
}); 