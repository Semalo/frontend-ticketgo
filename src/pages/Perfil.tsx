import { User, Mail, Building, Briefcase, Key, Shield } from 'lucide-react';

export function Perfil() {
  // Simulando os dados do colaborador logado
  const colaborador = {
    nome: 'Raul Silva',
    email: 'raul.silva@empresa.com.br',
    setor: 'Contabilidade',
    cargo: 'Analista Contábil Sênior',
    matricula: '10445',
    dataAdmissao: '12/04/2021',
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Cabeçalho do Perfil */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Meu Perfil</h1>
        <p className="text-gray-500 mt-1">Visualize suas informações cadastradas no sistema.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Card Principal: Foto e Resumo */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 flex flex-col items-center text-center">
          <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mb-4 border-4 border-white shadow-md">
            <User size={40} />
          </div>
          <h2 className="text-xl font-bold text-gray-900">{colaborador.nome}</h2>
          <p className="text-sm font-medium text-blue-600 mb-1">{colaborador.cargo}</p>
          <p className="text-xs text-gray-500">{colaborador.setor}</p>
          
          <div className="w-full mt-6 pt-6 border-t border-gray-100 space-y-3">
            <button className="w-full flex items-center justify-center gap-2 bg-gray-50 text-gray-700 py-2 rounded-lg text-sm font-semibold hover:bg-gray-100 transition-colors border border-gray-200">
              <Key size={16} /> Alterar Senha
            </button>
          </div>
        </div>

        {/* Card de Detalhes (Ocupa 2 colunas) */}
        <div className="md:col-span-2 bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          <div className="p-5 border-b border-gray-100 bg-gray-50">
            <h3 className="font-bold text-gray-800 flex items-center gap-2">
              <Shield size={18} className="text-blue-600" />
              Informações Corporativas
            </h3>
          </div>
          
          <div className="p-6">
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-6">
              
              <div>
                <dt className="text-xs font-bold text-gray-500 uppercase flex items-center gap-1 mb-1">
                  <User size={14} /> Nome Completo
                </dt>
                <dd className="text-sm font-medium text-gray-900">{colaborador.nome}</dd>
              </div>

              <div>
                <dt className="text-xs font-bold text-gray-500 uppercase flex items-center gap-1 mb-1">
                  <Mail size={14} /> E-mail Corporativo
                </dt>
                <dd className="text-sm font-medium text-gray-900">{colaborador.email}</dd>
              </div>

              <div>
                <dt className="text-xs font-bold text-gray-500 uppercase flex items-center gap-1 mb-1">
                  <Building size={14} /> Setor (Centro de Custo)
                </dt>
                <dd className="text-sm font-medium text-gray-900">{colaborador.setor}</dd>
              </div>

              <div>
                <dt className="text-xs font-bold text-gray-500 uppercase flex items-center gap-1 mb-1">
                  <Briefcase size={14} /> Cargo / Função
                </dt>
                <dd className="text-sm font-medium text-gray-900">{colaborador.cargo}</dd>
              </div>

              <div>
                <dt className="text-xs font-bold text-gray-500 uppercase mb-1">Matrícula ERP</dt>
                <dd className="text-sm font-medium text-gray-900">{colaborador.matricula}</dd>
              </div>

              <div>
                <dt className="text-xs font-bold text-gray-500 uppercase mb-1">Data de Admissão</dt>
                <dd className="text-sm font-medium text-gray-900">{colaborador.dataAdmissao}</dd>
              </div>

            </dl>
          </div>
        </div>

      </div>
    </div>
  );
}