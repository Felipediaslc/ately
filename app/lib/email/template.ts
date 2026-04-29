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
  <html>
    <body style="margin:0;padding:0;background:#f4f4f5;font-family:Arial, sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td align="center" style="padding:20px;">
            
            <table width="100%" style="max-width:500px;background:#ffffff;border-radius:16px;padding:24px;">
              
              <tr>
                <td align="center" style="padding-bottom:16px;">
                  <h2 style="margin:0;color:#16a34a;">SD Ateliê</h2>
                  <p style="margin:4px 0 0;color:#52525b;font-size:14px;">
                    Pedido confirmado 💚
                  </p>
                </td>
              </tr>

              <tr>
                <td style="padding:16px 0;color:#27272a;font-size:14px;line-height:1.5;">
                  Olá, <strong>${nome}</strong>,<br/><br/>
                  Recebemos seu pagamento com sucesso 💚<br/>
                  Seu pedido já está sendo preparado com todo cuidado.
                </td>
              </tr>

              <tr>
                <td style="background:#f9fafb;border-radius:12px;padding:16px;">
                  <p style="margin:0 0 8px;font-size:13px;color:#71717a;">
                    Pedido nº <strong>${pedidoId}</strong>
                  </p>

                  <div style="font-size:14px;color:#27272a;margin-bottom:12px;">
                    ${lista_de_produtos}
                  </div>

                  <p style="margin:4px 0;font-size:13px;color:#52525b;">
                    Forma de pagamento: <strong>${pagamento}</strong>
                  </p>

                  <p style="margin:8px 0 0;font-size:16px;font-weight:bold;color:#16a34a;">
                    Total: ${total}
                  </p>
                </td>
              </tr>

              <tr>
                <td style="padding-top:16px;">
                  <p style="margin:0 0 6px;font-size:13px;color:#71717a;">
                    📦 Endereço de entrega
                  </p>
                  <p style="margin:0;font-size:14px;color:#27272a;">
                    ${endereco}
                  </p>
                </td>
              </tr>

              <tr>
                <td style="padding-top:20px;font-size:12px;color:#71717a;text-align:center;">
                  Se precisar de ajuda, é só responder este email 😊<br/><br/>
                  <strong>SD Ateliê</strong><br/>
                  ${contato}
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