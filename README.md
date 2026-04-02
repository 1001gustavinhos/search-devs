# search-devs

Aplicação em React + TypeScript + Vite para buscar usuários do GitHub e explorar seus repositórios com paginação infinita e ordenação.

## Visão geral

O projeto foi construído como uma interface de busca de perfis do GitHub. A tela inicial permite pesquisar um username e navegar para uma rota compartilhável de perfil. A página de perfil exibe dados do usuário, links externos úteis e a lista de repositórios com carregamento incremental.

O foco principal foi entregar uma experiência responsiva, com visual consistente em mobile e desktop, usando Chakra UI v2 como base de componentes e um tema centralizado para manter padronização visual.

## Stack utilizada

- React 19
- TypeScript
- Vite
- Chakra UI v2
- TanStack Router
- Zod
- Octokit
- i18next e react-i18next
- lucide-react

## Estrutura do projeto

- `src/routes/home-page.tsx`: tela inicial de busca por usuário.
- `src/routes/profile-page.tsx`: página de perfil, busca do header, botão de contato e repositórios.
- `src/components/user-profile-card.tsx`: card com dados do usuário.
- `src/components/search-wordmark.tsx`: marca compartilhada `Search d_evs` usada na home e no header do profile.
- `src/routes/root-layout.tsx`: layout base da aplicação e ajustes de padding por rota.
- `src/theme.ts`: tokens globais, cores, radii, hover states e estilos base do Chakra.
- `src/services/github-service.ts`: integração com a API do GitHub via Octokit.
- `src/domain/*.ts`: modelos tipados com Zod para usuário e repositório.
- `src/i18n.ts`: textos da interface em português e inglês.

## Fluxo da aplicação

1. O usuário informa um username na home.
2. A aplicação valida o username e consulta a API do GitHub.
3. Se o usuário existir, navega para `/profile/:username`.
4. A página de perfil carrega os dados do usuário e a lista de repositórios.
5. Os repositórios são carregados em blocos de 10 itens com infinite scroll.
6. O usuário pode alterar ordenação e direção da listagem, recarregando os dados automaticamente.

## Práticas utilizadas

### Componentização

Os blocos repetidos foram isolados em componentes menores quando isso ajudou na leitura sem mudar layout. Exemplo: a marca `Search d_evs` foi centralizada em um componente compartilhado para evitar duplicação entre home e profile.

### Tema centralizado

As cores, hover states, radii e comportamento-base dos botões foram consolidados em `src/theme.ts`. Isso reduz repetição de estilo espalhada pelos arquivos de rota.

### Tipagem e modelagem

Os dados retornados pela API foram modelados com Zod para manter contratos claros entre aplicação e backend.

### i18n

A interface usa i18next para suportar português e inglês. Os textos estão centralizados em `src/i18n.ts`.

### Responsividade

A interface foi pensada para mobile e desktop. O comportamento visual muda por breakpoint, mas sem alterar a lógica de negócio.

### Infinite scroll

A lista de repositórios carrega novos itens automaticamente quando o usuário chega próximo ao fim da lista. O tamanho da página é 10, conforme definido no desafio.

## Funcionalidades

- Busca de usuário do GitHub a partir da home.
- Rota compartilhável de perfil em `/profile/:username`.
- Exibição de avatar, nome, login e dados públicos do perfil.
- Exibição de website/blog e Twitter quando disponíveis.
- Lista de repositórios com ordenação e direção.
- Infinite scroll para carregar repositórios aos poucos.
- Interface responsiva para mobile e desktop.

## Botão de contato

O botão de contato foi tratado como um ponto provisório de implementação.

Estado atual:

- existe apenas no desktop;
- abre o perfil público do GitHub do usuário;
- foi mantido como solução temporária porque não havia orientação funcional final no desafio.

Observação importante:

- o comportamento do botão deve ser revisado antes da entrega final, caso haja uma regra específica de produto para ele.

## Como executar

```bash
npm install
npm run dev
```

Para gerar a versão de produção:

```bash
npm run build
```

Para rodar o linter:

```bash
npm run lint
```

## Verificações feitas

- TypeScript.
- Build de produção.
- Revisão responsiva das telas principais.

## Decisões técnicas

- Chakra UI v2 foi usado como base visual para manter consistência e acessibilidade.
- TanStack Router foi usado para navegação entre home e profile.
- Octokit foi usado para comunicação com a API do GitHub.
- Zod foi usado para validar os formatos de usuário e repositório.
- A marca `Search d_evs` foi extraída para um componente compartilhado para manter consistência entre telas.
- Os ícones foram implementados com `lucide-react` em vez dos ícones do Figma por falta de acesso ao MyIcons no momento da implementação.
- Sei que é possível exportar os ícones diretamente do Figma, mas a escolha pelo Lucide foi intencional para manter padrão visual e velocidade de desenvolvimento durante o desafio.
