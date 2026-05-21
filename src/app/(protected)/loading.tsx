export default function Loading() {
  return (
    <div className="max-w-7xl mx-auto px-4 xl:px-0 py-8">
      <div className="h-8 animate-pulse bg-slate-100 rounded-lg mb-6 w-48" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 animate-pulse bg-slate-100 rounded-xl" />
          ))}
        </div>
        <div className="lg:col-span-1">
          <div className="h-64 animate-pulse bg-slate-100 rounded-xl" />
        </div>
      </div>
    </div>
  );
}
