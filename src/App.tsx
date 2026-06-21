import { useState, useEffect } from 'react';
import { LogoStyle, LogoDesign, GenerationRequest } from './types';
import { LogoGenerator } from './components/LogoGenerator';
import { UploadZone } from './components/UploadZone';
import { AnimatorView } from './components/AnimatorView';
import { HistoryList } from './components/HistoryList';
import { Sparkles, Upload, Flame, Hammer, Eye, HelpCircle, RefreshCw, KeyRound } from 'lucide-react';

const STATIC_STYLES: LogoStyle[] = [
  {
    id: "minimalist",
    name: "Minimalist Modern",
    description: "Ultra clean, modern geometric logo, flat design with elegant balance and ample negative space.",
    promptAddon: "minimalist, flat design, modern vector graphic, geometric elegance, clean solid brand mark, high-contrast negative space, vector, no gradients"
  },
  {
    id: "tech-chrome",
    name: "Futuristic Tech",
    description: "Sleek chrome/metallic gradients, digital grid motifs, and sharp futuristic hardware/software lines.",
    promptAddon: "futuristic technology emblem, cybernetic, sleek metallic chrome surface, fine micro-details, glossy cyber finish, dark background accent, modern vector style"
  },
  {
    id: "organic-eco",
    name: "Organic & Sustainable",
    description: "Soft curved contours, botanical references, eco-conscious harmony, and matte earthy palettes.",
    promptAddon: "organic brand emblem, botanical details, natural growth, hand-sketched lines combined with vector precision, clean eco-friendly design, soft matte paint colors"
  },
  {
    id: "luxe-serif",
    name: "Luxury & Heritage",
    description: "Symmetrical heraldic structures, refined serif typography accents, gold leaf finish, timeless aura.",
    promptAddon: "luxury heritage monogram, gold foil stamping, royal typography, classical crest shape, high-end high-contrast premium packaging design style"
  },
  {
    id: "vibrant-gradient",
    name: "Vibrant Mesh Gradient",
    description: "Bright flowing mesh textures, modern 3D depth illusion, high vibrancy and playful dynamics.",
    promptAddon: "flowing mesh gradient emblem, translucent vibrant liquid forms, modern startup aesthetic, soft 3D ambient lighting, colorful premium vector visual"
  },
  {
    id: "brutalist-mono",
    name: "Brutalist Monochrome",
    description: "Bold solid black-and-white shapes, high industrial friction, technical and counter-culture look.",
    promptAddon: "brutalist heavy icon, high contrast black and white ink, industrial stamp, bold gothic lines, screenprint design texture"
  },
  {
    id: "glow-cyberpunk",
    name: "Glow Gaming Cyberpunk (ChuzaPlayz Special)",
    description: "Dark gaming logo featuring neon colors, red glowing cyber elements, digital glitch highlights, and bold backdrops.",
    promptAddon: "gaming brand emblem, high contrast deep black background, cybernetic glitch detail, neon cyberpunk glow, intense red glowing elements, glitchy horizontal lines, modern vector graphic style with premium gamer aesthetic"
  }
];

