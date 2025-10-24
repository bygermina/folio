import { useState } from 'react';

export type DebugItem = {
  label: string;
  value: string | number;
  color?: string;
};

export type DebugSection = {
  title: string;
  items: DebugItem[];
};

export type DebugPanelProps = {
  title?: string;
  sections: DebugSection[];
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
};

const positionClasses = {
  'top-left': 'top-4 left-4',
  'top-right': 'top-4 right-4',
  'bottom-left': 'bottom-4 left-4',
  'bottom-right': 'bottom-4 right-4',
};

export const DebugPanel: React.FC<DebugPanelProps> = ({
  title,
  sections,
  position = 'bottom-left',
}) => {
  const [copySuccess, setCopySuccess] = useState(false);

  const handleCopy = async () => {
    const data = sections.reduce(
      (acc, section) => {
        acc[section.title] = section.items.reduce(
          (items, item) => {
            items[item.label] = item.value;
            return items;
          },
          {} as Record<string, string | number>,
        );
        return acc;
      },
      {} as Record<string, Record<string, string | number>>,
    );

    const text = JSON.stringify(data, null, 2);
    try {
      await navigator.clipboard.writeText(text);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div
      className={`fixed ${positionClasses[position]} z-[9999] bg-gray-900/95 text-white text-sm p-4 rounded-lg shadow-xl font-mono max-w-sm pointer-events-auto`}
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-bold text-green-400">{title}</h3>
        <button
          onClick={handleCopy}
          className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-xs transition-colors"
        >
          {copySuccess ? '✓ Copied!' : '📋 Copy'}
        </button>
      </div>

      <div className="space-y-3">
        {sections.map((section, sectionIdx) => (
          <div key={sectionIdx}>
            {section.title && (
              <div className="text-gray-400 text-xs mb-1 font-semibold">{section.title}</div>
            )}
            <div className="space-y-1">
              {section.items.map((item, itemIdx) => (
                <div key={itemIdx} className="flex justify-between text-xs">
                  <span className="text-gray-400">{item.label}:</span>
                  <span className={item.color || 'text-white'}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
