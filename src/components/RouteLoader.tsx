export function RouteLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="flex flex-col items-center gap-3 text-slate-500">
        <div className="h-10 w-10 animate-spin rounded-full border-b-2 border-blue-600" />
        <span className="text-sm font-medium">A carregar página...</span>
      </div>
    </div>
  );
}
