'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Portfolio } from '@/types/portfolio';
import PortfolioTemplate from '@/components/PortfolioTemplate';
import PublishModal from '@/components/PublishModal';

interface Props {
  portfolio: Portfolio;
}

export default function PreviewClient({ portfolio }: Props) {
  const router = useRouter();
  const [showPublishModal, setShowPublishModal] = useState(false);

  const handlePublishSuccess = (username: string) => {
    router.push(`/published?username=${username}`);
  };

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Preview Banner */}
      <div className="bg-slate-900 text-white py-3 px-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push('/')}
            className="text-slate-400 hover:text-white transition-colors"
          >
            ← Back
          </button>
          <span className="text-slate-400">|</span>
          <span className="text-sm text-slate-300">
            Preview Mode — This is how your portfolio will look
          </span>
        </div>
        <button
          onClick={() => setShowPublishModal(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
        >
          Publish & Get Link
        </button>
      </div>

      {/* Portfolio Preview */}
      <PortfolioTemplate data={portfolio.portfolio_data} />

      {/* Publish Modal */}
      {showPublishModal && (
        <PublishModal
          portfolioId={portfolio.id}
          suggestedUsername={portfolio.portfolio_data.name
            .toLowerCase()
            .replace(/[^a-z0-9]/g, '-')
            .replace(/-+/g, '-')
            .slice(0, 20)}
          onClose={() => setShowPublishModal(false)}
          onSuccess={handlePublishSuccess}
        />
      )}
    </div>
  );
}
