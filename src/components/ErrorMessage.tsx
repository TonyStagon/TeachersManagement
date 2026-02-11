import { AlertCircle } from 'lucide-react';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

export function ErrorMessage({ message, onRetry }: ErrorMessageProps) {
  return (
    <div className="bg-gradient-to-br from-red-50 to-red-100 border border-red-200 rounded-xl p-8 text-center shadow-lg">
      <div className="bg-red-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
        <AlertCircle className="h-8 w-8 text-red-500" />
      </div>
      <h3 className="text-xl font-bold text-red-800 mb-3">Error Loading Data</h3>
      <p className="text-red-700 mb-6 max-w-md mx-auto">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-6 py-3 rounded-lg transition-all duration-200 font-semibold shadow-lg hover:shadow-xl hover:-translate-y-0.5"
        >
          Try Again
        </button>
      )}
    </div>
  );
}