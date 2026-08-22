// La struttura portante del sito pubblico: un margine stretto a sinistra che
// tiene l'etichetta, una riga che lo separa, il contenuto a destra. È il
// margine di un registro — l'etichetta sta lì perché su un registro le voci si
// annotano a margine, non perché serviva un occhiello colorato in cima a ogni
// sezione.
//
// Sotto i 1024px il margine si scioglie e l'etichetta torna sopra il testo:
// 180px di gutter su un telefono sarebbero mezzo schermo sprecato.
export function Sezione({
  etichetta,
  id,
  children,
}: {
  etichetta: string;
  id?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      className="py-16 sm:py-20 scroll-mt-16 border-t border-riga grid grid-cols-1 lg:grid-cols-[180px_1fr] gap-y-8 gap-x-10"
    >
      <p className="tacca lg:pt-2">{etichetta}</p>
      <div>{children}</div>
    </section>
  );
}

// Titolo e paragrafi affiancati: il taglio che usano quasi tutte le pagine
// discorsive (chi siamo, il servizio).
export function Discorso({
  titolo,
  paragrafi,
  children,
}: {
  titolo: string;
  paragrafi?: string[];
  children?: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-10 gap-y-5">
      <h2 className="display text-2xl sm:text-3xl max-w-[20ch]">{titolo}</h2>
      <div className="flex flex-col gap-4 text-inchiostro-soft leading-relaxed">
        {paragrafi?.map((p) => <p key={p}>{p}</p>)}
        {children}
      </div>
    </div>
  );
}
