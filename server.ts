import "dotenv/config";
import express from "express";
import path from "path";
import fetch from "node-fetch"; // Standard Node-fetch can be used or global fetch. Node 18+ has native fetch. Let's rely on native fetch that supports arrayBuffer if available, or imports. Express 4 has standard body parsing.
import { GoogleGenAI, GenerateVideosOperation } from "@google/genai";
import { createServer as createViteServer } from "vite";

const app = express();
const PORT = 3000;

// Ensure API key is configured
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.warn("WARNING: GEMINI_API_KEY environment variable is not set. API calls will fail.");
}

// Initialize the @google/genai client
const ai = new GoogleGenAI({
  apiKey: apiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

// Configure body-parser to support large base64 image requests
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Predefined styles for high-fidelity logo design
const STYLES = [
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

// Helper to extract base64 components from Data URI
function parseDataUri(dataUri: string) {
  const matches = dataUri.match(/^data:([^;]+);base64,(.+)$/);
  if (!matches) {
    return { mimeType: 'image/png', base64: dataUri };
  }
  return {
    mimeType: matches[1],
    base64: matches[2]
  };
}

// ---------------------- API Endpoints ----------------------

// Get available style presets
app.get("/api/styles", (req, res) => {
  res.json(STYLES);
});

// App status check
app.get("/api/health", (req, res) => {
  res.json({
    status: "healthy",
    hasApiKey: !!apiKey,
    time: new Date().toISOString()
  });
});

// Generate logo image using `gemini-3-pro-image-preview` or `gemini-3.1-flash-image`
app.post("/api/generate-logo", async (req, res) => {
  try {
    const { companyName, companySlogan, description, styleId, size, aspectRatio, colorPreference } = req.body;

    if (!companyName || !description) {
      return res.status(400).json({ error: "Company name and description are required." });
    }

    const selectedStyle = STYLES.find(s => s.id === styleId) || STYLES[0];
    const colorNotes = colorPreference ? `Colors to prefer: ${colorPreference}.` : "Colors should complement the company domain and style naturally.";

    const taglinePrompt = companySlogan 
      ? `Include the company tagline / slogan: "${companySlogan}". This text should be styled appropriately using balanced typography and placed centered beneath the main logo element/graphic.`
      : "";

    // Build the high-fidelity prompt for Imagen (which uses generateContent under gemini-3-pro-image-preview)
    const prompt = `A pristine professional corporate logo for a company named "${companyName}". 
${taglinePrompt}
Company Profile: ${description}.
Style: ${selectedStyle.name}. Style constraints: ${selectedStyle.promptAddon}.
${colorNotes}
Make it a high-quality icon centered on a clean solid white background. No mockups, no realistic photo templates, no hands holding a card, no paper textures, just the high-resolution vector emblem/logo itself. Centered composition.`;

    console.log("Generating logo with prompt:", prompt);
    console.log("Using size:", size, "and aspectRatio:", aspectRatio);

    // Call Gemini Image model
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-image-preview',
      contents: {
        parts: [{ text: prompt }]
      },
      config: {
        imageConfig: {
          aspectRatio: aspectRatio === '16:9' ? '16:9' : aspectRatio === '9:16' ? '9:16' : '1:1',
          imageSize: size || '1K'
        }
      }
    });

    let base64Image: string | null = null;
    if (response.candidates?.[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          base64Image = part.inlineData.data;
          break;
        }
      }
    }

    if (!base64Image) {
      console.error("Gemini response did not contain an inlineData segment:", JSON.stringify(response, null, 2));
      return res.status(500).json({ 
        error: "No image was returned by the generator. Please try adjusting your prompt or style." 
      });
    }

    const dataUrl = `data:image/png;base64,${base64Image}`;
    res.json({ imageUrl: dataUrl, promptUsed: prompt });

  } catch (err: any) {
    console.error("Error generating logo:", err);
    res.status(500).json({ error: err.message || "An unexpected error occurred during image generation." });
  }
});

// Initiates Veo video generation to animate the logo
app.post("/api/generate-video", async (req, res) => {
  try {
    const { imageUrl, prompt, aspectRatio } = req.body;

    if (!imageUrl) {
      return res.status(400).json({ error: "The source logo image is required for animation." });
    }

    const { mimeType, base64 } = parseDataUri(imageUrl);
    const animationPrompt = prompt || "Animate this corporate logo with a clean cinematic transition, sleek glows, and smooth motion reveals.";

    console.log("Initiating Veo video animation operation for aspect ratio:", aspectRatio);

    // Call veo-3.1-fast-generate-preview or lite models
    // The prompt specifies to use veo-3.1-fast-generate-preview
    const operation = await ai.models.generateVideos({
      model: 'veo-3.1-fast-generate-preview',
      prompt: animationPrompt,
      image: {
        imageBytes: base64,
        mimeType: mimeType
      },
      config: {
        numberOfVideos: 1,
        resolution: '720p',
        aspectRatio: aspectRatio === '9:16' ? '9:16' : '16:9'
      }
    });

    console.log("Created Veo operation:", operation.name);
    res.json({ operationName: operation.name });

  } catch (err: any) {
    console.error("Error starting video generation:", err);
    res.status(500).json({ error: err.message || "Could not spin up the video animation worker." });
  }
});

// Check status of long-running video operaion
app.post("/api/video-status", async (req, res) => {
  try {
    const { operationName } = req.body;

    if (!operationName) {
      return res.status(400).json({ error: "operationName is required to check status." });
    }

    console.log("Checking Veo build status for:", operationName);

    const op = new GenerateVideosOperation();
    op.name = operationName;
    const updated = await ai.operations.getVideosOperation({ operation: op });

    res.json({
      done: !!updated.done,
      error: updated.error ? (updated.error.message || updated.error) : null,
      videoUri: updated.response?.generatedVideos?.[0]?.video?.uri || null
    });

  } catch (err: any) {
    console.error("Error retrieving video operation status:", err);
    res.status(500).json({ error: err.message || "Error retrieving status from cluster." });
  }
});

// Proxy and download/stream the video file securely without exposing the direct URI or Gemini API key
app.get("/api/video-download", async (req, res) => {
  try {
    const operationName = req.query.operationName as string;

    if (!operationName) {
      return res.status(400).send("Missing operationName parameter");
    }

    console.log("Proxying download for operation video:", operationName);

    const op = new GenerateVideosOperation();
    op.name = operationName;
    const updated = await ai.operations.getVideosOperation({ operation: op });
    const uri = updated.response?.generatedVideos?.[0]?.video?.uri;

    if (!uri) {
      return res.status(404).send("Video file not ready or generation did not produce output.");
    }

    // Fetch the raw video file using the Gemini API key
    const videoRes = await fetch(uri, {
      headers: { 'x-goog-api-key': apiKey || "" },
    });

    if (!videoRes.ok) {
      return res.status(videoRes.status).send(`Failed to retrieve file from downstream source: ${videoRes.statusText}`);
    }

    res.setHeader('Content-Type', 'video/mp4');
    res.setHeader('Content-Disposition', 'attachment; filename="animated_logo.mp4"');

    // Buffer the file body and stream back
    const arrayBuffer = await videoRes.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    res.send(buffer);

  } catch (err: any) {
    console.error("Error proxying video file stream:", err);
    res.status(500).send(`Downstream error: ${err.message}`);
  }
});

// ---------------------- Vite Frontend Setup ----------------------

async function start() {
  if (process.env.NODE_ENV !== "production") {
    // Vite middleware for local development
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    // Static production build directories
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Animated Logo Designer active at http://localhost:${PORT}`);
  });
}

start();
