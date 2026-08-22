"use client";

import { useEffect, useRef, useState } from "react";

// La firma visiva del sito. Un bilancino è una bilancia di precisione a due
// piatti: qui la bilancia c'è davvero, e il braccio pende dell'angolo che le
// entrate e le uscite del mese gli impongono. Non è un'illustrazione messa lì
// a decorare — è il grafico, con la forma dell'oggetto da cui il prodotto
// prende il nome.
//
// Perché non l'ennesima spezzata: una linea che sale racconta "crescita", che
// è la storia di un'app di investimenti. Qui la domanda è un'altra — cosa
// entra, cosa esce, da che parte pende il mese — e una bilancia la risponde
// da sola, senza legenda.

export type MeseBilancia = {
  label: string;
  entrate: number;
  uscite: number;
};

// Geometria dello strumento. Tenuta in costanti perché il disegno è tutto
// derivato: cambiare il braccio o la corda ricolloca piatti, monete e aste
// senza dover ritoccare venti coordinate a mano.
const VB_W = 460;
const VB_H = 344;
const PERNO_X = 230;
const PERNO_Y = 96;
const BRACCIO = 152; // semi-lunghezza del giogo
const CORDA = 54; // lunghezza delle funi che reggono il piatto
const PIATTO_R = 50; // semi-larghezza del piatto
const TILT_MAX = 12; // gradi: oltre, lo strumento sembra rotto invece che carico

// Una moneta ogni 500 €, al massimo otto: il piatto deve restare leggibile,
// non contabilizzare al centesimo. L'importo esatto sta scritto sotto.
const EURO_PER_MONETA = 500;
const MONETE_MAX = 8;

function radianti(deg: number) {
  return (deg * Math.PI) / 180;
}

// L'inclinazione satura: un mese in cui si risparmia il doppio di quanto si
// spende non deve ribaltare lo strumento, deve solo pendere con decisione.
function inclinazioneTarget(entrate: number, uscite: number) {
  const totale = entrate + uscite;
  if (totale <= 0) return 0;
  const scarto = (entrate - uscite) / totale;
  return Math.max(-TILT_MAX, Math.min(TILT_MAX, scarto * 34));
}

function usaMotoRidotto() {
  const [ridotto, setRidotto] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setRidotto(mq.matches);
    const onChange = () => setRidotto(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return ridotto;
}

// Molla smorzata: il braccio non arriva a destinazione per interpolazione
// lineare, oscilla e si assesta come farebbe un giogo vero. È l'unico momento
// animato importante della pagina — tutto il resto sta fermo apposta.
function usaMollaSmorzata(target: number, ridotto: boolean) {
  // Si parte già a destinazione, non da zero. L'HTML che arriva dal server
  // mostra così l'inclinazione vera fin dal primo istante: un giogo in bolla
  // sopra un netto di +1.350 € direbbe una cosa falsa a chi ha il JavaScript
  // lento, disattivato, o la scheda ancora in secondo piano (dove
  // requestAnimationFrame non gira affatto). Alla prima passata la molla è già
  // in quiete e non fa nulla; oscilla quando si cambia mese, che è il momento
  // in cui vale la pena guardarla.
  const [angolo, setAngolo] = useState(target);
  const angoloRef = useRef(target);
  const velocitaRef = useRef(0);

  useEffect(() => {
    if (ridotto) {
      angoloRef.current = target;
      velocitaRef.current = 0;
      setAngolo(target);
      return;
    }

    const RIGIDITA = 64;
    const SMORZAMENTO = 6.4;
    let raf = 0;
    let precedente = performance.now();

    // Rete di sicurezza. requestAnimationFrame non gira in una scheda in
    // secondo piano e può essere strozzato sotto carico: senza questa, un
    // cambio di mese lascerebbe il giogo inclinato come il mese precedente,
    // e cioè a smentire gli importi scritti sotto. Se la molla non si è
    // assestata da sola entro il tempo che ci mette normalmente, la si porta
    // a destinazione di forza. Nel caso normale non scatta mai.
    const salvagente = setTimeout(() => {
      cancelAnimationFrame(raf);
      angoloRef.current = target;
      velocitaRef.current = 0;
      setAngolo(target);
    }, 2200);

    const passo = (ora: number) => {
      // Il dt è tappato: tornando su una scheda lasciata in background, un
      // salto di secondi farebbe esplodere l'integrazione.
      const dt = Math.min((ora - precedente) / 1000, 1 / 30);
      precedente = ora;

      const accelerazione =
        -RIGIDITA * (angoloRef.current - target) - SMORZAMENTO * velocitaRef.current;
      velocitaRef.current += accelerazione * dt;
      angoloRef.current += velocitaRef.current * dt;

      const fermo =
        Math.abs(angoloRef.current - target) < 0.01 && Math.abs(velocitaRef.current) < 0.05;

      if (fermo) {
        angoloRef.current = target;
        velocitaRef.current = 0;
        setAngolo(target);
        clearTimeout(salvagente);
        return;
      }

      setAngolo(angoloRef.current);
      raf = requestAnimationFrame(passo);
    };

    raf = requestAnimationFrame(passo);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(salvagente);
    };
  }, [target, ridotto]);

  return angolo;
}

