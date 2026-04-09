// src/utils/dicionarios.ts

// ==========================================
// DICIONÁRIOS DE DADOS DO SISTEMA SANKHYA
// ==========================================

// 1. Mapeamento de Status dos Chamados
export const STATUS_CHAMADO_MAP: Record<string, string> = {
  '0': 'Aguardando usuário',
  '1': 'Aberto',
  '2': 'Em atendimento',
  '3': 'Concluído'
};

// 2. Mapeamento de Assuntos de TI / RH / Fiscal, etc.
export const ASSUNTOS_MAP: Record<string, string> = {
  '2': 'Mudança de setor', '3': 'Promoção', '4': 'Pedido de férias', '5': 'Mudança de turno',
  '6': 'Saldo de horas', '7': 'Abertura de vagas', '8': 'Aplicação advertências', '9': 'Solicitação de comunicados',
  '10': 'Dúvidas sobre holerite/benefícios', '11': 'Solicitação refeição', '12': 'Solicitação VT', '13': 'Cancelamento refeição',
  '14': 'Cancelamento VT', '15': 'Problemas nas dependências físicas da empresa', '16': 'Problemas estacionamento',
  '17': 'Problemas entre colegas', '18': 'Esclarecimento sobre normativas/legislação', '20': 'Vincular Região',
  '21': 'Solicitação de resmas', '22': 'Acessos', '23': 'Desenvolvimento', '24': 'Suporte Sankhya',
  '25': 'Suporte', '26': 'Baixa/Inclusão de patrimônio (fiscal)', '27': 'Exclusão nota/Portal de Compras (fiscal)',
  '30': 'Alteração de preços de tabela', '32': 'Liberação de Bonificação', '34': 'Comprador: cadastro / Inativar',
  '35': 'Vendedor Pleno: cadastro / Inativar', '36': 'Vendedor Jr: cadastro / Inativar', '37': 'Produto: Cadastro / Alteração',
  '38': 'Perfil: Cadastro/Alteração', '39': 'Liberação de Simulador', '40': 'Solicitação de Compra GERAL',
  '41': 'Lançamento de acordo comercial', '42': 'Lançamento de verbas', '43': 'Custo (inclusão/alteração)',
  '44': 'Contrato/Simulador', '45': 'Seguro', '47': 'Solicitações de 2 via de boleto', '48': 'Exclusão de lançamento',
  '49': 'Correção de lançamento', '50': 'Exclusão', '51': '2ªvia de boleto', '52': 'correção de lançamento',
  '53': 'Desconto em boleto', '54': 'Emissão de novo boleto', '55': 'Solicitação de hora extra / saída antecipada',
  '56': 'Revisão de cadastro', '57': 'Erro de faturamento (fiscal)', '58': 'Manutenção', '59': 'Solicitações Marketing',
  '60': 'Devoluções', '61': 'Indisponibilidade de Sistema', '62': 'Criação de monitoramentos', '63': 'Exclusão de notas nos portais',
  '64': 'Equipamento', '65': 'Manutenção', '67': 'Retirada de contabilização (contábil)', '70': 'reset de senha',
  '71': 'Solicitação troca de toner', '72': 'Opção de entrega do canhoto sumiu', '73': 'Fechamento do sistema',
  '74': 'ATUALIZAR VERSÃO PROSOFT', '75': 'Criação de Parceiros (Fornecedores)', '76': 'Tela código parceiro no 128',
  '77': 'segurança do trabalho', '78': 'Solicitação de Compra MANUTENÇÃO INDUSTRIAL', '79': 'Suporte',
  '81': 'Erro no faturamento', '83': 'vincular parcerio 29615 ao usuario PJ MIGUELAN', '85': 'Configuração de TOP (fiscal)',
  '87': 'Ajuste de Impostos (fiscal)', '88': 'Controladoria', '89': 'Ativação/Desativação de Parceiros',
  '91': 'Exclusão Nota/Portal de Vendas (fiscal)', '92': 'Ativação/Desativação de Produtos/Serviços',
  '93': 'Criação e revisão de Tipos de Negociação', '94': 'Criação de Produtos', '95': 'Exclusão de Título_Dep. Pessoal',
  '96': 'Solicitação de Compra FILIAIS', '97': 'Solicitação de Compra FROTA', '99': 'Solicitação de Compra MANUTENÇÃO PREDIAL',
  '100': 'EXCLUSÃO AJUSTE DE ESTOQUE'
};

// 3. Mapeamento de Setores (Se você tiver o seu próprio atualizado, pode substituir este)
export const SETORES_MAP: Record<string, string> = {
  '1': 'Administrativo',
  '2': 'Comercial',
  '3': 'Frota',
  '4': 'Logística',
  '5': 'Expedição',
  '6': 'Produção',
  '7': 'Contabilidade',
  '8': 'Marketing',
  '9': 'RH/DP',
  '10': 'Diretoria',
  '11': 'Financeiro',
  '12': 'Almoxarifado',
  '13': 'Suprimentos/Compras',
  '14': 'Tecnologia da Informação - TI',
  '15': 'SSMA',
  '16': 'Controle de Qualidade',
  '17': 'Recepção',
  '18': 'Manutenção',
  '19': 'Jotape',
  '20': 'Manutenção Predial',
  '21': 'Cadastros'
};