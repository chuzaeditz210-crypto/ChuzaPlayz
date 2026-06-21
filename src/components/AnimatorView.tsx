import React, { useState, useEffect } from 'react';
import { Play, Video, Download, RefreshCw, AlertCircle, Sparkles, Film, ArrowLeftRight, Compass, Share2, Copy, Check } from 'lucide-react';

interface AnimatorViewProps {
  imageUrl: string;
  companyName?: string;
  companySlogan?: string;
  defaultPrompt?: string;
  initialVideoUrl?: string | null;
  initialOperationName?: string | null;
  onAnimationCompleted: (videoUrl: string, operationName: string) => void;
}

const CINEMATIC_PRESETS = [
  {
    name: 'Sleek Light Sweep',
    prompt: 'A gentle cinematic light sweep across the logo, creating premium glistening glints and soft corporate glows against a clean atmospheric ambient background.'
  },
  {
    name: '3D Depth Rotate',
    prompt: 'A majestic 3D slow camera rotation centering on the logo, revealing incredible architectural depth and soft volumetric shadows.'
  },
  {
    name: 'Liquid Ink Growth',
    prompt: 'The brand logo dissolves and gracefully grows out of gorgeous organic smoke and liquid ink droplets, with premium matte styling.'
  },
  {
    name: 'Aurora Cyber Pulse',
    prompt: 'Surrounding neon energy trails and colorful northern lights glowing in the background, subtly pulsating to a tech rhythm.'
  }
];

const REASSURANCE_MESSAGES = [
  "Initializing camera trajectories in 3D spacetime...",
  "Scanning logo contour geometry and volumetric bounds...",
  "Powering up Veo's neural visual motion engines...",
  "Drafting initial keyframes and aligning illumination vectors...",
  "Synthesizing cinematic highlights and glistening lighting sweeps...",
  "Interpolating temporal coordinates for pristine 24fps motion...",
  "Rendering final fluid fluidities and realistic material textures...",
  "Polishing micro-details and packaging high-definition binary stream..."
];

