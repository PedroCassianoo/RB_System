# RB_System
Sistema interno da Red Balloon Paulínia

## Histórico de Versões

### Versão 1.5 - Banco de dados (Atual)
- **Modelagem Relacional de Dados**: Criação do esquema SQL (`schema.sql`) e dados de semente (`seed.sql`) seguindo as melhores práticas do Supabase e PostgreSQL (chaves de identidade, nomenclatura minúscula snake_case e restrições rígidas).
- **Segurança via RLS**: Configuração de políticas de Row-Level Security restringindo acesso a usuários autenticados e otimizando performance das consultas.
- **Binding Dinâmico de Dados**: Conexão das tabelas e KPIs no front-end (`app.js` e `dashboard.html`) para recuperar informações do Supabase de forma assíncrona.
- **Lógica de Fallback Seguro**: Mecanismo que reverte automaticamente para a visualização dos dados mockados caso as tabelas na nuvem não estejam disponíveis, prevenindo quebras visuais.
- **Log de Cargas Integrado**: Ação de upload na aba Gestão de Dados agora insere e exibe novos logs em tempo real na tabela do Supabase.

### Versão 1.4 - Ajustes e melhorias (Detalhes)
- **Melhorias na Responsividade**: Grid do dashboard unificado para evitar duplicação de elementos HTML (Design Mobile-First).
- **Menu Drawer Mobile**: Menu hambúrguer lateral no mobile totalmente funcional, aproveitando a mesma sidebar do desktop que se transforma em gaveta deslizante.
- **Gráfico de Linha YTD**: Exibição dos rótulos de valores numéricos em posições otimizadas (corrigindo sobreposição de texto em azul/vermelho) e alinhamento do eixo X (meses) diretamente no SVG.
- **Visualização de Comparativos**: Barras de progresso de eventos (2025 vs 2026) ajustadas para mostrar contraste suave com preenchimento opaco de 2025, indicando o crescimento de 10% nas turmas do Farmer's Market de forma elegante.
- **Redirecionamento Inteligente de Login**: O portal de login agora verifica automaticamente se há uma sessão ativa no Supabase e redireciona o usuário para o dashboard sem necessidade de novo login.
- **Cache-Busting**: Atualizado o esquema de carregamento dos recursos adicionando queries `?v=1.4` para garantir o carregamento do código mais recente.

### Versão 1.3
- Adicionadas skills de Supabase, revisores de código e melhores práticas de PostgreSQL.
- Implementação de layouts alternativos e reestruturação do banco de dados local.

### Versão 1.2 - Integração do Farmers Market 2026 e correções
- Integração da aba de eventos com o relatório do Farmers Market 2026.
- Melhoria e estilização inicial dos cards de KPIs e NPS.

### Versão 1.1
- Integração básica com o Supabase Auth e gerenciamento de sessões de usuário.

### Versão 1.0
- Estruturação inicial do Portal de Resultados consolidado (Red Balloon).
