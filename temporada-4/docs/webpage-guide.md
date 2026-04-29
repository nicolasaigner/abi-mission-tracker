# Mission Tracker - Guia de Uso

## Visão Geral

O Mission Tracker é uma aplicação web para acompanhar seu progresso nas missões da **Temporada 4: Airport Hunt** do Arena Breakout: Infinite.

## Funcionalidades

### 📋 Acompanhamento de Missões
- Visualize todas as 60 missões da temporada
- Marque missões como completas ou pendentes
- Veja informações detalhadas de cada missão

### 🔍 Filtros e Busca
- **Busca**: Encontre missões por nome, número ou conteúdo
- **Status**: Filtre por "Todas", "Pendentes" ou "Completas"
- **Mapa**: Filtre por mapa específico (Farm, Vale, Northridge, etc.)
- **Dificuldade**: Filtre por nível de dificuldade

### 👁️ Modos de Visualização
- **Lista**: Visualização padrão com detalhes completos
- **Grade**: Cards em formato de grid
- **Compacto**: Visualização condensada para ver mais missões

### ⌨️ Atalhos de Teclado
- `Ctrl + F`: Focar na busca
- `Esc`: Fechar modal
- `Space`: Marcar/desmarcar missão selecionada
- `Enter`: Abrir detalhes da missão selecionada

### 💾 Persistência de Dados
- Seu progresso é salvo automaticamente no navegador (IndexedDB)
- Não é necessário login
- Os dados permanecem mesmo após fechar o navegador

## Como Usar

### Marcar uma Missão como Completa
1. Clique no checkbox à direita do card da missão, OU
2. Clique no card para abrir os detalhes e clique em "Marcar como Completa"

### Visualizar Detalhes da Missão
- Clique em qualquer parte do card (exceto o checkbox)
- Um modal abrirá com:
  - Informações do mapa
  - Itens obrigatórios (se houver)
  - Lista completa de tarefas
  - Missões relacionadas que podem ser feitas junto

### Navegação Rápida
- Use os botões numerados na barra de navegação rápida para pular para grupos de missões
- Missões completas ficam destacadas em verde

### Resetar Progresso
- Clique em "Resetar Progresso" no rodapé
- Confirme a ação no modal de confirmação
- ⚠️ Esta ação não pode ser desfeita

## Dicas para Jogar

### Otimize seu Tempo
- Use o filtro de mapa para ver todas as missões de um mapa específico
- Verifique a seção "Pode fazer junto com" para combinar missões
- Preste atenção aos itens obrigatórios antes de entrar em uma partida

### Configuração Recomendada
- Coloque a página no segundo monitor enquanto joga
- Use o modo de visualização "Compacto" para ver mais missões de uma vez
- Filtre por "Pendentes" para focar no que falta

## Requisitos Técnicos

- Navegador moderno (Chrome, Firefox, Edge, Safari)
- JavaScript habilitado
- IndexedDB suportado

## Estrutura do Projeto

```
webpage/
├── index.html          # Página principal
├── data/
│   └── missions.json   # Dados das missões
├── css/
│   ├── styles.css      # Estilos principais
│   ├── components.css  # Componentes (cards, modals, etc.)
│   └── responsive.css  # Estilos responsivos
└── js/
    ├── db.js           # Módulo de banco de dados
    ├── utils.js        # Funções utilitárias
    ├── ui.js           # Módulo de interface
    └── app.js          # Aplicação principal
```

## Créditos

- Guia de missões baseado no trabalho de **xSolitude**
- Arena Breakout: Infinite © More Fun Studios

---

*Última atualização: Janeiro 2026*
