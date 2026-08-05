const FONT_STACK =
  "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif";

// Wrapper HTML per le email della newsletter: prima il contenuto della bozza
// (scritto a mano dall'admin) partiva senza nessuna intestazione né stile,
// solo una riga grigia di disiscrizione in fondo. Usa tabelle e stili inline
// (non solo classi CSS) perché è l'unico modo affidabile di avere un layout
// coerente tra i client email — lo <style> in testa copre comunque i client
// che lo rispettano (Gmail, Apple Mail, Outlook.com), per dare un aspetto
// pulito anche a titoli/liste/immagini scritti a mano nella bozza senza
// stili inline propri.
export function buildNewsletterEmailHtml({
  siteUrl,
  bodyHtml,
  unsubscribeUrl,
  unsubscribePrompt,
  unsubscribeLinkText,
  ctaLabel,
  novitaPrompt,
  novitaLinkText,
  heroImageUrl = `${siteUrl}/og-image.jpg`,
}: {
  siteUrl: string;
  bodyHtml: string;
  unsubscribeUrl: string;
  unsubscribePrompt: string;
  unsubscribeLinkText: string;
  ctaLabel: string;
  novitaPrompt: string;
  novitaLinkText: string;
  heroImageUrl?: string;
}) {
  return `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style>
      img { max-width: 100%; height: auto; display: block; border: 0; }
      h1, h2, h3 { font-family: ${FONT_STACK}; color: #14151a; line-height: 1.3; margin: 24px 0 8px; }
      h1 { font-size: 22px; }
      h2 { font-size: 19px; }
      h3 { font-size: 16px; }
      p { margin: 0 0 14px; }
      ul, ol { margin: 0 0 14px; padding-left: 20px; }
      li { margin-bottom: 6px; }
      a { color: #4f46e5; }
    </style>
  </head>
  <body style="margin:0;padding:0;background-color:#fbfbf8;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#fbfbf8;padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background-color:#ffffff;border-radius:16px;border:1px solid rgba(20,21,26,0.10);overflow:hidden;">
            <tr>
              <td style="background-color:#4f46e5;padding:22px 32px;">
                <img src="${siteUrl}/logo.png" width="28" height="28" alt="" style="display:inline-block;border-radius:7px;vertical-align:middle;" />
                <span style="font-family:${FONT_STACK};font-weight:800;font-size:16px;color:#ffffff;vertical-align:middle;margin-left:10px;">Bilancino</span>
              </td>
            </tr>
            ${
              heroImageUrl
                ? `<tr>
              <td>
                <img src="${heroImageUrl}" width="560" alt="" style="width:100%;max-width:560px;height:auto;display:block;" />
              </td>
            </tr>`
                : ""
            }
            <tr>
              <td style="padding:32px 32px 8px;font-family:${FONT_STACK};font-size:15px;line-height:1.7;color:#14151a;">
                ${bodyHtml}
              </td>
            </tr>
            <tr>
              <td align="center" style="padding:8px 32px 32px;">
                <a href="${siteUrl}/login" style="display:inline-block;background-color:#4f46e5;color:#ffffff;font-family:${FONT_STACK};font-weight:700;font-size:14px;text-decoration:none;border-radius:999px;padding:12px 26px;">${ctaLabel}</a>
              </td>
            </tr>
            <tr>
              <td style="padding:18px 32px 26px;border-top:1px solid rgba(20,21,26,0.08);font-family:${FONT_STACK};font-size:12px;line-height:1.6;color:#8b8c94;">
                <p style="margin:0 0 6px;">Bilancino — <a href="${siteUrl}" style="color:#8b8c94;text-decoration:underline;">${siteUrl.replace(/^https?:\/\//, "")}</a></p>
                <p style="margin:0 0 6px;">${novitaPrompt} <a href="${siteUrl}/novita" style="color:#4f46e5;text-decoration:underline;">${novitaLinkText}</a>.</p>
                <p style="margin:0;">${unsubscribePrompt} <a href="${unsubscribeUrl}" style="color:#4f46e5;text-decoration:underline;">${unsubscribeLinkText}</a>.</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}
