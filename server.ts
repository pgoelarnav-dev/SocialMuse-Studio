import express from 'express';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '10mb' }));

// Initialize Gemini if key exists
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Health check endpoint
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    aiAvailable: !!apiKey,
    version: '1.0.0',
    model: 'gemini-3.8-flash',
  });
});

// AI Caption & Variation Generation
app.post('/api/ai/generate', async (req, res) => {
  try {
    if (!ai) {
      return res.status(503).json({
        error: 'Gemini AI API key not configured. Using local rule engine.',
        source: 'local_fallback',
      });
    }

    const {
      topic,
      platform,
      category,
      tone,
      captionLength,
      audience,
      keywords,
      brandVoice,
      ctaPreference,
      includeEmojis,
    } = req.body;

    const prompt = `You are SocialMuse Studio's expert social media copywriter.
Generate 3 distinct, high-performing caption variations tailored for ${platform || 'Instagram'}.

Context & Parameters:
- Topic: ${topic || 'General update'}
- Keywords: ${keywords || 'None specified'}
- Category: ${category || 'General'}
- Tone: ${tone || 'Friendly'}
- Length preference: ${captionLength || 'Medium (2-4 punchy paragraphs)'}
- Target Audience: ${audience || 'General public'}
- Brand Voice details: ${brandVoice ? JSON.stringify(brandVoice) : 'None'}
- Preferred CTA: ${ctaPreference || 'Engaging question or prompt'}
- Include Emojis: ${includeEmojis ? 'Yes, tastefully placed' : 'No emojis'}

Format requirements:
Respond strictly in JSON adhering to this schema:
{
  "captions": [
    {
      "title": "Short descriptive variation label (e.g. Story-driven, Direct & punchy, Value breakdown)",
      "text": "Full caption text formatted with appropriate line breaks and spacing",
      "hook": "Opening hook line",
      "callToAction": "Call to action statement",
      "suggestedHashtags": ["hashtag1", "hashtag2", "hashtag3", "hashtag4", "hashtag5"]
    }
  ]
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json({
      success: true,
      data: parsed,
      source: 'gemini-3.8-flash',
    });
  } catch (error: any) {
    console.error('Error generating with Gemini:', error);
    return res.status(500).json({
      error: error.message || 'Failed to generate captions with Gemini',
      source: 'local_fallback',
    });
  }
});

// AI Caption Refinements (Shorten, Expand, Rewrite Hook, Change Tone, Translate)
app.post('/api/ai/refine', async (req, res) => {
  try {
    if (!ai) {
      return res.status(503).json({
        error: 'Gemini AI API key not configured. Using local rule engine.',
        source: 'local_fallback',
      });
    }

    const { caption, action, targetTone, targetLanguage, platform } = req.body;

    let instruction = '';
    switch (action) {
      case 'shorten':
        instruction = 'Make this caption significantly more concise, punchy, and impactful while preserving core message and hashtags.';
        break;
      case 'expand':
        instruction = 'Expand this caption with deeper storytelling, compelling context, and thoughtful spacing while keeping the voice authentic.';
        break;
      case 'hook':
        instruction = 'Replace and elevate the opening hook sentence with a high-stopping-power, pattern-interrupt hook that boosts dwell time.';
        break;
      case 'cta':
        instruction = 'Strengthen the call-to-action to maximize genuine community comments, shares, or saves.';
        break;
      case 'rewrite_tone':
        instruction = `Rewrite this caption completely in a ${targetTone || 'Professional'} tone.`;
        break;
      case 'translate':
        instruction = `Translate this caption naturally into ${targetLanguage || 'Spanish'}, keeping hashtags adapted and culturally relevant.`;
        break;
      case 'remove_emojis':
        instruction = 'Remove all emojis from this caption while keeping spacing intact.';
        break;
      case 'add_emojis':
        instruction = 'Add tasteful, modern, aesthetic emojis highlighting key points without looking spammy.';
        break;
      default:
        instruction = 'Polish and optimize this caption for high readability and engagement.';
    }

    const prompt = `You are a social media copy editor.
Target Platform: ${platform || 'General'}
User instruction: ${instruction}

Original Caption:
"""
${caption}
"""

Return strictly a JSON response:
{
  "refinedCaption": "The refined, formatted caption text",
  "explanation": "1-sentence summary of what was refined"
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json({
      success: true,
      data: parsed,
      source: 'gemini-3.8-flash',
    });
  } catch (error: any) {
    console.error('Error refining with Gemini:', error);
    return res.status(500).json({
      error: error.message || 'Failed to refine caption',
      source: 'local_fallback',
    });
  }
});

// AI Hashtag Discovery
app.post('/api/ai/hashtags', async (req, res) => {
  try {
    if (!ai) {
      return res.status(503).json({
        error: 'Gemini AI API key not configured. Using local rule engine.',
        source: 'local_fallback',
      });
    }

    const { topic, category, platform } = req.body;
    const prompt = `Generate a curated set of 20 relevant hashtags for topic: "${topic}", category: "${category || 'General'}", platform: "${platform || 'Instagram'}".
Categorize them into high-intent buckets:
1. High-Reach / Broad (5 hashtags)
2. Niche / Community (8 hashtags)
3. Location / Industry-Specific (4 hashtags)
4. Branded / Campaign (3 hashtags)

Return strictly JSON:
{
  "broad": ["tag1", "tag2"],
  "niche": ["tag3", "tag4"],
  "industry": ["tag5", "tag6"],
  "campaign": ["tag7", "tag8"],
  "all": ["tag1", "tag2", "tag3"]
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json({
      success: true,
      data: parsed,
      source: 'gemini-3.8-flash',
    });
  } catch (error: any) {
    return res.status(500).json({
      error: error.message || 'Failed to fetch hashtags with AI',
      source: 'local_fallback',
    });
  }
});

// In production, serve built static files. In development, mount Vite middleware.
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'dist')));
  app.get('*', (_req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  });
} else {
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });
  app.use(vite.middlewares);
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`SocialMuse Studio server running on http://0.0.0.0:${PORT}`);
});
