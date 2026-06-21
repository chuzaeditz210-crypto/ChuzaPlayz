export type ImageSize = '1K' | '2K' | '4K';
export type AspectRatio = '16:9' | '9:16' | '1:1';

export interface LogoStyle {
  id: string;
  name: string;
  description: string;
  promptAddon: string;
}

export interface LogoDesign {
  id: string;
  companyName: string;
  companySlogan?: string;
  description: string;
  styleId: string;
  size: ImageSize;
  aspectRatio: AspectRatio;
  imageUrl: string; // Base64 data URL
  videoUrl: string | null;
  videoOperationName: string | null;
  videoStatus: 'idle' | 'generating' | 'completed' | 'failed';
  videoError: string | null;
  createdAt: string;
}

export interface GenerationRequest {
  companyName: string;
  companySlogan?: string;
  description: string;
  styleId: string;
  size: ImageSize;
  aspectRatio: AspectRatio;
  colorPreference?: string;
}

export interface VideoRequest {
  imageUrl: string; // Base64 of the selected logo
  prompt: string; // Description of the animation
  aspectRatio: '16:9' | '9:16';
}
