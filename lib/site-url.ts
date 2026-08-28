// L'indirizzo pubblico del sito, scritto in un posto solo.
//
// Prima la stessa espressione era ripetuta in cinque file, e per giunta con
// tre ripieghi diversi: `http://localhost:3000` nella sitemap, nel robots e
// nei metadati, `https://bilancino-app.vercel.app` nell'invio della
// newsletter, il dominio vero nell'anteprima della stessa newsletter. Fuori
// da Vercel, dove la variabile non c'è, quelle tre pagine dichiaravano tre
// indirizzi diversi per lo stesso sito — e cambiare dominio voleva dire
// ricordarsi di tutti e cinque i punti.
//
// Il valore vero arriva da NEXT_PUBLIC_SITE_URL, impostata su Vercel: un
// cambio di dominio è una modifica lì, senza toccare il codice. Il ripiego
// serve solo allo sviluppo in locale.
//
// La barra finale viene tolta perché tutti gli usi concatenano `${SITE_URL}/…`:
// una variabile scritta con la barra produrrebbe `https://sito//sitemap.xml`.
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/+$/, "");
