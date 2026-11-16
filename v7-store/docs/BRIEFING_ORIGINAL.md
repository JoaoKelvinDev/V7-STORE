# AGENTS.md — V7 Store | Catálogo Digital (MVP de Demonstração)

> **Instruções para Claude Code.** Este documento é a fonte principal de requisitos, escopo e critérios de aceite. Antes de alterar arquivos, inspecione o repositório, apresente um plano conciso e a estrutura prevista. Solicite aprovação do desenvolvedor antes da implementação. Não presuma informações comerciais nem acrescente funcionalidades fora do escopo.

## 1. Contexto e objetivo do negócio

- **Marca:** V7 Store.
- **Segmento:** moda masculina, com peças de vestuário e acessórios/calçados conforme materiais disponibilizados.
- **Assinatura da marca:** “Vista seu estilo”.
- **Cenário:** a loja divulga novidades em stories do Instagram e status do WhatsApp. Os clientes perguntam individualmente por preço, tamanho, cor e disponibilidade.
- **Solução:** catálogo digital responsivo, com busca, categorias, detalhes de produtos, seleção de variações, carrinho funcional e geração de pedido para envio manual pelo cliente ao WhatsApp da loja.
- **Critério de negócio:** reduzir perguntas repetitivas e organizar a intenção de compra antes de iniciar a conversa no WhatsApp.
- **Natureza desta entrega:** demonstração comercial funcional, não uma operação completa de e-commerce.

## 2. Decisões aprovadas e limites do escopo

| Item | Decisão |
|---|---|
| Painel administrativo | **Não incluir** na V1 |
| Backend, APIs próprias, banco de dados | **Não incluir** na V1 |
| Supabase, autenticação | **Não incluir** na V1 |
| Estoque | Disponibilidade manual por combinação de variações; dados mantidos localmente |
| Catálogo | Funcional, com navegação, busca e filtros |
| Carrinho | Funcional e persistido localmente no navegador |
| Checkout | Geração de texto + abertura do WhatsApp com mensagem pré-preenchida |
| Pagamento online | Fora do escopo |
| Pedido registrado em servidor | Fora do escopo |
| Deploy | Preparar para hospedagem estática; publicar apenas mediante autorização |

**Não implementar:** login, dashboard, CRUD administrativo, gerenciamento de vendas, baixa automática de estoque, PIX automático, gateway, cálculo real de frete, WhatsApp Cloud API, chatbot, envio de mensagem automático, avaliações inventadas, contadores falsos ou integrações externas sem aprovação.

## 3. Identidade visual — referência obrigatória: logo original

A logo fornecida mostra um grande **V** branco/prateado, **7** em azul intenso, **coroa azul**, fundo **preto**, tipografia **STORE** em prata/branco, traços azuis e cabide branco. A linguagem visual é masculina, impactante e de contraste alto.

### Paleta de implementação

As cores abaixo são **aproximações operacionais extraídas visualmente e por amostragem da imagem enviada**, não um manual oficial de marca. Usar tokens e verificar o resultado na tela.

| Token | HEX | Uso |
|---|---|---|
| `--color-bg` | `#08090C` | Fundo escuro principal |
| `--color-surface` | `#141820` | Cards, cabeçalho e superfícies |
| `--color-surface-raised` | `#1D2430` | Hover, painéis, overlays |
| `--color-brand` | `#087BFA` | Azul V7: botões, links, seleção |
| `--color-brand-hover` | `#0067DF` | Hover e estados ativos |
| `--color-brand-deep` | `#094CBE` | Gradientes discretos e detalhes |
| `--color-text` | `#F7F9FC` | Textos principais, branco/prata |
| `--color-text-muted` | `#B7C1D1` | Textos secundários |
| `--color-border` | `#2B3442` | Separadores e contornos |
| `--color-danger` | `#E75A5A` | Erros e indisponibilidade |

