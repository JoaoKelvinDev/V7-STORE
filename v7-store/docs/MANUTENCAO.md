# Guia de manutenção — V7 Store

Este guia descreve a estrutura atual. O [briefing original](BRIEFING_ORIGINAL.md) foi preservado integralmente como referência dos requisitos iniciais.

## Organização do código

| Pasta | Responsabilidade |
|---|---|
| `src/app/router/` | Rotas da aplicação |
| `src/app/providers/` | Carrinho e notificações |
| `src/components/layout/` | Cabeçalho, rodapé e layout das páginas |
| `src/components/shared/` | Card de produto, seleção de variantes e quantidade |
| `src/components/ui/` | Botões, inputs, badges e outros componentes básicos |
| `src/features/catalog/` | Início, catálogo e página não encontrada |
| `src/features/product/` | Detalhes e galeria do produto |
| `src/features/cart/` | Revisão e edição do carrinho |
| `src/features/checkout/` | Dados do cliente e prévia da mensagem |
| `src/data/` | Produtos, categorias e configurações da loja |
| `src/styles/` | Cores da marca, estilos e animações |
| `tests/` | Testes de regressão |

As páginas e os componentes compartilhados usam nomes em PascalCase, como `ProductCard.tsx`. Os arquivos básicos em `components/ui/` usam minúsculas, como `button.tsx`, `input.tsx` e `badge.tsx`. Respeite a capitalização dos imports para funcionar também em Linux.

## Fotos e logo

Os arquivos recebidos foram renomeados e movidos para `assets/originals/`. Seu conteúdo foi preservado, sem cortes, filtros ou recompressão. As cópias em `public/assets/` são servidas pelo site. Manter essas pastas separadas permite preparar versões otimizadas para a web no futuro sem alterar os originais.

| Nome recebido | Original preservado em `assets/originals/` | Cópia usada pelo site em `public/assets/` |
|---|---|---|
| `CAMISA 1.jpeg` | `products/polo-verde-oliva/01.jpeg` | `products/polo-verde-oliva/01.jpeg` |
| `CONJUNTO 1 .jpeg` | `products/camiseta-amarela/01.jpeg` | `products/camiseta-amarela/01.jpeg` |
| `WhatsApp Image 2026-11-16 at 14.35.40 (2).jpeg` | `products/camiseta-amarela/02.jpeg` | `products/camiseta-amarela/02.jpeg` |
| `CONJUNTO 2 .jpeg` | `products/camiseta-caramelo/01.jpeg` | `products/camiseta-caramelo/01.jpeg` |
| `LOGO V7.jpeg` | `brand/logo-v7.jpeg` | `brand/logo-v7.jpeg` |

O favicon fica em `public/assets/brand/favicon.svg`.

### Adicionar uma foto

1. Guarde o arquivo original em `assets/originals/products/<slug-do-produto>/`.
2. Coloque a versão destinada ao site em `public/assets/products/<slug-do-produto>/`.
3. Nomeie as fotos na ordem da galeria: `01.jpeg`, `02.jpeg` e assim por diante. Use a extensão real do arquivo; não altere apenas a extensão para simular conversão.
4. Atualize `images` em `src/data/catalog.ts`, por exemplo:

```ts
images: [
  '/assets/products/camiseta-amarela/01.jpeg',
  '/assets/products/camiseta-amarela/02.jpeg',
],
```

A primeira imagem é a capa do card. As outras aparecem na galeria. Fotos com calçados e acessórios não comprovam a venda de um kit; mantenha a associação com a peça cadastrada.

Os cards usam capas quadradas para manter a grade uniforme no celular. O campo opcional `cardImagePosition` ajusta o foco da capa, por exemplo `'center 42%'`, usando CSS `object-position`. Ajuste o enquadramento para destacar a peça; o arquivo original e a imagem completa da página do produto são preservados.

## Produtos e disponibilidade

Edite `src/data/catalog.ts`:

- `id` e IDs de variantes identificam os itens do carrinho; mantenha-os estáveis ao editar produtos existentes.
- `slug` define o endereço do produto e o nome da pasta de fotos.
- `priceCents` recebe o preço em centavos, ou `null` quando estiver pendente.
- `featured: true` inclui o produto em “Novidades”.
- `active: false` retira o produto do catálogo.
- Cada variante registra cor, tamanho e `availability: 'available'` ou `'unavailable'`.

Não presuma composição, preço, estoque ou venda separada de objetos que aparecem nas fotos. Os preços, tamanhos e disponibilidade já cadastrados fazem parte da demonstração e precisam de confirmação comercial antes de uso real.

## Contato e checkout

Edite `src/data/settings.ts`:

- `storePhoneLabel` contém o contato informado pela loja: `+55 (89) 9409-5340`. Altere esse valor para atualizar o telefone mostrado e os links de contato.
- `whatsappNumber` é derivado de `storePhoneLabel`, removendo a formatação: `558994095340`. O rodapé e o checkout usam esse número nos links do WhatsApp.
- `demoPhoneLabel` é o texto de fallback quando o WhatsApp não está configurado. Se `whatsappNumber` for `null`, o envio fica desabilitado e a prévia da mensagem continua copiável.
- `instagramUrl` controla o link do Instagram no rodapé. Confirme o perfil antes de publicar.
- `fulfillmentModes` determina as modalidades exibidas. A configuração atual contém retirada; confirme a modalidade com a loja antes de uso real.

O cliente confirma o envio no WhatsApp. O catálogo não registra vendas em servidor, não recebe pagamentos e não reduz estoque automaticamente. Dados pessoais do checkout não são armazenados no carrinho persistido.

O fluxo de finalização, as validações e as alternativas para reabrir ou copiar a mensagem estão documentados em [Fluxo de pedidos](PEDIDOS.md). A mensagem e a validação ficam em `src/features/checkout/order.ts`; a apresentação do resumo e os estilos do checkout ficam nessa mesma pasta.

## Estilos e animações

As cores e os movimentos ficam em `src/styles/globals.css`; os tokens de Tailwind ficam em `tailwind.config.ts`. A identidade usa a logo original, preto, azul e branco/prata.

Os movimentos de clique, menu e navegação respeitam `prefers-reduced-motion`. Evite adicionar animações contínuas que dificultem a leitura ou a escolha das peças.

O rodapé institucional aparece apenas na página inicial. Cada card é um único link para o produto anunciado; o retorno ao catálogo preserva os filtros usados antes da abertura. Links diretos para `/produto/<slug>` também abrem somente os detalhes da peça.

No celular, a página do produto prioriza nome, preço e foto, com seletores de cor e tamanho lado a lado. A barra de adicionar ao carrinho fica fixa na parte inferior e respeita a área segura do aparelho; as notificações aparecem acima dela.

## Verificação e arquivos gerados

Execute a partir de `v7-store/`:

```powershell
npm run lint
npx tsc -b
npx tsc -p tsconfig.test.json
npm test
npm run build
```

Confira também o fluxo de catálogo, produto, carrinho e checkout no navegador. Teste imagens, links de retorno e layouts de celular.

O build gera `dist/`. Os arquivos de cache e as declarações de configuração do TypeScript ficam em `node_modules/.cache/typescript/`, evitando arquivos `.js`, `.d.ts` e `.tsbuildinfo` soltos na raiz. As configurações editáveis continuam sendo `vite.config.ts`, `vitest.config.ts` e `tsconfig*.json`.

O `.gitignore` na raiz do workspace exclui dependências, builds, caches e configurações locais. Não inclua credenciais em código, documentação ou arquivos públicos.
