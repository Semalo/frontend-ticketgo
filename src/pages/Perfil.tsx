import { User, Mail, Building, Briefcase, Shield, Fingerprint, IdCard } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export function Perfil() {
  // Extraímos os dados reais do usuário logado através do nosso Context API
  const { user } = useAuth();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Cabeçalho da Página */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-3">
          <div className="p-2 bg-blue-600 rounded-lg shadow-sm text-white">
            <IdCard size={24} strokeWidth={2} />
          </div>
          O Meu Perfil
        </h1>
        <p className="mt-2 text-sm text-gray-500 max-w-2xl">
          Visualize as suas informações pessoais e as credenciais de acesso vinculadas ao sistema ERP Sankhya.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* COLUNA ESQUERDA: Cartão de Perfil Principal */}
        <div className="bg-white ring-1 ring-gray-200 rounded-2xl shadow-sm overflow-hidden flex flex-col items-center text-center p-8 relative">
          {/* Fundo decorativo sutil no topo do cartão */}
          <div className="absolute top-0 left-0 right-0 h-24 bg-linear-to-b from-blue-50 to-white"></div>
          
          <div className="relative w-28 h-28 bg-linear-to-tr from-blue-600 to-indigo-500 rounded-full flex items-center justify-center text-white font-bold shadow-lg ring-4 ring-white text-4xl mb-5">
            {user?.nomeUsuario ? user.nomeUsuario.charAt(0).toUpperCase() : <User size={48} />}
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
            {user?.nomeUsuario || 'A carregar...'}
          </h2>
          
          <div className="mt-3 flex items-center gap-2 text-sm font-semibold text-blue-700 bg-blue-50 px-4 py-1.5 rounded-full border border-blue-100">
            <Building size={16} />
            {user?.setorNome || 'Setor não informado'}
          </div>
          
          <div className="mt-6 w-full border-t border-gray-100 pt-6">
            <div className="flex flex-col items-center gap-1.5 text-sm text-gray-600">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Endereço de E-mail</span>
              <div className="flex items-center gap-2 font-medium">
                <Mail size={16} className="text-gray-400" />
                {user?.email || 'E-mail não cadastrado'}
              </div>
            </div>
          </div>
        </div>

        {/* COLUNA DIREITA: Credenciais do Sistema (ERP) */}
        <div className="lg:col-span-2 bg-white ring-1 ring-gray-200 rounded-2xl shadow-sm overflow-hidden flex flex-col">
          
          <div className="px-6 py-5 border-b border-gray-100 bg-slate-50/50 flex items-center gap-2">
            <Shield size={18} className="text-slate-600" />
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Credenciais do Sistema</h3>
          </div>
          
          <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-6 flex-1">
            
            <div className="space-y-1.5">
              <span className="text-xs font-bold text-gray-500 uppercase flex items-center gap-1.5 mb-1">
                <Fingerprint size={14} className="text-blue-500" /> Matrícula ERP (Cód. Usuário)
              </span>
              <div className="font-semibold text-gray-900 bg-slate-50 px-4 py-3 rounded-xl border border-slate-200/60 shadow-sm">
                {user?.codigoUsuario || '-'}
              </div>
            </div>
            <div className="space-y-1.5">
              <span className="text-xs font-bold text-gray-500 uppercase flex items-center gap-1.5 mb-1">
                <Briefcase size={14} className="text-blue-500" /> Código do Parceiro
              </span>
              <div className="font-semibold text-gray-900 bg-slate-50 px-4 py-3 rounded-xl border border-slate-200/60 shadow-sm">
                {user?.codigoParceiro || 'Não informado'}
              </div>
            </div> 
          </div>

          <div className="px-6 py-4 bg-slate-50 border-t border-gray-100 text-xs text-slate-500 leading-relaxed">
            <p><strong>Nota:</strong> Estes dados são sincronizados automaticamente com o sistema central. Caso note alguma divergência na sua lotação ou código de parceiro, por favor, abra um chamado para o setor de TI.</p>
          </div>

        </div>
      </div>
    </div>
  );
}