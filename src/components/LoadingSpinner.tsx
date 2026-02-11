export function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center p-12">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-emerald-200 border-t-emerald-600 shadow-lg"></div>
      <p className="mt-4 text-gray-600 font-medium">Loading...</p>
    </div>
  );
}

export function LoadingSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-4 p-6">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="animate-pulse space-y-3">
          <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-3/4"></div>
          <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-1/2"></div>
        </div>
      ))}
    </div>
  );
}