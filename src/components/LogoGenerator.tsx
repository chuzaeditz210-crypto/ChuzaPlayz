import React, { useState } from 'react';
import { LogoStyle, ImageSize, AspectRatio, GenerationRequest } from '../types';
import { StyleSelector } from './StyleSelector';
import { Sparkles, Loader2, Info } from 'lucide-react';

interface LogoGeneratorProps {
  styles: LogoStyle[];
  isGenerating: boolean;
  onGenerate: (request: GenerationRequest) => void;
}

export const LogoGenerator: React.FC<LogoGeneratorProps> = ({
  styles,
  isGenerating,
  onGenerate
}) => {
  const [companyName, setCompanyName] = useState('');
  const [companySlogan, setCompanySlogan] = useState('');
  const [description, setDescription] = useState('');
  const [styleId, setStyleId] = useState(styles[0]?.id || 'minimalist');
  const [size, setSize] = useState<ImageSize>('1K');
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('1:1');
  const [colorPreference, setColorPreference] = useState('');

  const [formError, setFormError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName.trim()) {
      setFormError('Please enter your company or brand name.');
      return;
    }
    if (!description.trim()) {
      setFormError('Please provide a brief description of what your company does.');
      return;
    }
    setFormError(null);
    onGenerate({
      companyName,
      companySlogan: companySlogan.trim() || undefined,
      description,
      styleId,
      size,
      aspectRatio,
      colorPreference: colorPreference.trim() || undefined
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        {/* Brand Name Input */}
        <div>
          <label htmlFor="companyName" className="text-sm font-semibold text-slate-700 block mb-1">
            Brand/Company Name <span className="text-rose-500">*</span>
          </label>
          <input
            id="companyName"
            type="text"
            required
            disabled={isGenerating}
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            placeholder="e.g. Matcha Aura, Vertex Tech, Solis Group"
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 disabled:bg-slate-50 transition text-sm text-slate-800"
          />
        </div>

        {/* Brand Tagline/Slogan Input */}
        <div>
          <label htmlFor="companySlogan" className="text-sm font-semibold text-slate-700 block mb-1">
            Tagline or Slogan <span className="text-slate-400 font-normal">(Optional)</span>
          </label>
          <input
            id="companySlogan"
            type="text"
            disabled={isGenerating}
            value={companySlogan}
            onChange={(e) => setCompanySlogan(e.target.value)}
            placeholder="e.g. Pure Taste, Gentle Rituals (placed beneath symbol)"
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 disabled:bg-slate-50 transition text-sm text-slate-800 placeholder:text-slate-400"
          />
        </div>

        {/* Brand Profile Input */}
        <div>
          <label htmlFor="description" className="text-sm font-semibold text-slate-700 block mb-1">
            Company Profile & Core Aesthetics <span className="text-rose-500">*</span>
          </label>
          <textarea
            id="description"
            rows={3}
            required
            disabled={isGenerating}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe your brand and desired symbols (e.g., 'An upscale, modern matcha boutique selling organic green tea, accessories, and aesthetic kitchen elements. We want clean, gentle curves...')"
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 disabled:bg-slate-50 transition text-sm text-slate-800 placeholder:text-slate-400"
          />
        </div>

        {/* Style Selector */}
        <StyleSelector
          styles={styles}
          selectedStyleId={styleId}
          onSelectStyle={setStyleId}
        />

        {/* Layout Preferences Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {/* Colors Selection */}
          <div>
            <label htmlFor="colorPreference" className="text-sm font-semibold text-slate-700 block mb-1">
              Color Preferences
            </label>
            <input
              id="colorPreference"
              type="text"
              disabled={isGenerating}
              value={colorPreference}
              onChange={(e) => setColorPreference(e.target.value)}
              placeholder="e.g. Forest green & warm sand, Sleek monochrome with electric blue accents"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 disabled:bg-slate-50 transition text-sm text-slate-800"
            />
          </div>

          {/* Resolutions Accordance: 1K, 2K, 4K */}
          <div>
            <span className="text-sm font-semibold text-slate-700 block mb-1.5">
              Logo Resolution
            </span>
            <div className="flex bg-slate-100 p-1 rounded-xl gap-1">
              {(['1K', '2K', '4K'] as ImageSize[]).map((resOption) => (
                <button
                  key={resOption}
                  type="button"
                  disabled={isGenerating}
                  onClick={() => setSize(resOption)}
                  className={`flex-1 text-center py-1.5 text-xs font-semibold rounded-lg transition-all ${
                    size === resOption
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  {resOption}
                </button>
              ))}
            </div>
            <p className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
              <Info className="w-3 h-3 text-slate-400" /> Powered by gemini-3-pro-image-preview
            </p>
          </div>
        </div>

        {/* Aspect Ratio Configuration */}
        <div>
          <span className="text-sm font-semibold text-slate-700 block mb-1.5">
            Logo Format Ratio
          </span>
          <div className="grid grid-cols-3 gap-2">
            {(['1:1', '16:9', '9:16'] as AspectRatio[]).map((ratioOption) => (
              <button
                key={ratioOption}
                type="button"
                disabled={isGenerating}
                onClick={() => setAspectRatio(ratioOption)}
                className={`flex flex-col items-center justify-center p-2 rounded-xl border text-center transition-all ${
                  aspectRatio === ratioOption
                    ? 'border-indigo-600 bg-indigo-50/20 shadow-sm text-indigo-700 font-semibold'
                    : 'border-slate-200 bg-white hover:border-slate-300 text-slate-600'
                }`}
              >
                <div
                  className={`border-2 border-current rounded mb-1 ${
                    ratioOption === '1:1'
                      ? 'w-5 h-5'
                      : ratioOption === '16:9'
                      ? 'w-7 h-4'
                      : 'w-4 h-7'
                  }`}
                />
                <span className="text-[11px] leading-none">{ratioOption}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {formError && (
        <div className="text-rose-700 bg-rose-50 text-xs font-medium p-3 rounded-lg flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-700 shrink-0" />
          {formError}
        </div>
      )}

      {/* Submission CTA */}
      <button
        type="submit"
        disabled={isGenerating}
        className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-300 text-white font-semibold py-3 px-4 rounded-xl shadow-md transition-all cursor-pointer select-none"
      >
        {isGenerating ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Generating Brand Concept Logo...
          </>
        ) : (
          <>
            <Sparkles className="w-5 h-5 text-indigo-300 fill-indigo-300 animate-pulse" />
            Design Concept Logo
          </>
        )}
      </button>
    </form>
  );
};
