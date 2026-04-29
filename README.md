# ABI Mission Tracker

Tracker de missões para **Arena Breakout: Infinite** em português (PT-BR).  
Cada temporada tem seu próprio tracker; este repositório serve como base para todas elas.

**Acesse:** [github.aigner.com.br/abi-mission-tracker](https://github.aigner.com.br/abi-mission-tracker)

---

## Temporadas disponíveis

| Temporada | Nome | Status | Tecnologia |
|---|---|---|---|
| [T4](https://github.aigner.com.br/abi-mission-tracker/temporada-4/) | Caçada no Aeroporto | Encerrada | Vanilla HTML/CSS/JS |
| [T5](https://github.aigner.com.br/abi-mission-tracker/temporada-5/) | Vale Distorcido | Ativa | Angular 21 |

---

## Estrutura do repositório

```
abi-mission-tracker/
├── index.html              # Landing page (escolha de temporada)
├── temporada-4/
│   ├── docs/               # Site estático (HTML + CSS + JS)
│   └── images/             # Imagens de itens e equipamentos
└── temporada-5/
    ├── src/                # Código Angular
    ├── public/             # Assets estáticos (missoes.json, imagens, SVGs)
    └── angular.json
```

O deploy é feito automaticamente via GitHub Actions para o GitHub Pages a cada push na `main`.

---

## Desenvolvimento local

### Temporada 4 (vanilla)

Abra `temporada-4/docs/index.html` direto no navegador — sem servidor necessário.

### Temporada 5 (Angular)

```bash
cd temporada-5
npm install
npm start          # http://localhost:4200
npm run build      # build de produção → dist/
npm test           # testes unitários (Vitest)
```

> O `baseHref` local é `./` (padrão no `angular.json`).  
> No CI, o build usa `--base-href /abi-mission-tracker/temporada-5/`.

---

## Adicionando uma nova temporada

1. Crie `temporada-N/` na raiz do repositório.
2. Se for Angular: `cd temporada-N && ng new . --style=scss --ssr=false` e ajuste o `angular.json` para `outputPath.browser = ""`.
3. Adicione `temporada-N/.gitignore` com `/dist` e `/node_modules`.
4. Em `.github/workflows/deploy.yml`, adicione os steps de build e cópia:
   ```yaml
   - name: Build Angular (Temporada N)
     run: npx ng build --base-href /abi-mission-tracker/temporada-N/
     working-directory: temporada-N

   # no step "Assemble site":
   cp -r temporada-N/dist/. _site/temporada-N
   ```
5. Adicione o card da nova temporada no `index.html` raiz.
6. Coloque o link no `index.html` da temporada anterior (se aplicável).

---

## Deploy

O workflow `.github/workflows/deploy.yml` executa automaticamente ao fazer push na `main`:

1. Faz `npm ci` + `ng build --base-href ...` para cada temporada Angular.
2. Copia o site estático de cada temporada para `_site/`.
3. Faz upload e publica no GitHub Pages via `actions/deploy-pages`.

Para acionar manualmente: **Actions → Deploy to GitHub Pages → Run workflow**.

---

## Reportar problema

Encontrou algo errado no tracker? Use uma das opções:

- **[Abrir issue](https://github.com/nicolasaigner/abi-mission-tracker/issues/new/choose)** — há templates para bug e sugestão.
- O botão **"Reportar problema"** dentro da própria aplicação abre o formulário diretamente.

---

## Contribuindo

Contribuições são bem-vindas! O processo é simples:

1. Fork o repositório
2. Crie uma branch: `git checkout -b fix/nome-do-fix`
3. Faça suas alterações e commite: `git commit -m "fix: descrição"`
4. Abra um Pull Request para a `main`

**Tipos de contribuição mais comuns:**
- Correção de nome de missão, localização ou objetivo
- Tradução de termos do jogo
- Correção de bug na interface
- Sugestão de nova funcionalidade

Consulte o [CLAUDE.md](./CLAUDE.md) para entender a arquitetura do projeto antes de contribuir.

---

## Créditos

- **xSolitude** — planilha e vídeo de missões da T5
- **Wesley Pyburn (TroubleChute)** — mapas interativos em [maps.tcno.co/abi](https://maps.tcno.co/abi)
- **BruKing** e comunidade — suporte e informações

---

## Licença

[MIT](./LICENSE)
