const FONT_STACK =
  "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif";

// Wrapper HTML per le email della newsletter: prima il contenuto della bozza
// (scritto a mano dall'admin) partiva senza nessuna intestazione né stile,
// solo una riga grigia di disiscrizione in fondo. Usa tabelle e stili inline
// (non classi CSS) perché è l'unico modo affidabile di avere un layout
// coerente tra i client email.
export function buildNewsletterEmailHtml({
  siteUrl,
  bodyHtml,
  unsubscribeUrl,
  unsubscribePrompt,
  unsubscribeLinkText,
}: {
  siteUrl: string;
  bodyHtml: string;
  unsubscribeUrl: string;
  unsubscribePrompt: string;
  unsubscribeLinkText: string;
}) {
  return `<!DOCTYPE html>
<html>
  <body style="margin:0;padding:0;background-color:#fbfbf8;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#fbfbf8;padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background-color:#ffffff;border-radius:16px;border:1px solid rgba(20,21,26,0.10);">
            <tr>
              <td style="padding:26px 32px;border-bottom:1px solid rgba(20,21,26,0.08);">
                <img src="${siteUrl}/logo.png" width="30" height="30" alt="" style="border-radius:8px;vertical-align:middle;display:inline-block;" />
                <span style="font-family:${FONT_STACK};font-weight:800;font-size:16px;color:#14151a;vertical-align:middle;margin-left:10px;">Bilancino</span>
              </td>
            </tr>
            <tr>
              <td style="padding:32px;font-family:${FONT_STACK};font-size:15px;line-height:1.7;color:#14151a;">
                ${bodyHtml}
              </td>
            </tr>
            <tr>
              <td style="padding:18px 32px 26px;border-top:1px solid rgba(20,21,26,0.08);font-family:${FONT_STACK};font-size:12px;line-height:1.6;color:#8b8c94;">
                ${unsubscribePrompt} <a href="${unsubscribeUrl}" style="color:#4f46e5;text-decoration:underline;">${unsubscribeLinkText}</a>.
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}
