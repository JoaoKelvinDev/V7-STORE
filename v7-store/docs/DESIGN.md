# Direção visual da V7 Store

O front-end atual foi importado de [JoaoKelvinDev/v7-storefront-refresh](https://github.com/JoaoKelvinDev/v7-storefront-refresh/tree/b3d8866612cb78e025445051ad36147561de0605), por solicitação do proprietário. Essa referência substitui a proposta visual anterior baseada apenas na skill da raiz.

## Identidade

O visual da origem usa preto, azul elétrico, títulos cromados e a logo original. Saira é a família principal; os títulos de destaque são pesados, itálicos e em caixa alta. Kaushan Script aparece na palavra “estilo.” da abertura.

As cores OKLCH da origem foram convertidas para os tokens HSL utilizados pelo Tailwind 3 deste projeto, mantendo a compatibilidade com catálogo, carrinho e checkout. A aproximação sRGB é:

| Papel | Cor |
| --- | --- |
| Fundo | `#050607` |
| Texto | `#F4F5F7` |
| Superfície | `#0D1014` |
| Azul principal | `#0578FF` |
| Azul de destaque | `#0D99FF` |
| Borda | `#232933` |

## Organização

- `src/features/catalog/HomePage.tsx`: abertura, faixa em movimento, novidades, coleções e história da marca.
- `src/components/layout/Header.tsx`: navegação e mudança do cabeçalho ao rolar.
- `src/components/layout/Footer.tsx`: rodapé completo e centralizado, com logo, navegação, coleções, contato e retorno ao topo; exibido somente no início.
- `src/components/shared/ProductCard.tsx`: cards da referência conectados aos produtos locais.
- `src/styles/refresh.css`: estilos e animações importadas, com prefixo `refresh-`.
- `src/styles/storefront.css`: tokens e apresentação dos fluxos de catálogo e pedido.
- `src/hooks/useScrollReveal.ts`: entradas por rolagem, restritas à página inicial.

Não substitua `.grid`, `.reveal` ou outros utilitários globais para compor as seções importadas. Isso evita afetar os formulários e esconder conteúdo de outras rotas.

## Fotos e celular

Os cards usam a proporção 4:5 da referência. O catálogo continua com duas colunas no celular; a vitrine inicial empilha os cards em aparelhos estreitos, como na origem. A página da peça mantém a imagem inteira e a barra de compra com espaço reservado no conteúdo.

As ações dos cards ficam visíveis em telas de toque e ao receber foco de teclado. Os tamanhos e os filtros têm áreas de toque de pelo menos 44 px. Nenhuma foto depende do site publicado ou do servidor de assets do Lovable.

O rodapé usa três colunas no desktop. No celular, os dois grupos de links ficam lado a lado e o contato ocupa uma linha completa. Logo, textos, ícones e botão de voltar ao topo permanecem centralizados. Os links têm sublinhado discreto, ícones e área de toque de 44 px; o hover acrescenta um realce suave, sem blocos preenchidos ou bordas em cada opção. “Chamar no WhatsApp” recebe apenas destaque no texto azul, com o número `+55 (89) 9409-5340` logo abaixo; esse número também é usado no checkout.

## Movimento

Ao adicionar uma peça, um aviso confirma a inclusão, orienta o preenchimento de nome e local de retirada e oferece “Finalizar pedido”, que abre o checkout. Esse aviso fica visível até ser fechado ou até a pessoa navegar para outra página. Adições repetidas atualizam um único aviso; no celular, ele aparece acima da barra de compra.

Na finalização, o resumo vem primeiro no celular; no desktop, fica ao lado do formulário. Nomes das peças quebram em linhas, sem cortes. A mensagem completa fica em uma prévia expansível. Depois de abrir o WhatsApp, a página orienta a confirmação na conversa e mantém uma opção de reabertura. Consulte [Fluxo de pedidos](PEDIDOS.md) para os estados e as validações.

A importação mantém a entrada da abertura, a logo flutuante, o selo giratório, o brilho orgânico, a faixa contínua, as entradas por rolagem e os efeitos dos cards e coleções. O controle na faixa pausa os movimentos contínuos. A preferência de movimento reduzido desativa as animações; o conteúdo permanece visível quando `IntersectionObserver` não existe.

Consulte [Importação do front-end](IMPORTACAO_FRONTEND.md) para a origem, o commit importado, as adaptações e a cópia de segurança.
