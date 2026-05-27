export function emailTemplate({
  nome,
  pedidoId,
  lista_de_produtos,
  pagamento,
  total,
  endereco,
  contato,
}: {
  nome: string;
  pedidoId: string;
  lista_de_produtos: string;
  pagamento: string;
  total: string;
  endereco: string;
  contato: string;
}) {
  return `
  <!DOCTYPE html>
<html lang="pt-BR">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <title>Pedido confirmado – SD Ateliê</title>
  </head>
  <body style="margin:0;padding:0;background:#f4f4f5;font-family:-apple-system,Helvetica Neue,Arial,sans-serif;">

    <table width="100%" cellpadding="0" cellspacing="0" border="0">
      <tr>
        <td align="center" style="padding:20px;">

          <table width="500" cellpadding="0" cellspacing="0" border="0" style="max-width:500px;width:100%;background:#ffffff;border-radius:16px;overflow:hidden;">

            <!-- Cabeçalho -->
            <tr>
              <td style="padding:28px 24px 22px;text-align:center;border-bottom:1px solid #fce7f3;">
                <p style="margin:0;font-size:22px;font-weight:700;color:#c026d3;letter-spacing:0.01em;">SD Ateliê</p>
                <p style="margin:6px 0 0;font-size:13px;color:#16a34a;">Pedido confirmado</p>
              </td>
            </tr>

            <!-- Saudação -->
            <tr>
              <td style="padding:24px 24px 0;font-size:14px;color:#27272a;line-height:1.6;">
                Olá, <strong style="color:#18181b;">${nome}</strong>,<br/><br/>
                Recebemos seu pagamento com sucesso.<br/>
                Seu pedido já está sendo preparado com todo cuidado.
              </td>
            </tr>

            <!-- Card do pedido -->
            <tr>
              <td style="padding:20px 24px 0;">
                <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#fdf4ff;border-radius:12px;border:1px solid #e9d5ff;">
                  <tr>
                    <td style="padding:16px;">

                      <p style="margin:0 0 12px;font-size:12px;color:#71717a;">
                        Pedido nº <strong style="color:#18181b;font-size:13px;">${pedidoId}</strong>
                      </p>

                      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-bottom:1px solid #e9d5ff;padding-bottom:12px;margin-bottom:12px;">
                        <tr>
                          <td style="font-size:14px;color:#27272a;">${lista_de_produtos}</td>
                        </tr>
                      </table>

                      <p style="margin:0 0 6px;font-size:12px;color:#52525b;">
                        Forma de pagamento: <strong style="color:#27272a;">${pagamento}</strong>
                      </p>
                      <p style="margin:0;font-size:16px;font-weight:700;color:#c026d3;">
                        Total: ${total}
                      </p>

                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Endereço -->
            <tr>
              <td style="padding:20px 24px 0;">
                <p style="margin:0 0 6px;font-size:12px;color:#71717a;">Endereço de entrega</p>
                <p style="margin:0;font-size:14px;color:#27272a;line-height:1.5;">${endereco}</p>
              </td>
            </tr>

            <!-- Rodapé -->
            <tr>
              <td style="padding:24px;">
                <table width="100%" cellpadding="0" cellspacing="0" border="0">
                  <tr>
                    <td style="border-top:1px solid #f3e8ff;padding-top:20px;text-align:center;font-size:12px;color:#71717a;line-height:1.7;">
                      Se precisar de ajuda, é só responder este email 😊<br/><br/>
                      <strong style="color:#52525b;">SD Ateliê</strong><br/>
                      ${contato}
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>

  </body>
</html>
  `;
}



export function emailAdminTemplate({
  nome,
  pedidoId,
  lista_de_produtos,
  pagamento,
  total,
  endereco,
}: {
  nome: string;
  pedidoId: string;
  lista_de_produtos: string;
  pagamento: string;
  total: string;
  endereco: string;
}) {
  return `
  <h2>Novo pedido pago 🚀</h2>

  <p><strong>Pedido:</strong> ${pedidoId}</p>
  <p><strong>Cliente:</strong> ${nome}</p>
  <p><strong>Pagamento:</strong> ${pagamento}</p>
  <p><strong>Total:</strong> ${total}</p>

  <hr/>

  <h3>Produtos:</h3>
  <p>${lista_de_produtos}</p>

  <hr/>

  <h3>Endereço:</h3>
  <p>${endereco}</p>
  `;
}