// Le monete impilate dentro la conca: righe orizzontali che si allargano
// salendo, perché il piatto si allarga salendo.
function monete(importo: number, cx: number, cy: number) {
  const quante = Math.max(1, Math.min(MONETE_MAX, Math.round(importo / EURO_PER_MONETA)));
  const righe = [];
  for (let i = 0; i < quante; i++) {
    const profondita = 17 - i * 4.6; // dal fondo della conca verso il bordo
    const semiLarghezza = PIATTO_R * (0.34 + 0.5 * (1 - profondita / 20));
    righe.push({
      key: i,
      x: cx - semiLarghezza,
      y: cy + profondita - 2.4,
      w: semiLarghezza * 2,
    });
  }
  return righe;
}

export function Bilancia({
  mesi,
  etichette,
  numberLocale,
}: {
  mesi: MeseBilancia[];
  etichette: {
    entrate: string;
    uscite: string;
    netto: string;
    scegliMese: string;
    descrizione: string;
  };
  numberLocale: string;
}) {
  const [indice, setIndice] = useState(mesi.length - 1);
  const ridotto = usaMotoRidotto();
  const mese = mesi[indice];
  const angolo = usaMollaSmorzata(inclinazioneTarget(mese.entrate, mese.uscite), ridotto);

  const euro = new Intl.NumberFormat(numberLocale, {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
    // Senza questo, in italiano 1900 resta "1900 €": il raggruppamento
    // automatico si attiva solo da cinque cifre. Su un importo si legge male.
    useGrouping: true,
  });

  const rad = radianti(angolo);
  const cos = Math.cos(rad);
  const sin = Math.sin(rad);

  // Estremo sinistro = uscite, destro = entrate. Angolo positivo: pende a
  // destra, cioè il mese chiude in positivo.
  const sinistraX = PERNO_X - BRACCIO * cos;
  const sinistraY = PERNO_Y - BRACCIO * sin;
  const destraX = PERNO_X + BRACCIO * cos;
  const destraY = PERNO_Y + BRACCIO * sin;

  const netto = mese.entrate - mese.uscite;

  const piatti = [
    { x: sinistraX, y: sinistraY, importo: mese.uscite, tinta: "uscite" as const },
    { x: destraX, y: destraY, importo: mese.entrate, tinta: "entrate" as const },
  ];

  return (
    <figure className="m-0">
      <svg
        viewBox={`0 0 ${VB_W} ${VB_H}`}
        className="w-full h-auto"
        role="img"
        aria-label={`${etichette.descrizione} ${mese.label}: ${etichette.entrate} ${euro.format(
          mese.entrate
        )}, ${etichette.uscite} ${euro.format(mese.uscite)}, ${etichette.netto} ${euro.format(
          netto
        )}.`}
      >
        {/* Scala graduata: le tacche contro cui l'indice si ferma. Il dettaglio
            che distingue uno strumento di misura da un'illustrazione. */}
        {[-12, -8, -4, 0, 4, 8, 12].map((t) => {
          const r = radianti(t - 90);
          const interno = t === 0 ? 30 : 34;
          return (
            <line
              key={t}
              x1={PERNO_X + Math.cos(r) * interno}
              y1={PERNO_Y + Math.sin(r) * interno}
              x2={PERNO_X + Math.cos(r) * 42}
              y2={PERNO_Y + Math.sin(r) * 42}
              stroke={t === 0 ? "rgb(var(--ottone))" : "rgb(var(--riga))"}
              strokeWidth={t === 0 ? 1.6 : 1}
              strokeLinecap="round"
            />
          );
        })}

        {/* Colonna e base */}
        <line
          x1={PERNO_X}
          y1={PERNO_Y}
          x2={PERNO_X}
          y2={296}
          stroke="rgb(var(--ottone))"
          strokeWidth="5"
          strokeLinecap="round"
        />
        <path
          d={`M${PERNO_X - 58},308 L${PERNO_X + 58},308 L${PERNO_X + 44},296 L${PERNO_X - 44},296 Z`}
          fill="rgb(var(--ottone))"
        />
        <rect x={PERNO_X - 66} y={308} width={132} height={6} rx={1} fill="rgb(var(--ottone))" />

        {/* Indice: solidale al giogo, si ferma sulla tacca. */}
        <line
          x1={PERNO_X}
          y1={PERNO_Y}
          x2={PERNO_X + Math.cos(radianti(angolo - 90)) * 40}
          y2={PERNO_Y + Math.sin(radianti(angolo - 90)) * 40}
          stroke="rgb(var(--inchiostro))"
          strokeWidth="1.6"
          strokeLinecap="round"
        />

        {/* Giogo */}
        <line
          x1={sinistraX}
          y1={sinistraY}
          x2={destraX}
          y2={destraY}
          stroke="rgb(var(--ottone))"
          strokeWidth="5"
          strokeLinecap="round"
        />
        <circle cx={PERNO_X} cy={PERNO_Y} r="7.5" fill="rgb(var(--ottone))" />
        <circle cx={PERNO_X} cy={PERNO_Y} r="3" fill="rgb(var(--carta))" />

        {/* Piatti. Restano in bolla mentre il giogo pende: sono appesi, non
            saldati — quindi non ruotano con il braccio. */}
        {piatti.map((piatto) => {
          const cy = piatto.y + CORDA;
          const colore = piatto.tinta === "entrate" ? "rgb(var(--verde))" : "rgb(var(--minio))";
          return (
            <g key={piatto.tinta}>
              <line
                x1={piatto.x}
                y1={piatto.y}
                x2={piatto.x - PIATTO_R * 0.78}
                y2={cy}
                stroke="rgb(var(--riga))"
                strokeWidth="1.2"
              />
              <line
                x1={piatto.x}
                y1={piatto.y}
                x2={piatto.x + PIATTO_R * 0.78}
                y2={cy}
                stroke="rgb(var(--riga))"
                strokeWidth="1.2"
              />
              {monete(piatto.importo, piatto.x, cy).map((m) => (
                <rect
                  key={`${indice}-${m.key}`}
                  className="moneta"
                  style={{ animationDelay: `${m.key * 55}ms` }}
                  x={m.x}
                  y={m.y}
                  width={m.w}
                  height="3.2"
                  rx="1.6"
                  fill={colore}
                  opacity="0.9"
                />
              ))}
              {/* La conca, disegnata dopo le monete: le tiene dentro. */}
              <path
                d={`M${piatto.x - PIATTO_R},${cy} Q${piatto.x},${cy + 25} ${
                  piatto.x + PIATTO_R
                },${cy}`}
                fill="none"
                stroke="rgb(var(--ottone))"
                strokeWidth="2.6"
                strokeLinecap="round"
              />
              <line
                x1={piatto.x - PIATTO_R}
                y1={cy}
                x2={piatto.x + PIATTO_R}
                y2={cy}
                stroke="rgb(var(--ottone))"
                strokeWidth="1.4"
                opacity="0.55"
              />
            </g>
          );
        })}
      </svg>

      <figcaption className="mt-5">
        {/* I mesi: la scala su cui si sceglie cosa pesare. */}
        <div className="flex items-center gap-1 mb-5" role="group" aria-label={etichette.scegliMese}>
          {mesi.map((m, i) => {
            const attivo = i === indice;
            return (
              <button
                key={m.label}
                type="button"
                onClick={() => setIndice(i)}
                aria-pressed={attivo}
                className={`cifra flex-1 border-t-2 pt-2.5 pb-3 min-h-[44px] text-[11px] uppercase tracking-[0.1em] transition-colors ${
                  attivo
                    ? "border-t-ottone text-inchiostro"
                    : "border-t-riga text-inchiostro-muted hover:text-inchiostro hover:border-t-inchiostro-muted"
                }`}
              >
                {m.label}
              </button>
            );
          })}
        </div>

        <dl className="grid grid-cols-3 gap-4">
          <div>
            <dt className="tacca">{etichette.uscite}</dt>
            <dd className="cifra text-minio text-lg font-medium mt-1">{euro.format(mese.uscite)}</dd>
          </div>
          <div>
            <dt className="tacca">{etichette.entrate}</dt>
            <dd className="cifra text-verde text-lg font-medium mt-1">{euro.format(mese.entrate)}</dd>
          </div>
          <div>
            <dt className="tacca">{etichette.netto}</dt>
            <dd className="cifra text-inchiostro text-lg font-medium mt-1">
              {netto > 0 ? "+" : ""}
              {euro.format(netto)}
            </dd>
          </div>
        </dl>
      </figcaption>
    </figure>
  );
}