export const AnimatorView: React.FC<AnimatorViewProps> = ({
  imageUrl,
  companyName,
  companySlogan,
  defaultPrompt = '',
  initialVideoUrl = null,
  initialOperationName = null,
  onAnimationCompleted
}) => {
  const [animationPrompt, setAnimationPrompt] = useState(defaultPrompt || CINEMATIC_PRESETS[0].prompt);
  const [videoAspectRatio, setVideoAspectRatio] = useState<'16:9' | '9:16'>('16:9');
  const [isGenerating, setIsGenerating] = useState(false);
  const [operationName, setOperationName] = useState<string | null>(initialOperationName || null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [messageIndex, setMessageIndex] = useState(0);

  // Poll status interval references
  const [videoFileUrl, setVideoFileUrl] = useState<string | null>(initialVideoUrl || null);
  const [copiedLink, setCopiedLink] = useState<'invite' | 'video' | null>(null);

  useEffect(() => {
    setVideoFileUrl(initialVideoUrl || null);
    setOperationName(initialOperationName || null);
  }, [initialVideoUrl, initialOperationName]);

  // Sharing URL helpers for copy to clipboard
  const copyToClipboard = async (type: 'invite' | 'video', text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedLink(type);
      setTimeout(() => setCopiedLink(null), 2200);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  const getInviteLink = () => {
    const payload = {
      name: companyName || "",
      slogan: companySlogan || "",
      prompt: animationPrompt,
      ratio: videoAspectRatio,
      op: operationName || ""
    };
    const serialized = encodeURIComponent(JSON.stringify(payload));
    return `${window.location.origin}?share=${serialized}`;
  };

  const getVideoShareUrl = () => {
    if (!operationName) return "";
    return `${window.location.origin}/api/video-download?operationName=${encodeURIComponent(operationName)}`;
  };

  // Reassurance message cycler during Veo operations
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isGenerating) {
      interval = setInterval(() => {
        setMessageIndex((prev) => (prev + 1) % REASSURANCE_MESSAGES.length);
      }, 6000);
    } else {
      setMessageIndex(0);
    }
    return () => clearInterval(interval);
  }, [isGenerating]);

  // Handler to initiate video creation
  const handleStartAnimation = async () => {
    setIsGenerating(true);
    setVideoFileUrl(null);
    setOperationName(null);
    setErrorMsg(null);

    try {
      const response = await fetch('/api/generate-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageUrl,
          prompt: animationPrompt,
          aspectRatio: videoAspectRatio
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Server rejected the animation request.');
      }

      setOperationName(data.operationName);
      startPolling(data.operationName);

    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to start video processing.');
      setIsGenerating(false);
    }
  };

  // Poll function to check on Veo Operation
  const startPolling = (opName: string) => {
    const pollInterval = setInterval(async () => {
      try {
        const response = await fetch('/api/video-status', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ operationName: opName })
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Error polling video status.');
        }

        if (data.error) {
          clearInterval(pollInterval);
          setErrorMsg(data.error);
          setIsGenerating(false);
          return;
        }

        if (data.done) {
          clearInterval(pollInterval);
          // Video is completely ready! Generate the download/proxy URL
          const finalDownloadUrl = `/api/video-download?operationName=${encodeURIComponent(opName)}`;
          setVideoFileUrl(finalDownloadUrl);
          setIsGenerating(false);
          onAnimationCompleted(finalDownloadUrl, opName);
        }

      } catch (err: any) {
        clearInterval(pollInterval);
        setErrorMsg(err.message || 'Lost connection to video compiler process.');
        setIsGenerating(false);
      }
    }, 4000); // Check every 4 seconds for maximum responsiveness
  };

  return (
    <div className="space-y-6">
      {/* Target Logo Spec Card */}
      <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex flex-col sm:flex-row items-center gap-5 justify-between">
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full">
          <div className="flex flex-col items-center shrink-0">
            <div className="relative w-28 h-28 bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm flex items-center justify-center p-2">
              <img
                src={imageUrl}
                alt="Source logo"
                className="max-w-full max-h-full object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
            
            {/* Elegant slogan visualization placed beneath main logo element */}
            {(companyName || companySlogan) && (
              <div className="mt-2 text-center max-w-[120px]">
                {companyName && companyName !== 'Uploaded Asset' && (
                  <p className="text-[11px] font-bold text-slate-800 tracking-tight leading-none uppercase truncate">
                    {companyName}
                  </p>
                )}
                {companySlogan && (
                  <p className="text-[10px] italic font-medium text-indigo-600 leading-snug break-words mt-1">
                    "{companySlogan}"
                  </p>
                )}
              </div>
            )}
          </div>

          <div className="text-center sm:text-left space-y-1">
            <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full uppercase tracking-wider">
              Active Design Selected
            </span>
            <h3 className="font-semibold text-slate-900 text-sm">
              {companyName && companyName !== 'Uploaded Asset' ? companyName : "Motion Source Asset"}
            </h3>
            {companySlogan && (
              <p className="text-xs font-semibold text-slate-600 italic">
                Tagline: "{companySlogan}"
              </p>
            )}
            <p className="text-xs text-slate-400 max-w-md leading-relaxed">
              This formatted design will be processed by Veo to animate beautiful temporal transitions and professional cinematic camera works.
            </p>
          </div>
        </div>
      </div>

      {/* Editor & Configuration Pane */}
      {!videoFileUrl && !isGenerating && (
        <div className="space-y-5">
          {/* Preset Chips */}
          <div className="space-y-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1">
              <Compass className="w-3.5 h-3.5" /> Animation Presets
            </span>
            <div className="flex flex-wrap gap-2">
              {CINEMATIC_PRESETS.map((preset) => (
                <button
                  key={preset.name}
                  type="button"
                  onClick={() => setAnimationPrompt(preset.prompt)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border cursor-pointer transition-all ${
                    animationPrompt === preset.prompt
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-700 shadow-xs'
                      : 'border-slate-200 bg-white hover:border-slate-300 text-slate-600'
                  }`}
                >
                  {preset.name}
                </button>
              ))}
            </div>
          </div>

          {/* Custom Animation Prompt text */}
          <div>
            <label htmlFor="animPrompt" className="text-sm font-semibold text-slate-700 block mb-1">
              Animation Dynamics Instruction
            </label>
            <textarea
              id="animPrompt"
              rows={3}
              value={animationPrompt}
              onChange={(e) => setAnimationPrompt(e.target.value)}
              placeholder="Describe the cinematic dynamics (e.g., 'A light sweep from left to right with elegant glints and gold elements floating around...')"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition text-sm text-slate-800 placeholder:text-slate-400"
            />
          </div>

          {/* Video Format Size & Ratio Options */}
          <div>
            <span className="text-sm font-semibold text-slate-700 block mb-1.5">
              Animation Format Ratio <span className="text-[10px] text-slate-400 font-normal">(Veo constraints)</span>
            </span>
            <div className="grid grid-cols-2 gap-3">
              {(['16:9', '9:16'] as const).map((ratio) => (
                <button
                  key={ratio}
                  type="button"
                  onClick={() => setVideoAspectRatio(ratio)}
                  className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-center transition-all ${
                    videoAspectRatio === ratio
                      ? 'border-indigo-600 bg-indigo-50/20 text-indigo-700 font-semibold'
                      : 'border-slate-200 bg-white hover:border-slate-300 text-slate-600'
                  }`}
                >
                  <ArrowLeftRight className="w-4 h-4 text-slate-400" />
                  <span className="text-xs">{ratio === '16:9' ? 'Landscape (16:9)' : 'Portrait (9:16)'}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Action Trigger button */}
          <button
            type="button"
            onClick={handleStartAnimation}
            className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold py-3 px-4 rounded-xl shadow-md transition cursor-pointer select-none"
          >
            <Play className="w-5 h-5 text-indigo-300 fill-indigo-300" />
            Process Logo Animation with Veo
          </button>
        </div>
      )}

      {/* Generating/Loading Overlay Screen */}
      {isGenerating && (
        <div className="border border-indigo-100 bg-indigo-50/20 rounded-2xl p-8 flex flex-col items-center justify-center text-center space-y-4">
          <div className="relative flex items-center justify-center">
            {/* Pulsing ring */}
            <div className="absolute w-16 h-16 bg-indigo-100 rounded-full animate-ping opacity-60" />
            <div className="relative bg-indigo-600 text-white p-4 rounded-2xl shadow-md">
              <Film className="w-8 h-8 animate-pulse" />
            </div>
          </div>

          <div className="space-y-1.5 max-w-sm">
            <h4 className="font-semibold text-slate-800 text-base flex items-center justify-center gap-2">
              Compiling Animation Frames...
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed min-h-[40px] italic">
              "{REASSURANCE_MESSAGES[messageIndex]}"
            </p>
          </div>

          <div className="w-full max-w-xs bg-slate-100 h-1 rounded-full overflow-hidden">
            <div className="h-full bg-indigo-600 animate-[loading_12s_ease-in-out_infinite] rounded-full w-2/3" />
          </div>

          <p className="text-[10px] text-slate-400 text-center uppercase tracking-wide font-mono">
            Powered by veo-3.1-fast-generate-preview
          </p>
        </div>
      )}

      {/* Completed Video Stage */}
      {videoFileUrl && (
        <div className="space-y-5">
          <div className="border border-slate-100 bg-black rounded-2xl overflow-hidden shadow-xl aspect-video max-w-xl mx-auto flex items-center justify-center">
            <video
              src={videoFileUrl}
              controls
              autoPlay
              loop
              className="w-full h-full object-contain"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            {/* Download MP4 file */}
            <a
              href={videoFileUrl}
              download="animated_logo.mp4"
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2.5 px-6 rounded-xl transition shadow-md"
            >
              <Download className="w-5 h-5" />
              Download MP4 Video
            </a>

            {/* Restart/Re-animate option */}
            <button
              onClick={() => setVideoFileUrl(null)}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-700 font-semibold py-2.5 px-6 rounded-xl border border-slate-200 transition"
            >
              <RefreshCw className="w-5 h-5 text-slate-500" />
              Adjust Motion Dynamics
            </button>
          </div>

          {/* Share & Copy Rewards Link Interactive Module */}
          <div className="border border-indigo-100 bg-indigo-50/30 rounded-2xl p-4 space-y-3 max-w-xl mx-auto text-left">
            <div className="flex items-center gap-2">
              <Share2 className="w-4 h-4 text-indigo-600" />
              <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider">
                Project Distribution & Paid Rewards Sharing
              </h4>
            </div>
            
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Share your custom designed logo parameters or direct high-definition MP4 stream. When others load your design, you generate rewards on ChuzaPlayz!
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              {/* Copy Project Invitation parameters link */}
              <button
                type="button"
                onClick={() => copyToClipboard('invite', getInviteLink())}
                className="flex items-center justify-between p-2.5 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition text-left cursor-pointer group"
              >
                <div className="space-y-0.5">
                  <span className="text-[10px] font-bold text-indigo-600 block leading-none">
                    INVITATION LINK
                  </span>
                  <span className="text-xs text-slate-600 font-medium">
                    Copy Config & Preset
                  </span>
                </div>
                {copiedLink === 'invite' ? (
                  <Check className="w-4 h-4 text-emerald-600" />
                ) : (
                  <Copy className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition" />
                )}
              </button>

              {/* Copy Direct Streaming video link */}
              <button
                type="button"
                disabled={!operationName}
                onClick={() => copyToClipboard('video', getVideoShareUrl())}
                className="flex items-center justify-between p-2.5 rounded-xl border border-slate-200 bg-white hover:border-slate-300 disabled:opacity-50 disabled:cursor-not-allowed transition text-left cursor-pointer group"
              >
                <div className="space-y-0.5">
                  <span className="text-[10px] font-bold text-emerald-600 block leading-none">
                    STREAMING URL
                  </span>
                  <span className="text-xs text-slate-600 font-medium">
                    Copy Direct video file
                  </span>
                </div>
                {copiedLink === 'video' ? (
                  <Check className="w-4 h-4 text-emerald-600" />
                ) : (
                  <Copy className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition" />
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Local Error feedback if any */}
      {errorMsg && (
        <div className="flex items-start gap-2.5 p-4 text-rose-700 bg-rose-50 border border-rose-100 rounded-xl text-xs">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <div className="space-y-1 text-left">
            <strong className="font-semibold block">Animation Engine Notice</strong>
            <p className="leading-relaxed font-mono">{errorMsg}</p>
            <p className="text-[10px] text-rose-500 mt-1">
              Tip: Confirm your secrets panel has active permissions for Veo models or retry with simpler motion parameters.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
