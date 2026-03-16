import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Login } from './pages/Login';
import { DashboardTI } from './pages/DashboardTI';
import { DashboardSetor } from './pages/DashboardSetor';
import { NovoChamado } from './pages/NovoChamado';
import { MeusChamados } from './pages/MeusChamados';
import { DetalhesChamado } from './pages/DetalhesChamado';
import { Relatorios } from './pages/Relatorios';
import { Perfil } from './pages/Perfil';
import { Layout } from './Layout';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        
        {/* 2. Rotas protegidas envelopadas pelo Layout */}
        <Route element={<Layout />}>
          <Route path="/dashboard-ti" element={<DashboardTI />} />
          <Route path="/dashboard" element={<DashboardSetor />} />
          {/* Crie páginas vazias depois para essas rotas não quebrarem a tela */}
          <Route path="/chamados" element={<MeusChamados />} />
          <Route path="/novo-chamado" element={<NovoChamado />} />
          <Route path="/relatorios" element={<Relatorios />} />
          <Route path="/chamado/:id" element={<DetalhesChamado />} />
          <Route path="/perfil" element={<Perfil />} />
        </Route>
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;