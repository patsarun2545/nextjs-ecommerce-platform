export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md p-8 space-y-6">
        <div className="h-8 animate-pulse bg-slate-100 rounded-lg w-3/4 mx-auto" />
        <div className="space-y-4">
          <div className="h-12 animate-pulse bg-slate-100 rounded-lg" />
          <div className="h-12 animate-pulse bg-slate-100 rounded-lg" />
          <div className="h-12 animate-pulse bg-slate-100 rounded-lg" />
        </div>
        <div className="h-12 animate-pulse bg-slate-100 rounded-lg" />
      </div>
    </div>
  );
}
