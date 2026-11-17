# Importação de v7-storefront-refresh

- Origem: [JoaoKelvinDev/v7-storefront-refresh](https://github.com/JoaoKelvinDev/v7-storefront-refresh).
- Branch: `main`.
- Commit utilizado: [`b3d8866612cb78e025445051ad36147561de0605`](https://github.com/JoaoKelvinDev/v7-storefront-refresh/commit/b3d8866612cb78e025445051ad36147561de0605).
- Data da importação: 17/11/2026.

O repositório completo foi clonado em `.imports/v7-storefront-refresh/`, na raiz do workspace. A cópia mantém o código original para comparação; essa pasta não entra nos commits nem no build da loja.

## O que foi trazido

O front-end da origem concentra-se em `src/routes/index.tsx`, `src/styles.css` e no carregamento das fontes em `src/routes/__root.tsx`. A loja recebeu a abertura com a logo, o cabeçalho, a faixa animada, as novidades, os cards de coleção, a seção da marca e o rodapé, incluindo suas animações.

| Efeito da origem | Implementação local |
| --- | --- |
| Entrada da abertura | `refresh-fade-up`, 900 ms e atrasos de 150–450 ms |
| Logo flutuante | `refresh-float`, 6 s |
| Selo giratório | `refresh-spin`, 18 s |
| Brilho orgânico | `refresh-blob`, 10 s |
| Faixa contínua | `refresh-marquee`, 22 s |
| Entrada por rolagem | `useScrollReveal` e transição de 900 ms |
| Imagem dos cards | Ampliação no hover e acesso aos detalhes |
| Coleções | Preenchimento, deslocamento e indicação de navegação |
| Cabeçalho | Fundo e espaçamento mudam depois de 20 px de rolagem |

## Adaptações para este projeto

A referência é uma landing page em TanStack Start, React 19 e Tailwind 4. O projeto local possui catálogo, carrinho e checkout em React Router, React 18 e Tailwind 3. Foram adaptados os componentes visuais e os estilos para essas versões; não foi necessário trocar o framework ou instalar dependências.

- Os botões de detalhes da referência não tinham navegação. Agora abrem a peça correspondente.
- O botão principal abre `/catalogo`. Coleções abrem `/catalogo?categoria=...`, com os filtros reais.
- Calçados e acessórios ainda não possuem produtos locais; mostram o estado vazio e a ação de limpar filtros.
- As imagens dos produtos usam `public/assets/products/`, em vez de depender de `v7-store.vercel.app`.
- A logo usa `public/assets/brand/logo-v7.jpeg`, substituindo o endereço `/__l5e/assets-v1/...`, exclusivo do Lovable.
- O cabeçalho inclui acesso ao carrinho e menu para celular. O rodapé e a história da marca aparecem somente na página inicial.
- Foram preservadas as variantes, os preços, a persistência do carrinho, o retorno ao catálogo filtrado e a prévia do pedido.
- Os movimentos respeitam a preferência de movimento reduzido e podem ser pausados na faixa. Sem suporte ao observer, o conteúdo aparece normalmente.

Os componentes de UI que a landing page não utiliza, o servidor SSR, os arquivos gerados e a infraestrutura do Lovable permanecem no clone de referência. Não são necessários para executar o front-end importado na loja.

## Cópia de segurança

O estado local anterior foi copiado para `.backups/before-github-refresh-2026-11-17T17-39-52-027Z/`, incluindo o código, as imagens, os testes e a documentação. Dependências, arquivos de ambiente e caches foram excluídos. A pasta de backup é local e ignorada pelo Git.

As mudanças desta importação podem ser revistas no diff do repositório atual. Nenhum commit, push ou deploy foi realizado durante a importação.
