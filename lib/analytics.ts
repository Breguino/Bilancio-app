// L'identificativo di misurazione di Google Analytics.
//
// Non è un segreto: compare in chiaro nel sorgente di ogni pagina che carica
// gtag.js, quindi tenerlo nel repository non espone niente che non sia già
// pubblico. Sta qui perché il sito lo usasse senza dover ricordarsi di
// configurare una variabile sul pannello di Vercel a ogni progetto ricreato.
//
// La variabile d'ambiente resta e ha la precedenza: se un giorno
// NEXT_PUBLIC_GA_MEASUREMENT_ID viene impostata, vince su questo valore.
//
// Il valore predefinito vale solo in produzione. In locale e nelle anteprime
// dei rami non parte niente, così le visite di sviluppo non finiscono dentro
// le statistiche del sito vero.
//
// Questo non cambia di una virgola il consenso: chi disegna il banner e decide
// se caricare lo script è sempre AnalyticsConsent, e lo script parte solo dopo
// un "Accetta" esplicito.
const GA_ID_PRODUZIONE = "G-95TC112GPY";

export function gaMeasurementId(): string | undefined {
  const daAmbiente = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim();
  if (daAmbiente) return daAmbiente;

  return process.env.VERCEL_ENV === "production" ? GA_ID_PRODUZIONE : undefined;
}
