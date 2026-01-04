import { Loader2 } from 'lucide-react';

export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center">
        <Loader2 size={48} className="animate-spin text-primary-600 mx-auto mb-4" />
        <p className="text-gray-600 text-lg">Loading...</p>
      </div>
    </div>
  );
}