- **Regra 80/15/5 aproximada:** base neutra escura predominante; branco/prata nos conteúdos; azul como acento de destaque (não precisa ser matematicamente exato).
- Evitar dourado como cor principal: aparece em outras peças gráficas, mas **não é dominante na logo original enviada**.
- Não usar gradientes metálicos intensos, brilhos exagerados ou sombras neon em todos os componentes. A logo já é expressiva; a interface deve ser limpa, comercial e confiável.
- Tipografia: escolher fonte contemporânea e legível (ex.: Inter/Manrope); títulos com peso forte; não replicar tipografias extravagantes da imagem no corpo do site.
- Utilizar **o arquivo de logo verdadeiro**, preservando proporções e sem redesenhá-lo com IA. Se tiver fundo preto, integrar corretamente sobre fundo escuro; não remover o fundo de maneira destrutiva.
- Não inserir a arte completa com slogans minúsculos no header: em telas pequenas, priorizar um recorte adequado do logo ou assinatura textual “V7 STORE”, mantendo a arte original visível onde couber.
- Garantir contraste acessível e estados de foco visíveis.

### Direção de interface

- Layout **mobile-first**, principalmente para tráfego vindo de Instagram e WhatsApp.
- Header compacto com logo, ícone de busca e carrinho com quantidade.
- Hero curto com texto da marca (“Vista seu estilo”), CTA “Ver catálogo” e foto real se existir uma apropriada.
- Filtros por categoria e disponibilidade; grade de produtos limpa, com fotos em proporções consistentes.
- Cards: foto, nome, preço **apenas se confirmado**, disponibilidade, botão para detalhes/adicionar (conforme seleção necessária).
- Páginas de produto: galeria, nome, preço, variações, quantidade, disponibilidade e CTA de carrinho.
- Carrinho em página própria e/ou drawer acessível; total e subtotais calculados quando existirem preços conhecidos.
- Rodapé discreto com links reais e dados confirmados.

## 4. Materiais visuais disponibilizados

Foram enviados: 1 arte de logo e 4 fotografias de produtos/cenas, incluindo:

1. Polo/camisa masculina em tom verde-oliva, fotografada sobre mesa (há outra peça parcialmente visível ao fundo).
2. Camiseta amarela estampada fotografada com chinelos pretos e carteira. A foto inclui **múltiplos artigos** e não comprova que sejam vendidos como kit.
3. Outra foto da camiseta amarela e chinelos pretos, em ambiente simples.
4. Camiseta marrom/caramelo com chinelos claros, slides pretos e acessório/carteira. A foto inclui **múltiplos artigos**.

**Regras para catalogação:**
- Não presumir preço, marca comercial, tamanho, composição têxtil, número de unidades nem disponibilidade.
- Não transformar produtos que aparecem juntos em “kit” sem informação da loja.
- Fotos repetidas do mesmo produto devem virar **galeria do mesmo produto**, não duplicatas de listagem.
- Não confundir elementos decorativos ou outros objetos da foto com itens à venda.
- Solicitar/registrar confirmação de quais itens são comercializados separadamente.
- Preservar fotos originais e gerar versões web otimizadas (`webp`/`avif` se viável), sem alterar a aparência real do produto.
- Se os arquivos não estiverem no repositório, **não inventar caminhos existentes**: indicar ao desenvolvedor onde colocá-los, por exemplo `public/assets/brand/` e `public/assets/products/`.
- Não baixar imagens de outros comércios como se fossem produtos da V7 Store.

## 5. Jornada do usuário

1. O visitante entra pelo link da bio, story ou WhatsApp.
2. Encontra as novidades/categorias e a busca.
3. Acessa o produto, visualiza fotos e detalhes.
4. Seleciona a **variação disponível** (ex.: cor e tamanho), quando aplicável.
5. Define quantidade, valida seleção e adiciona ao carrinho.
6. Continua comprando ou abre o carrinho.
7. Confere produtos, variações, quantidades, valores confirmados e eventuais itens indisponíveis.
8. Informa **nome** e, se a loja confirmar que oferece essas modalidades, escolhe **retirada** ou **entrega**. Campos complementares só aparecem conforme necessidade validada.
9. Clica em “Enviar pedido pelo WhatsApp”. O site abre um link oficial `https://wa.me/<numero>?text=<textoCodificado>` com os detalhes formatados.
10. **O cliente deve confirmar o envio no WhatsApp.** O catálogo não marca venda concluída nem reduz estoque.

