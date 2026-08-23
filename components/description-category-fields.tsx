"use client";

import { useMemo, useState } from "react";

const fieldClass =
  "border border-border dark:border-neutral-700 dark:bg-neutral-950 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent";

// Le etichette arrivano dal server già tradotte: prima erano scritte fisse in
// italiano qui dentro e restavano in italiano anche con l'app in inglese, in
// mezzo a "Type", "Client" e "Amount".
export function DescriptionCategoryFields({
  history,
  descriptionLabel,
  categoryLabel,
  categoryPlaceholder,
}: {
  history: { description: string; category: string }[];
  descriptionLabel: string;
  categoryLabel: string;
  categoryPlaceholder: string;
}) {
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [categoryTouched, setCategoryTouched] = useState(false);

  const lookup = useMemo(() => {
    const map = new Map<string, string>();
    for (const h of history) {
      const key = h.description.trim().toLowerCase();
      if (key && !map.has(key)) map.set(key, h.category);
    }
    return map;
  }, [history]);

  const descriptionOptions = useMemo(
    () => Array.from(new Set(history.map((h) => h.description))).slice(0, 50),
    [history]
  );

  function handleDescriptionChange(value: string) {
    setDescription(value);
    if (categoryTouched) return;

    const key = value.trim().toLowerCase();
    if (!key) {
      setCategory("");
      return;
    }
    const exact = lookup.get(key);
    if (exact) {
      setCategory(exact);
      return;
    }
    for (const [desc, cat] of lookup) {
      if (desc.startsWith(key) || key.startsWith(desc)) {
        setCategory(cat);
        return;
      }
    }
  }

  return (
    <>
      <div className="sm:col-span-2 flex flex-col gap-1 order-1">
        <label className="text-xs font-semibold text-ink-secondary dark:text-neutral-400">{descriptionLabel}</label>
        <input
          name="description"
          required
          list="description-history"
          value={description}
          onChange={(e) => handleDescriptionChange(e.target.value)}
          className={fieldClass}
        />
        <datalist id="description-history">
          {descriptionOptions.map((d) => (
            <option key={d} value={d} />
          ))}
        </datalist>
      </div>
      <div className="flex flex-col gap-1 order-3">
        <label className="text-xs font-semibold text-ink-secondary dark:text-neutral-400">{categoryLabel}</label>
        <input
          name="category"
          placeholder={categoryPlaceholder}
          value={category}
          onChange={(e) => {
            setCategoryTouched(true);
            setCategory(e.target.value);
          }}
          className={fieldClass}
        />
      </div>
    </>
  );
}
