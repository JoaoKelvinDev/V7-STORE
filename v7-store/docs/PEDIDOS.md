# Fluxo de pedidos

O pedido é preparado no site e encaminhado pelo cliente ao WhatsApp da V7 Store: **+55 (89) 9409-5340**. A loja confirma a disponibilidade e o valor final na conversa.

## Jornada

1. O cliente escolhe a peça, a cor, o tamanho e a quantidade.
2. Ao adicionar, recebe o aviso com o botão **Finalizar pedido**. Também pode abrir o carrinho para ajustar os itens.
3. Em `/finalizar`, confere as peças e o subtotal. No celular, o resumo aparece antes do formulário; no desktop, ao lado.
4. Informa o nome, o local de retirada e, se quiser, observações. A retirada começa como **A combinar com a loja**, sem presumir um endereço.
5. Clica em **Enviar pedido pelo WhatsApp** e confirma o envio da mensagem dentro da conversa.

Depois da abertura, o site mostra **Confirme o envio no WhatsApp**, com um link direto para reabrir a conversa. A mensagem também pode ser copiada no resumo. Se o navegador bloquear a área de transferência, a prévia se abre com instruções de cópia manual.

## Validação e estados

- Nome: de 2 a 100 caracteres após remover espaços nas extremidades.
- Retirada: local preenchido, com até 200 caracteres; “A combinar com a loja” é aceito.
- Entrega: só aparece se habilitada em `fulfillmentModes`, com endereço obrigatório de até 500 caracteres.
- Observações: opcionais, com até 1.000 caracteres.
- Itens indisponíveis bloqueiam o envio e oferecem um caminho de volta ao carrinho.
- Preços pendentes aparecem como **A confirmar com a loja**, sem subtotal numérico parcial.
- A mensagem inclui peça, cor, tamanho, quantidade, preço unitário, subtotal de cada item, subtotal do pedido e os dados informados.
- Alterar os dados atualiza a prévia e remove o link da tentativa anterior, evitando reenviar uma versão desatualizada.

Abrir o WhatsApp não comprova envio nem aceitação do pedido. Por isso, o site não exibe “pedido confirmado” e não esvazia o carrinho automaticamente. O cliente pode revisar ou tentar novamente. As informações pessoais do formulário não são persistidas no navegador.

## Código

| Arquivo | Responsabilidade |
| --- | --- |
| `src/features/checkout/CheckoutPage.tsx` | Formulário, envio, cópia e orientação para continuar na conversa |
| `src/features/checkout/OrderSummary.tsx` | Peças, valores, edição do carrinho e prévia da mensagem |
| `src/features/checkout/order.ts` | Validação e composição da mensagem |
| `src/features/checkout/checkout.css` | Layout e estados responsivos da finalização |
| `src/data/settings.ts` | Telefone e modalidades disponíveis |

O fluxo permanece sem registro de pedidos em servidor, pagamento online ou painel administrativo. Os testes simulam a abertura do WhatsApp e a área de transferência; não enviam mensagens reais para a loja.
