# V7 Store

Catálogo de demonstração em React, TypeScript e Vite. Produtos e disponibilidade são dados locais; o carrinho é persistido no navegador. Sem backend, login ou pagamento online.

## Estrutura

```text
v7-store/
├── assets/originals/   # Fotos recebidas e logo, preservadas
├── docs/              # Briefing original e guia de manutenção
├── public/assets/     # Imagens e favicon usados pelo site
├── src/
│   ├── app/           # Rotas e providers de carrinho/notificações
│   ├── components/    # Layout, componentes compartilhados e UI
│   ├── data/          # Catálogo e configurações da loja
│   ├── features/      # Início/catálogo, produto, carrinho e checkout
│   ├── lib/           # Utilitário de classes para os componentes de UI
│   ├── styles/        # Estilos, cores e animações
│   ├── types/         # Tipos do domínio
│   └── utils/         # Formatação e validações
├── tests/             # Testes de regressão
└── README.md
```

`node_modules/` contém dependências e caches; `dist/` é gerada pelo build. Não edite essas pastas manualmente.

## Executar

```powershell
npm install
npm run dev
```

Execute os comandos dentro desta pasta. Abra `http://localhost:3000` (ou a porta indicada pelo Vite).

## Verificar

```powershell
npm run lint
npx tsc -b
npx tsc -p tsconfig.test.json
npm test
npm run build
```

Os testes cobrem navegação de produtos, filtros combinados, carrinho, persistência em StrictMode, storage bloqueado, indisponibilidade, preços pendentes, imagens e a prévia do pedido.

## Dados da loja

- Edite produtos, categorias e variantes em `src/data/catalog.ts`. As imagens ficam em `public/assets/products/`. Use `priceCents: null` para preços pendentes.
- Cada produto tem uma pasta com seu slug e imagens numeradas: `public/assets/products/camiseta-amarela/01.jpeg`. No catálogo, o caminho começa com `/assets/`, sem o prefixo `public/`.
- Edite contato e modalidades em `src/data/settings.ts`. O WhatsApp deve conter DDI, DDD e número, somente com dígitos. Enquanto estiver `null`, o envio fica desabilitado e a prévia pode ser copiada.
- O telefone `(00) 00000-0000` é apenas uma informação visual de demonstração. Os dados comerciais do catálogo precisam de confirmação antes de uso real.
- A loja não envia mensagens automaticamente: o cliente confirma o envio no WhatsApp.

O arquivo `vercel.json` configura o fallback das rotas para `index.html` na Vercel, permitindo abrir produtos, catálogo, carrinho e checkout diretamente ou recarregar essas páginas.

## Documentação

- [Guia de manutenção](docs/MANUTENCAO.md): mapa de imagens, convenções, produtos, contato e validação.
- [Briefing original](docs/BRIEFING_ORIGINAL.md): documento recebido inicialmente, preservado como referência histórica. O exemplo de estrutura e as etapas de aprovação refletem aquele planejamento inicial; consulte este README para a organização atual.
