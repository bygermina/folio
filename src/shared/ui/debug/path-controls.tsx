import { useState } from 'react';

export type PathControlsProps = {
  path: string;
  pointsCount: number;
  onClear: () => void;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  infoText?: string;
};

const positionClasses = {
  'top-left': 'top-4 left-4',
  'top-right': 'top-4 right-4',
  'bottom-left': 'bottom-4 left-4',
  'bottom-right': 'bottom-4 right-4',
};

export const PathControls = ({
  path,
  pointsCount,
  onClear,
  position = 'top-right',
}: PathControlsProps) => {
  const [copySuccess, setCopySuccess] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(path);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy path:', err);
    }
  };

  if (pointsCount === 0) return null;

  return (
    <div
      className={`fixed ${positionClasses[position]} z-[9999] flex flex-col gap-2 pointer-events-auto`}
    >
      <div className="flex gap-2">
        <button
          onClick={handleCopy}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-lg transition-colors duration-200 font-medium"
        >
          {copySuccess ? '✓ Copied!' : '📋 Copy Path'}
        </button>
        <button
          onClick={onClear}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-lg transition-colors duration-200 font-medium"
        >
          🗑️ Clear
        </button>
      </div>
    </div>
  );
};
