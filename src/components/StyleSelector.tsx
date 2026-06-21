import React from 'react';
import { LogoStyle } from '../types';
import { Sparkles, Sliders, Leaf, Shield, Paintbrush, Hammer } from 'lucide-react';

interface StyleSelectorProps {
  styles: LogoStyle[];
  selectedStyleId: string;
  onSelectStyle: (id: string) => void;
}

const STYLE_ICONS: Record<string, React.ReactNode> = {
  minimalist: <Sparkles className="w-5 h-5 text-indigo-500" />,
  'tech-chrome': <Sliders className="w-5 h-5 text-cyan-500" />,
  'organic-eco': <Leaf className="w-5 h-5 text-emerald-500" />,
  'luxe-serif': <Shield className="w-5 h-5 text-amber-500" />,
  'vibrant-gradient': <Paintbrush className="w-5 h-5 text-rose-500" />,
  'brutalist-mono': <Hammer className="w-5 h-5 text-slate-700" />
};

export const StyleSelector: React.FC<StyleSelectorProps> = ({
  styles,
  selectedStyleId,
  onSelectStyle
}) => {
  return (
    <div className="space-y-3">
      <label className="text-sm font-semibold text-slate-700 block">
        Choose a Design Archetype
      </label>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {styles.map((style) => {
          const isSelected = style.id === selectedStyleId;
          return (
            <button
              key={style.id}
              type="button"
              onClick={() => onSelectStyle(style.id)}
              className={`flex flex-col items-start p-4 rounded-xl border text-left transition-all duration-200 cursor-pointer ${
                isSelected
                  ? 'border-indigo-600 bg-indigo-50/50 shadow-sm ring-1 ring-indigo-600'
                  : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50'
              }`}
            >
              <div className="flex items-center gap-2 mb-1.5">
                <div className={`p-1.5 rounded-lg ${isSelected ? 'bg-indigo-100' : 'bg-slate-100'}`}>
                  {STYLE_ICONS[style.id] || <Sparkles className="w-5 h-5 text-indigo-500" />}
                </div>
                <span className="font-semibold text-slate-900 text-sm">{style.name}</span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                {style.description}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
};
