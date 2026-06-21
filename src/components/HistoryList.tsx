import React from 'react';
import { LogoDesign } from '../types';
import { Image, Video, Trash2, Calendar, LayoutGrid } from 'lucide-react';

interface HistoryListProps {
  historyList: LogoDesign[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
}

export const HistoryList: React.FC<HistoryListProps> = ({
  historyList,
  activeId,
  onSelect,
  onDelete
}) => {
  if (historyList.length === 0) {
    return (
      <div className="border border-dashed border-slate-200 rounded-2xl p-8 text-center bg-white">
        <LayoutGrid className="w-8 h-8 text-slate-300 mx-auto mb-2" />
        <p className="text-sm font-semibold text-slate-800">Your Design Studio is Empty</p>
        <p className="text-xs text-slate-400 mt-1">
          Create a corporate logo concept using Gemini above, or drag and drop an existing logo file to begin!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          Assets Gallery & History ({historyList.length})
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {historyList.map((item) => {
          const isActive = item.id === activeId;
          const formattedDate = new Date(item.createdAt).toLocaleDateString(undefined, {
            month: 'short',
            day: 'numeric'
          });

          return (
            <div
              key={item.id}
              onClick={() => onSelect(item.id)}
              className={`group relative rounded-xl border overflow-hidden cursor-pointer transition-all ${
                isActive
                  ? 'border-indigo-600 ring-2 ring-indigo-100 bg-white'
                  : 'border-slate-200 hover:border-slate-300 bg-white shadow-xs'
              }`}
            >
              {/* Image Preview stage */}
              <div className="aspect-square bg-slate-50 flex items-center justify-center p-3 relative group-hover:bg-slate-100/50 transition">
                <img
                  src={item.imageUrl}
                  alt={item.companyName || "Uploaded Logo"}
                  className="max-w-full max-h-full object-contain"
                  referrerPolicy="no-referrer"
                />

                {/* Badges */}
                <div className="absolute bottom-1 right-1 flex gap-1">
                  {item.videoUrl && (
                    <div className="bg-indigo-600 text-white rounded p-1 shadow-xs" title="Animation generated">
                      <Video className="w-3 h-3" />
                    </div>
                  )}
                  <div className="bg-white/90 text-slate-700 border border-slate-100 rounded text-[9px] px-1 font-mono">
                    {item.size}
                  </div>
                </div>
              </div>

              {/* Text metadata footer */}
              <div className="p-2.5 text-left border-t border-slate-100">
                <h4 className="font-semibold text-slate-900 text-xs truncate leading-tight">
                  {item.companyName}
                </h4>
                <div className="flex items-center justify-between mt-1 text-[10px] text-slate-400">
                  <span className="flex items-center gap-0.5 font-mono">
                    <Calendar className="w-2.5 h-2.5" />
                    {formattedDate}
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(item.id);
                    }}
                    className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition opacity-0 group-hover:opacity-100 focus:opacity-100"
                    title="Delete asset"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