export default function App() {
  const [styles, setStyles] = useState<LogoStyle[]>(STATIC_STYLES);
  const [historyList, setHistoryList] = useState<LogoDesign[]>([]);
  const [activeLogoId, setActiveLogoId] = useState<string | null>(null);
  
  // App operational states
  const [activeCreatorTab, setActiveCreatorTab] = useState<'design' | 'upload'>('design');
  const [isGeneratingLogo, setIsGeneratingLogo] = useState(false);
  const [logoError, setLogoError] = useState<string | null>(null);
  const [keyNotice, setKeyNotice] = useState<string | null>(null);
  const [shareNotice, setShareNotice] = useState<string | null>(null);

  // Initialize and load history cache from localStorage
  useEffect(() => {
    let parsed: LogoDesign[] = [];
    try {
      const cached = localStorage.getItem('animated_logo_studio_history');
      if (cached) {
        parsed = JSON.parse(cached) as LogoDesign[];
      }
      
      // If history is empty, seed with the premium ChuzaPlayz Cyberpunk Logo project
      if (parsed.length === 0) {
        const preseededItem: LogoDesign = {
          id: 'chuza_preset_0',
          companyName: "ChuzaPlayz",
          companySlogan: "Earn Paid Rewards",
          description: "Cinematic digital portrait blend, dark cybernetic theme with intense glowing red elements and abstract HUD HUD alignments.",
          styleId: "glow-cyberpunk",
          size: "1K",
          aspectRatio: "1:1",
          imageUrl: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512"><rect width="100%" height="100%" fill="%230a0a0f"/><line x1="0" y1="128" x2="512" y2="128" stroke="%231f1f2e" stroke-width="1"/><line x1="0" y1="256" x2="512" y2="256" stroke="%231f1f2e" stroke-width="1"/><line x1="0" y1="384" x2="512" y2="384" stroke="%231f1f2e" stroke-width="1"/><line x1="128" y1="0" x2="128" y2="512" stroke="%231f1f2e" stroke-width="1"/><line x1="256" y1="0" x2="256" y2="512" stroke="%231f1f2e" stroke-width="1"/><line x1="384" y1="0" x2="384" y2="512" stroke="%231f1f2e" stroke-width="1"/><circle cx="256" cy="220" r="110" fill="none" stroke="%23ef4444" stroke-width="2" stroke-opacity="0.2"/><circle cx="256" cy="220" r="95" fill="none" stroke="%23ef4444" stroke-width="1" stroke-dasharray="5,10" stroke-opacity="0.3"/><path d="M 210,170 L 302,170 L 320,220 L 256,310 L 192,220 Z" fill="%2313131a" stroke="%23ef4444" stroke-width="3" stroke-linejoin="round"/><rect x="176" y="195" width="160" height="24" rx="4" fill="%23ef4444" opacity="0.95"/><rect x="160" y="205" width="192" height="4" fill="%23ffffff" opacity="0.8"/><text x="50%" y="390" dominant-baseline="middle" text-anchor="middle" font-family="system-ui, sans-serif" font-size="34" font-weight="900" fill="%23ffffff" letter-spacing="4">CHUZAPLAYZ</text><text x="50%" y="425" dominant-baseline="middle" text-anchor="middle" font-family="monospace" font-size="14" font-weight="700" fill="%23ef4444" letter-spacing="2">EARN PAID REWARDS</text><path d="M 30,50 L 30,30 L 50,30" fill="none" stroke="%23ef4444" stroke-width="4"/><path d="M 482,50 L 482,30 L 462,30" fill="none" stroke="%23ef4444" stroke-width="4"/><path d="M 30,462 L 30,482 L 50,482" fill="none" stroke="%23ef4444" stroke-width="4"/><path d="M 482,462 L 482,482 L 462,482" fill="none" stroke="%23ef4444" stroke-width="4"/></svg>`,
          videoUrl: null,
          videoOperationName: null,
          videoStatus: 'idle',
          videoError: null,
          createdAt: new Date().toISOString()
        };
        parsed = [preseededItem];
        localStorage.setItem('animated_logo_studio_history', JSON.stringify(parsed));
      }

      setHistoryList(parsed);
      if (parsed.length > 0) {
        setActiveLogoId(parsed[0].id);
      }
    } catch (err) {
      console.error("Local Storage is corrupt or locked:", err);
    }

    // Check for share query parameter
    try {
      const params = new URLSearchParams(window.location.search);
      const shareParam = params.get('share');
      if (shareParam) {
        const decoded = JSON.parse(decodeURIComponent(shareParam));
        if (decoded && decoded.name) {
          const isDuplicate = parsed.some(item => 
            item.companyName === decoded.name && 
            item.companySlogan === decoded.slogan &&
            item.videoOperationName === decoded.op
          );

          if (!isDuplicate) {
            // Encode SVG text safely
            const safeName = decoded.name.replace(/["'&<>]/g, '');
            const safeSlogan = (decoded.slogan || '').replace(/["'&<>]/g, '');
            const svgPlaceholder = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512"><rect width="100%" height="100%" fill="%23f8fafc"/><circle cx="256" cy="256" r="160" fill="%234f46e5" opacity="0.15"/><path d="M256 120 C 180 120, 120 180, 120 256 C 120 332, 180 392, 256 392 C 332 392, 392 332, 392 256 C 392 180, 332 120, 256 120 Z" fill="none" stroke="%234f46e5" stroke-width="8" stroke-dasharray="12,12"/><text x="50%" y="46%" dominant-baseline="middle" text-anchor="middle" font-family="system-ui, sans-serif" font-size="32" font-weight="900" fill="%231e293b">${safeName.toUpperCase()}</text><text x="50%" y="56%" dominant-baseline="middle" text-anchor="middle" font-family="system-ui, sans-serif" font-size="16" font-style="italic" font-weight="600" fill="%234f46e5">${safeSlogan ? `&quot;${safeSlogan}&quot;` : ''}</text></svg>`;

            const sharedProjectItem: LogoDesign = {
              id: 'shared_' + Date.now(),
              companyName: decoded.name,
              companySlogan: decoded.slogan || undefined,
              description: "Shared project imported from ChuzaPlayz distribution link.",
              styleId: "minimalist",
              size: "1K",
              aspectRatio: decoded.ratio || "16:9",
              imageUrl: svgPlaceholder,
              videoUrl: decoded.op ? `/api/video-download?operationName=${encodeURIComponent(decoded.op)}` : null,
              videoOperationName: decoded.op || null,
              videoStatus: decoded.op ? 'completed' : 'idle',
              videoError: null,
              createdAt: new Date().toISOString()
            };

            const updatedList = [sharedProjectItem, ...parsed];
            setHistoryList(updatedList);
            setActiveLogoId(sharedProjectItem.id);
            localStorage.setItem('animated_logo_studio_history', JSON.stringify(updatedList));
            setShareNotice(`Imported Shared Project: "${decoded.name}" successfully!`);
          } else {
            // Activate existing
            const match = parsed.find(item => item.companyName === decoded.name);
            if (match) {
              setActiveLogoId(match.id);
            }
          }
          // Remove query params smoothly
          window.history.replaceState({}, document.title, window.location.pathname);
        }
      }
    } catch (e) {
      console.error("Shared project parser error:", e);
    }

    // Try fetching styles from backend
    fetch('/api/styles')
      .then(res => {
        if (res.ok) return res.json();
        throw new Error('API down');
      })
      .then(data => setStyles(data))
      .catch(() => {
        console.log("Using local design archetypes definition fallback.");
      });
  }, []);

  // Sync state modifications back to local Cache persistence
  const saveToHistoryCache = (updatedList: LogoDesign[]) => {
    setHistoryList(updatedList);
    try {
      localStorage.setItem('animated_logo_studio_history', JSON.stringify(updatedList));
    } catch (err) {
      console.error("Failed to commit cache chunk:", err);
    }
  };

  // Trigger logo creation via Imagen models
  const handleLogoGenerate = async (request: GenerationRequest) => {
    setIsGeneratingLogo(true);
    setLogoError(null);
    setKeyNotice(null);

    try {
      const response = await fetch('/api/generate-logo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request)
      });

      const data = await response.json();

      if (!response.ok) {
        // If it looks like a credentials message, let them know gracefully
        if (data.error && (data.error.includes('key') || data.error.includes('permission') || data.error.includes('Quota'))) {
          setKeyNotice("Using advanced Imagen models may require additional configuration in Google AI Studio. Check the Secrets panel.");
        }
        throw new Error(data.error || 'Failed to design logo. Please check server logs.');
      }

      // Add newly generated asset
      const newLogo: LogoDesign = {
        id: 'logo_' + Date.now(),
        companyName: request.companyName,
        companySlogan: request.companySlogan,
        description: request.description,
        styleId: request.styleId,
        size: request.size,
        aspectRatio: request.aspectRatio,
        imageUrl: data.imageUrl,
        videoUrl: null,
        videoOperationName: null,
        videoStatus: 'idle',
        videoError: null,
        createdAt: new Date().toISOString()
      };

      const updated = [newLogo, ...historyList];
      saveToHistoryCache(updated);
      setActiveLogoId(newLogo.id);

    } catch (err: any) {
      setLogoError(err.message || 'An error occurred while generating logo image.');
    } finally {
      setIsGeneratingLogo(false);
    }
  };

  // Trigger manual logo upload workflow
  const handleLogoUpload = (base64Data: string) => {
    const uploadedLogo: LogoDesign = {
      id: 'upload_' + Date.now(),
      companyName: 'Uploaded Asset',
      description: 'Customer uploaded brand identity file',
      styleId: 'uploaded',
      size: '1K',
      aspectRatio: '1:1',
      imageUrl: base64Data,
      videoUrl: null,
      videoOperationName: null,
      videoStatus: 'idle',
      videoError: null,
      createdAt: new Date().toISOString()
    };

    const updated = [uploadedLogo, ...historyList];
    saveToHistoryCache(updated);
    setActiveLogoId(uploadedLogo.id);
  };

  // Delete logo asset action
  const handleLogoDelete = (id: string) => {
    const updated = historyList.filter(item => item.id !== id);
    saveToHistoryCache(updated);

    if (activeLogoId === id) {
      setActiveLogoId(updated.length > 0 ? updated[0].id : null);
    }
  };

  // Once an animation is successful, sync changes to list
  const handleAnimationCompleted = (videoUrl: string, opName: string) => {
    const updated = historyList.map(item => {
      if (item.id === activeLogoId) {
        return {
          ...item,
          videoUrl,
          videoOperationName: opName,
          videoStatus: 'completed' as const
        };
      }
      return item;
    });
    saveToHistoryCache(updated);
  };

  // Active Asset pointer lookup
  const activeLogo = historyList.find(item => item.id === activeLogoId);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col antialiased">
      {/* Prime Header Block */}
      <header className="bg-white border-b border-slate-100 py-5 px-6 shadow-xs sticky top-0 z-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-slate-900 rounded-xl text-white shadow-md shadow-slate-900/10">
              <Flame className="w-6 h-6 fill-indigo-400 text-indigo-400 animate-pulse" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-slate-900 tracking-tight leading-none">
                ChuzaPlayz
              </h1>
              <p className="text-[11px] text-slate-500 mt-1 font-semibold font-mono text-indigo-600 uppercase tracking-wider">
                Earn Paid Rewards &middot; Animated Logo Studio
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
            <span className="text-xs font-semibold text-slate-500 font-mono text-center">
              SYSTEM ONLINE // GEMINI INTEGRATION ACTIVE
            </span>
          </div>
        </div>
      </header>

      {/* Main App Stage Container */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-4 md:p-6 space-y-6">
        {shareNotice && (
          <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4 flex items-center justify-between text-xs text-emerald-800 animate-fadeIn">
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500" />
              <p className="font-semibold">{shareNotice}</p>
            </div>
            <button 
              onClick={() => setShareNotice(null)}
              className="text-emerald-600 hover:text-emerald-800 font-bold px-2 cursor-pointer text-base"
              aria-label="Dismiss loaded project notification"
            >
              &times;
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* LEFT CONTAINER: Logo generation or upload (span 5) */}
          <section className="lg:col-span-5 bg-white border border-slate-100 rounded-3xl p-5 shadow-sm space-y-6">
            
            {/* Header tab controller */}
            <div className="flex bg-slate-100 p-1 rounded-2xl">
              <button
                type="button"
                onClick={() => setActiveCreatorTab('design')}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-bold rounded-xl transition ${
                  activeCreatorTab === 'design'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                <Sparkles className="w-4 h-4 text-indigo-500" />
                Gemini Logo Forger
              </button>
              <button
                type="button"
                onClick={() => setActiveCreatorTab('upload')}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-bold rounded-xl transition ${
                  activeCreatorTab === 'upload'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                <Upload className="w-4 h-4 text-emerald-500" />
                Upload Existing Image
              </button>
            </div>

            {/* Creator modules */}
            {activeCreatorTab === 'design' ? (
              <div className="space-y-4">
                <div className="space-y-1">
                  <h2 className="text-base font-bold text-slate-900 flex items-center gap-1.5">
                    Forge a Corporate Concept
                  </h2>
                  <p className="text-xs text-slate-400">
                    Define critical criteria details. Gemini-3-pro-image will formulate a high-fidelity vector trademark.
                  </p>
                </div>

                <LogoGenerator
                  styles={styles}
                  isGenerating={isGeneratingLogo}
                  onGenerate={handleLogoGenerate}
                />

                {/* Error Banner */}
                {logoError && (
                  <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl space-y-1 text-left text-xs text-rose-800">
                    <strong className="font-semibold block">Design Failure</strong>
                    <p className="leading-relaxed font-mono">{logoError}</p>
                  </div>
                )}

                {/* Instructions Hint */}
                {keyNotice && (
                  <div className="p-3 bg-indigo-50/50 border border-indigo-100 rounded-xl space-y-1 text-left text-xs text-indigo-800 flex items-start gap-2">
                    <KeyRound className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
                    <div>
                      <strong className="font-semibold block">Key configuration required</strong>
                      <p className="leading-relaxed">{keyNotice}</p>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <div className="space-y-1">
                  <h2 className="text-base font-bold text-slate-900 flex items-center gap-1.5">
                    Provide Source Photo
                  </h2>
                  <p className="text-xs text-slate-400">
                    Already have a branding asset or photo? Drag and drop below to instantly convert and load it as active.
                  </p>
                </div>

                <UploadZone onImageSelected={handleLogoUpload} />
              </div>
            )}
          </section>

          {/* RIGHT CONTAINER: Veo dynamic animation suite (span 7) */}
          <section className="lg:col-span-7 bg-white border border-slate-100 rounded-3xl p-5 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1 text-left">
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-1.5">
                  Motion & Animation Dynamics
                </h2>
                <p className="text-xs text-slate-400">
                  Inject temporal camera movements and special light dynamics into your brand identity.
                </p>
              </div>
              <div className="hidden sm:inline-flex items-center gap-1 bg-indigo-50 px-2.5 py-1 rounded-lg text-[10px] font-bold text-indigo-700 font-mono uppercase tracking-wider">
                Veo AI Engine Active
              </div>
            </div>

            {activeLogo ? (
              <AnimatorView
                key={activeLogo.id} // Re-mount when image changes
                imageUrl={activeLogo.imageUrl}
                companyName={activeLogo.companyName}
                companySlogan={activeLogo.companySlogan}
                defaultPrompt={""}
                initialVideoUrl={activeLogo.videoUrl}
                initialOperationName={activeLogo.videoOperationName}
                onAnimationCompleted={handleAnimationCompleted}
              />
            ) : (
              <div className="border border-dashed border-slate-100 rounded-2xl bg-slate-50/30 p-12 text-center min-h-[400px] flex flex-col items-center justify-center space-y-4">
                {/* Visual Placeholder graphics */}
                <div className="relative flex items-center justify-center">
                  <div className="w-16 h-16 rounded-3xl bg-slate-100 flex items-center justify-center p-3 text-slate-400">
                    <Eye className="w-8 h-8" />
                  </div>
                  <div className="absolute -top-1.5 -right-1.5 bg-indigo-100 p-1 rounded-full text-indigo-600 animate-bounce">
                    <Sparkles className="w-4 h-4" />
                  </div>
                </div>

                <div className="space-y-1 block max-w-sm">
                  <h3 className="font-semibold text-slate-800 text-sm">Visualizer Idle</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Once you design a concept logo via the Gemini Forger or upload an existing image, this pane will unlock. You can then configure 3D camera sweeps, light glints, and temporal transitions powered by Veo!
                  </p>
                </div>
              </div>
            )}
          </section>
        </div>

        {/* GALLERY CONTAINER: History Gallery list */}
        <section className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm">
          <HistoryList
            historyList={historyList}
            activeId={activeLogoId}
            onSelect={setActiveLogoId}
            onDelete={handleLogoDelete}
          />
        </section>
      </main>

      {/* Humble footer */}
      <footer className="mt-auto border-t border-slate-100 bg-white py-6 px-6 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="leading-none">
            &copy; 2026 ChuzaPlayz &middot; Earn Paid Rewards. Incorporating high-fidelity Imagen 3 and Veo Video interpolation.
          </p>
          <div className="flex gap-4 font-semibold text-slate-500 font-mono">
            <span>CHUZ EDITZ STUDIO // VEO-3.1-FP-FAST-PREVIEW</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