### Modelo de mensagem (adaptável)

```
Olá! Gostaria de consultar/fazer este pedido na V7 Store:

Cliente: [nome]

1. [produto] — [cor] — [tamanho]
   Quantidade: [N]
   Preço unitário: [valor confirmado, se houver]

2. ...

Subtotal: [somente se todos os preços existirem]
Entrega/retirada: [quando configurado]

Podem confirmar a disponibilidade e o valor final?
```

Se algum produto não tiver preço, **não apresentar total numérico enganoso**; informar “valor a confirmar com a loja”. Se o WhatsApp real ainda não tiver sido fornecido, usar uma configuração explícita pendente e **desabilitar o CTA de envio real**, exibindo uma prévia copiável da mensagem na demonstração. Jamais inventar número.

## 6. Modelo de domínio local

```ts
type Availability = 'available' | 'unavailable';

type Category = {
  id: string;
  slug: string;
  name: string;
};

type Product = {
  id: string;
  slug: string;
  name: string;
  description?: string;
  categoryId: string;
  priceCents: number | null; // BRL; null = preço não confirmado
  images: string[];
  featured: boolean;
  active: boolean;
  variants: ProductVariant[];
};

type ProductVariant = {
  id: string;
  color?: string;
  size?: string;
  availability: Availability;
};

type CartItem = {
  productId: string;
  variantId: string;
  quantity: number;
};

type StoreSettings = {
  storeName: 'V7 Store';
  slogan: 'Vista seu estilo';
  whatsappNumber: string | null; // apenas dígitos DDI+DDD+número
  instagramUrl: string | null;
  fulfillmentModes: Array<'pickup' | 'delivery'>;
};
```

**Nota:** itens sem variação podem utilizar uma variação padrão. A disponibilidade é manual, não uma garantia de estoque em tempo real. Guardar no carrinho somente IDs e quantidade; ao renderizar, resolver dados atualizados do catálogo. Não armazenar dados pessoais no `localStorage`.

## 7. Rotas da aplicação

- `/` — início, destaques, categorias e novidades.
- `/catalogo` — catálogo completo, filtros e busca.
- `/produto/:slug` — detalhes do produto.
- `/carrinho` — itens, quantidades, remoção e subtotal condicional.
- `/finalizar` — revisão, identificação mínima e ação WhatsApp.
- `*` — tela 404 com retorno ao catálogo.

As rotas devem suportar atualização direta/deep link na hospedagem estática por configuração de fallback para SPA.

## 8. Arquitetura e ferramentas

- **Frontend:** React + TypeScript + Vite.
- **Estilos:** Tailwind CSS + componentes acessíveis reutilizáveis; shadcn/ui somente onde trouxer benefício real.
- **Rotas:** React Router.
- **Dados:** módulo local tipado `src/data/` com fixtures claramente identificadas; sem requisição a banco.
- **Estado:** carrinho por Context + reducer ou solução leve equivalente; persistência `localStorage` versionada, com validação ao ler.
- **Formulários:** validação de campos essenciais; evitar dependências desnecessárias.
- **Testes:** Vitest + Testing Library para lógica de carrinho, variações e mensagem; teste de fluxo manual em mobile.
- **Build e deploy:** aplicação estática pronta para Vercel, sem executar deploy antes de autorização.
- **Segurança:** não incorporar segredos no frontend; URL do WhatsApp construída por `URLSearchParams`/`encodeURIComponent`; sanitizar textos exibidos; validação de entrada; dependências atualizadas; sem HTML arbitrário.

### Estrutura sugerida

```text
v7-store/
├── public/
│   └── assets/
│       ├── brand/
│       └── products/
├── src/
│   ├── app/
│   │   ├── router/
│   │   └── providers/
│   ├── components/
│   │   ├── ui/
│   │   ├── layout/
│   │   └── shared/
│   ├── features/
│   │   ├── catalog/
│   │   ├── product/
│   │   ├── cart/
│   │   └── checkout/
│   ├── data/
│   ├── services/
│   │   └── whatsapp/
│   ├── types/
│   ├── utils/
│   ├── styles/
│   ├── App.tsx
│   └── main.tsx
├── tests/
├── AGENTS.md
├── README.md
└── package.json
```

