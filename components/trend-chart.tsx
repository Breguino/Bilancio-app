// L'andamento come linea, non come elenco. Prima i mesi erano una colonna di
// righe "gennaio … 1.234,00 €": per capire se stava salendo o scendendo
// bisognava leggerle tutte e confrontarle a mente, che e' esattamente il
// lavoro che un grafico fa al posto tuo.
//
// Disegnato a mano in SVG: nessuna libreria, quindi niente da scaricare e
// funziona anche col JavaScript spento.
export function TrendChart({
  labels,
  values,
  forecast = [],
  forecastLabels = [],
  format,
  ariaLabel,
}: {
  labels: string[];
  values: number[];
  forecast?: number[];
  forecastLabels?: string[];
  format: (n: number) => string;
  ariaLabel: string;
}) {
  if (values.length < 2) return null;

  const L = 936;
  const H = 240;
  const PAD = 18;
  const tutti = values.concat(forecast);
  const min = Math.min(...tutti);
  const max = Math.max(...tutti);
  const campo = max - min || 1;
  const passo = L / (tutti.length - 1);
  const y = (v: number) => PAD + (H - PAD * 2) * (1 - (v - min) / campo);
  const punto = (v: number, i: number) => ({ x: i * passo, y: y(v) });

  const reali = values.map(punto);
  const previsti = forecast.map((v, i) => punto(v, values.length + i));
  const d = (pts: { x: number; y: number }[]) =>
    pts.map((p, i) => `${i ? "L" : "M"}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");

  const linea = d(reali);
  // La proiezione parte dall'ultimo punto vero, altrimenti il tratteggio
  // sembra staccato e non si capisce da dove nasce.
  const proiezione = previsti.length ? d([reali[reali.length - 1], ...previsti]) : "";
  const ultimo = reali[reali.length - 1];
  const area = `${linea} L${ultimo.x.toFixed(1)},${H} L0,${H} Z`;

  const griglia = [0, 1, 2, 3].map((i) => PAD + ((H - PAD * 2) / 3) * i);
  const tutte = labels.concat(forecastLabels);
  // Un'etichetta come "Mar 2026" occupa una cinquantina di pixel: quattro
  // stanno in una scheda su telefono, sette su tablet.
  const passoTelefono = Math.max(1, Math.ceil(tutte.length / 4));
  const passoTablet = Math.max(1, Math.ceil(tutte.length / 7));

  return (
    <figure className="m-0">
      <svg
        viewBox={`0 0 ${L} ${H}`}
        className="w-full h-auto block"
        role="img"
        aria-label={`${ariaLabel}: ${values.map((v, i) => `${labels[i]} ${format(v)}`).join(", ")}`}
      >
        {griglia.map((gy) => (
          <line
            key={gy}
            x1="0"
            x2={L}
            y1={gy}
            y2={gy}
            strokeWidth="1"
            className="stroke-border dark:stroke-neutral-800"
          />
        ))}
        <path d={area} className="fill-accent" opacity="0.08" />
        <path
          d={linea}
          fill="none"
          strokeWidth="2.5"
          strokeLinejoin="round"
          strokeLinecap="round"
          className="stroke-accent"
        />
        {proiezione ? (
          <path
            d={proiezione}
            fill="none"
            strokeWidth="2.5"
            strokeDasharray="6 5"
            strokeLinejoin="round"
            strokeLinecap="round"
            className="stroke-accent/40"
          />
        ) : null}
        {reali.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r="4" strokeWidth="2.5" className="fill-white dark:fill-neutral-900 stroke-accent" />
        ))}
        {previsti.map((p, i) => (
          <circle key={`f${i}`} cx={p.x} cy={p.y} r="4" strokeWidth="2.5" className="fill-white dark:fill-neutral-900 stroke-accent/40" />
        ))}
      </svg>
      {/* Le etichette vanno messe sopra il punto a cui si riferiscono: con un
          semplice space-between quelle in mezzo scivolano, perche' sono larghe
          diverse l'una dall'altra.

          Su telefono pero' non ci stanno tutte: dodici "Mar 2026" in trecento
          pixel diventano una macchia illeggibile. Quante mostrarne lo decide
          la larghezza: quattro sul telefono, sette sul tablet, tutte da
          1024px in su. La prima e l'ultima restano sempre, perche' sono gli
          estremi dell'asse. */}
      <figcaption className="relative h-4 mt-2">
        {tutte.map((l, i) => {
          const frazione = i / (tutte.length - 1);
          const primo = i === 0;
          const ultimo = i === tutte.length - 1;
          const sempre = primo || ultimo || i % passoTelefono === 0;
          const daTablet = !sempre && i % passoTablet === 0;
          const visibilita = sempre ? "" : daTablet ? "hidden sm:block" : "hidden lg:block";
          return (
            <span
              key={i}
              className={`absolute top-0 text-[11px] whitespace-nowrap ${visibilita} ${
                i < labels.length ? "text-ink-muted dark:text-neutral-500" : "text-accent/70"
              }`}
              style={
                primo
                  ? { left: 0 }
                  : ultimo
                  ? { right: 0 }
                  : { left: `${frazione * 100}%`, transform: "translateX(-50%)" }
              }
            >
              {l}
            </span>
          );
        })}
      </figcaption>
    </figure>
  );
}
