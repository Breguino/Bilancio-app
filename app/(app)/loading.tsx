export default function Loading() {
  return (
    <div className="flex flex-col gap-8 animate-pulse">
      <div className="h-6 w-40 bg-surface-alt dark:bg-neutral-800 rounded-full" />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="h-24 border border-border dark:border-neutral-800 rounded-xl bg-surface-alt dark:bg-neutral-800"
          />
        ))}
      </div>
      <div className="h-40 border border-border dark:border-neutral-800 rounded-xl bg-surface-alt dark:bg-neutral-800" />
      <div className="h-64 border border-border dark:border-neutral-800 rounded-xl bg-surface-alt dark:bg-neutral-800" />
    </div>
  );
}
