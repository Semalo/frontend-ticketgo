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
  User
} from 'lucide-react';

export function Layout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false); // Estado do menu de perfil
  const location = useLocation();
  const navigate = useNavigate();

  // Links do menu lateral
  const menuItems = [
    { title: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/dashboard' },
    { title: 'Meus Chamados', icon: <Ticket size={20} />, path: '/chamados' },
    { title: 'Novo Chamado', icon: <PlusCircle size={20} />, path: '/novo-chamado' },
    { title: 'Relatórios', icon: <BarChart3 size={20} />, path: '/relatorios' },
  ];

  const handleLogout = () => {
    // Lógica de logout entrará aqui futuramente
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      
      {/* Overlay para Mobile (fundo escuro quando o menu abre) */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar / Menu Lateral */}
      <aside className={`
        fixed inset-y-0 left-0 z-30 w-64 bg-slate-900 text-slate-300 transform transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 flex flex-col
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Logo/Header do Sidebar */}
        <div className="h-16 flex items-center justify-center border-b border-slate-800">
          <h1 className="text-white text-xl font-bold tracking-wider">Sankhya<span className="text-blue-500">Tickets</span></h1>
        </div>

        {/* Links de Navegação */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = location.pathname.includes(item.path);
            return (
              <Link
                key={item.title}
                to={item.path}
                onClick={() => setIsSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive 
                    ? 'bg-blue-600 text-white' 
                    : 'hover:bg-slate-800 hover:text-white'
                }`}
              >
                {item.icon}
                <span className="font-medium">{item.title}</span>
              </Link>
            );
          })}
        </nav>

        {/* Card de Info Essencial (Resumo rápido) */}
        <div className="p-4 mx-4 mb-4 bg-slate-800 rounded-xl">
          <p className="text-xs text-slate-400 uppercase tracking-wider mb-2">Seu Setor</p>
          <div className="flex justify-between items-center text-sm text-white">
            <span>Pendentes</span>
            <span className="bg-red-500 text-white px-2 py-0.5 rounded-full text-xs font-bold">3</span>
          </div>
        </div>

        {/* Rodapé do Sidebar: Configurações e Logout */}
        <div className="p-4 border-t border-slate-800 space-y-2">
          <button className="flex items-center gap-3 px-4 py-2 w-full rounded-lg hover:bg-slate-800 transition-colors text-sm">
            <Settings size={18} />
            <span>Configurações</span>
          </button>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-2 w-full rounded-lg hover:bg-red-500/10 hover:text-red-400 transition-colors text-sm"
          >
            <LogOut size={18} />
            <span>Sair do sistema</span>
          </button>
        </div>
      </aside>

      {/* Área Principal (Header + Conteúdo) */}
      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        
        {/* Topbar / Header com o Menu de Perfil */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:px-8 shrink-0 relative z-10">
          {/* Botão Mobile */}
          <button 
            className="lg:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            onClick={() => setIsSidebarOpen(true)}
          >
            <Menu size={24} />
          </button>

          {/* Breadcrumb ou Título da Página (escondido no mobile) */}
          <div className="hidden lg:block text-gray-800 font-semibold">
            Visão Geral
          </div>

          {/* Ações do Usuário */}
          <div className="flex items-center gap-4">
            <button className="relative p-2 text-gray-400 hover:text-gray-600 transition-colors">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            
            <div className="h-8 w-px bg-gray-200"></div>
            
            {/* Área do Perfil Clicável */}
            <div className="relative">
              <button 
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className="flex items-center gap-3 cursor-pointer p-1 rounded-lg hover:bg-gray-50 transition-colors outline-none"
              >
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                  <User size={18} />
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-gray-900 font-medium leading-none text-sm">Raul Silva</p>
                  <p className="text-gray-500 text-xs mt-1">Contabilidade</p>
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

        {/* Área onde as páginas (Dashboards) serão renderizadas */}
        <div className="flex-1 overflow-auto p-4 lg:p-8 relative z-0">
          <Outlet /> {/* Aqui a mágica do React Router acontece! */}
        </div>

      </main>
    </div>
  );
}