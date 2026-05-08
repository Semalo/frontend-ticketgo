import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import { RouteLoader } from './components/RouteLoader';

const Login = lazy(() => import('./pages/Login').then((module) => ({ default: module.Login })));
const NovoChamado = lazy(() => import('./pages/NovoChamado').then((module) => ({ default: module.NovoChamado })));
const MeusChamados = lazy(() => import('./pages/MeusChamados').then((module) => ({ default: module.MeusChamados })));
const DetalhesChamado = lazy(() => import('./pages/DetalhesChamado').then((module) => ({ default: module.DetalhesChamado })));
const Relatorios = lazy(() => import('./pages/Relatorios').then((module) => ({ default: module.Relatorios })));
const Perfil = lazy(() => import('./pages/Perfil').then((module) => ({ default: module.Perfil })));
const Layout = lazy(() => import('./Layout').then((module) => ({ default: module.Layout })));

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#334155',
              color: '#fff',
              borderRadius: '10px',
              fontWeight: '500',
            },
            success: {
              style: { background: '#10b981' },
            },
            error: {
              style: { background: '#ef4444' },
            },
          }}
        />
        <Suspense fallback={<RouteLoader />}>
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<Login />} />

            <Route element={<Layout />}>
              <Route path="/chamados" element={<MeusChamados />} />
              <Route path="/novo-chamado" element={<NovoChamado />} />
              <Route path="/relatorios" element={<Relatorios />} />
              <Route path="/chamado/:id" element={<DetalhesChamado />} />
              <Route path="/perfil" element={<Perfil />} />
            </Route>
          </Routes>
        </Suspense>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
