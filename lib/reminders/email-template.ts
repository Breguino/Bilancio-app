const FONT_STACK =
  "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif";

function escapeHtml(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

// Email transazionale (un utente riceve solo promemoria che ha creato lui
// stesso, sulle proprie scadenze) — niente link di disiscrizione, a
// differenza della newsletter. Stessa impostazione a tabelle + stili inline
// del template della newsletter, per la stessa compatibilità tra client email.
export function buildReminderEmailHtml({
  siteUrl,
  greeting,
  intro,
  ctaLabel,
  reminders,
}: {
  siteUrl: string;
  greeting: string;
  intro: string;
  ctaLabel: string;
  reminders: { contactName: string; note: string; href: string }[];
}) {
  const items = reminders
    .map(
      (r) => `<tr>
        <td style="padding:14px 0;border-top:1px solid rgba(20,21,26,0.08);">
          <a href="${siteUrl}${r.href}" style="display:block;text-decoration:none;color:inherit;">
            <p style="margin:0 0 3px;font-weight:700;color:#14151a;">${escapeHtml(r.contactName)}</p>
            <p style="margin:0;color:#55565f;">${escapeHtml(r.note)}</p>
          </a>
        </td>
      </tr>`
    )
    .join("");

  return `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
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
            <tr>
              <td style="padding:32px 32px 8px;font-family:${FONT_STACK};font-size:15px;line-height:1.7;color:#14151a;">
                <p style="margin:0 0 4px;font-weight:700;">${escapeHtml(greeting)}</p>
                <p style="margin:0 0 8px;color:#55565f;">${escapeHtml(intro)}</p>
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-size:14px;line-height:1.5;">
                  ${items}
                </table>
              </td>
            </tr>
            <tr>
              <td align="center" style="padding:8px 32px 32px;">
                <a href="${siteUrl}/contacts" style="display:inline-block;background-color:#4f46e5;color:#ffffff;font-family:${FONT_STACK};font-weight:700;font-size:14px;text-decoration:none;border-radius:999px;padding:12px 26px;">${ctaLabel}</a>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}
