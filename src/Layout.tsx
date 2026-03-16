import { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Ticket, 
  PlusCircle, 
  BarChart3, 
  Settings, 
  LogOut, 
  Menu, 
  Bell,
  User,
  X // Adicionado para o botão de fechar no mobile, caso precise
} from 'lucide-react';

// 1. Nossas novas importações para usar a API e os dados do usuário logado
import api from './services/api';
import { useAuth } from './contexts/AuthContext';

export function Layout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  
  const location = useLocation();
  const navigate = useNavigate();

  // 2. Puxamos os dados do usuário e a função de limpar o estado global da nossa Context API
  const { user, limparUsuario } = useAuth();

  // Links do menu lateral
  const menuItems = [
    { title: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/dashboard' },
    { title: 'Meus Chamados', icon: <Ticket size={20} />, path: '/chamados' },
    { title: 'Novo Chamado', icon: <PlusCircle size={20} />, path: '/novo-chamado' },
    { title: 'Relatórios', icon: <BarChart3 size={20} />, path: '/relatorios' },
  ];

  // 3. A função de Logout completa e segura
  const handleLogout = async () => {
    try {
      // Avisa o servidor Node.js (e a Sankhya) para invalidar o token
      await api.post('/api/sankhya/logout');
    } catch (error) {
      console.error('Erro ao comunicar logout ao servidor', error);
    } finally {
      // Limpa os dados de segurança do navegador
      localStorage.removeItem('@SankhyaTickets:token');
      localStorage.removeItem('@SankhyaTickets:usuario');
      
      // Limpa a memória global da aplicação
      limparUsuario(); 
      
      // Redireciona o usuário para a porta da frente (tela de login)
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      
      {/* Overlay para Mobile (fundo escuro quando o menu lateral abre) */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* ========================================== */}
      {/* MENU LATERAL (SIDEBAR) */}
      {/* ========================================== */}
      <aside className={`
        fixed inset-y-0 left-0 z-30 w-64 bg-slate-900 text-white transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:block
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="h-16 flex items-center px-6 bg-slate-950 border-b border-slate-800 justify-between">
          <h1 className="text-xl font-bold text-blue-500">Sankhya<span className="text-white">Tickets</span></h1>
          {/* Botão fechar apenas no mobile */}
          <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-gray-400 hover:text-white">
            <X size={20} />
          </button>
        </div>

        <nav className="p-4 space-y-2">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsSidebarOpen(false)} // Fecha o menu ao clicar (mobile)
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive 
                    ? 'bg-blue-600 text-white' 
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                {item.icon}
                <span className="font-medium">{item.title}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* ========================================== */}
      {/* CONTEÚDO PRINCIPAL (DIREITA) */}
      {/* ========================================== */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* CABEÇALHO SUPERIOR (HEADER) */}
        <header className="h-16 bg-white shadow-sm flex items-center justify-between px-4 lg:px-8 relative z-10">
          
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-lg lg:hidden"
          >
            <Menu size={24} />
          </button>

          <div className="flex items-center gap-4 ml-auto">
            <button className="p-2 text-gray-400 hover:text-blue-600 relative transition-colors">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {/* 4. ÁREA DO PERFIL DO USUÁRIO */}
            <div className="relative">
              <button 
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className="flex items-center gap-3 hover:bg-gray-50 p-1 pr-2 rounded-full transition-colors border border-transparent hover:border-gray-200"
              >
                {/* Nome e Setor puxados dinamicamente do banco de dados */}
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-bold text-gray-700">{user?.nomeUsuario || 'Carregando...'}</p>
                  <p className="text-xs text-gray-500">{user?.setorNome || 'Carregando...'}</p>
                </div>
                
                {/* Avatar gerado com a primeira letra do nome */}
                <div className="h-10 w-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold shadow-sm">
                  {user?.nomeUsuario ? user.nomeUsuario.charAt(0).toUpperCase() : 'U'}
                </div>
              </button>

               {/* Menu Suspenso (Dropdown) */}
              {isProfileMenuOpen && (
                <>
                  {/* Fundo invisível para fechar ao clicar fora */}
                  <div 
                    className="fixed inset-0 z-10" 
                    onClick={() => setIsProfileMenuOpen(false)}
                  ></div>
                  
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-lg z-20 py-2">
                    <Link 
                      to="/perfil" 
                      onClick={() => setIsProfileMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors"
                    >
                      <User size={16} /> Meu Perfil
                    </Link>
                    <Link 
                      to="/configuracoes" 
                      onClick={() => setIsProfileMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors"
                    >
                      <Settings size={16} /> Configurações
                    </Link>
                    <div className="h-px bg-gray-100 my-1"></div>
                    <button 
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors text-left"
                    >
                      <LogOut size={16} /> Sair do sistema
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        {/* ========================================== */}
        {/* ÁREA DE RENDERIZAÇÃO DAS PÁGINAS (OUTLET) */}
        {/* ========================================== */}
        <div className="flex-1 overflow-auto p-4 lg:p-8 relative z-0">
          <Outlet /> 
        </div>
        
      </div>
    </div>
  );
}