export default function Loading() {
  return (
    <div className="p-4 sm:p-6 space-y-6">
      <div className="h-8 animate-pulse bg-slate-100 rounded-lg w-64" />
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-32 animate-pulse bg-slate-100 rounded-xl" />
        ))}
      </div>
      <div className="h-96 animate-pulse bg-slate-100 rounded-xl" />
    </div>
  );
}
