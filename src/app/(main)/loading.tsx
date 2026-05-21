export default function Loading() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      <div className="h-64 animate-pulse bg-slate-100 rounded-2xl" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-64 animate-pulse bg-slate-100 rounded-2xl" />
        ))}
      </div>
    </div>
  );
}