Não criar diretórios vazios apenas para preencher a árvore: adaptar ao tamanho real do código. Manter componentes de apresentação separados de lógica de negócio.

## 9. Estados e regras de UX

- Exibir estados vazios, erro de rota, ausência de resultados, imagem indisponível e carrinho vazio.
- Não permitir adicionar variante esgotada ao carrinho.
- Se uma variante antes adicionada ficar indisponível, avisar e impedir seu envio no checkout até remoção/ajuste.
- Não permitir quantidade zero/negativa; evitar duplicação de linhas quando a mesma variante for adicionada novamente.
- Carrinho deve sobreviver ao refresh do navegador sem quebrar após alteração de catálogo.
- Acessibilidade: labels, navegação por teclado, estados de foco, textos alternativos e feedbacks acessíveis.
- Performance: lazy loading, dimensões de imagens, evitar imagens gigantes em grid e priorizar Core Web Vitals.
- Responsividade: testar larguras de 320 px, 375 px, 768 px e desktop.
- Demonstrar funcionalidades sem simular avaliações, vendas, estoque em tempo real ou informações da empresa não fornecidas.

## 10. Etapas de implementação e pontos de aprovação

**Etapa 0 — Auditoria e planejamento (AGORA):**
1. Ler este documento integralmente.
2. Inspecionar os arquivos reais do repositório e identificar logos/fotos disponíveis.
3. Listar informações faltantes: WhatsApp real, preços, tamanhos, cores, modalidades de entrega, associação correta das imagens aos itens.
4. Propor árvore final do projeto, pacotes e arquitetura de componentes.
5. Apresentar plano incremental e riscos, **sem escrever código** até o desenvolvedor aprovar.

**Etapa 1 — Fundação visual:** configurar Vite, estilos, tokens da marca, tipografia, layout e rotas.

**Etapa 2 — Catálogo:** preparar dados locais, galerias, categorias, busca e filtros, com informações reais ou campos explicitamente pendentes.

**Etapa 3 — Produto e carrinho:** variantes, seleção, disponibilidade, quantidades, subtotal e persistência.

**Etapa 4 — Checkout WhatsApp:** revisão, dados mínimos, geração de texto, prévia e CTA condicionado ao número válido configurado.

**Etapa 5 — Qualidade e entrega:** testes automatizados, revisão mobile, performance, acessibilidade, README, build e verificação funcional.

Solicitar aprovação do desenvolvedor antes de avançar a cada etapa significativa. Não implementar funcionalidades de etapas futuras antecipadamente.

## 11. Critérios de aceite da demonstração

- Identidade visual coerente com a logo preta, azul, branca/prateada da V7 Store.
- Site utilizável em celular sem rolagem horizontal.
- Fotos reais corretamente associadas aos produtos, sem inventar dados comerciais.
- Busca/categorias funcionam sobre a base local.
- Detalhes mostram apenas variações existentes; indisponíveis não podem ser compradas.
- Carrinho soma quantidades corretamente e persiste após atualização.
- Preços desconhecidos nunca são convertidos em R$ 0,00 nem em totais fictícios.
- Checkout gera mensagem organizada com os itens corretos; URL codificada corretamente.
- Quando não houver número real, o sistema não redireciona para contato inventado.
- Sem painel, backend, banco, autenticação ou pagamentos.
- `npm run build` executa sem erros e testes relevantes passam.
- README documenta como adicionar produtos, atualizar disponibilidade e configurar WhatsApp.

## 12. Primeira resposta esperada do Claude Code

**Antes de executar qualquer alteração:**

1. Resuma o entendimento do objetivo comercial e do escopo V1.
2. Apresente o diagnóstico do repositório encontrado (sem presumir arquivos existentes).
3. Descreva a arquitetura proposta e a estrutura dos arquivos.
4. Identifique dados comerciais e imagens ausentes.
5. Liste dependências essenciais e riscos técnicos.
6. Proponha a ordem de implementação.
7. Encerre solicitando aprovação explícita para iniciar a Etapa 1.

**Não comece a codificar na primeira resposta.**
