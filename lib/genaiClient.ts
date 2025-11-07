import { GoogleGenAI } from '@google/genai';

const isBrowser = typeof window !== 'undefined';

const getProcessEnv = () => {
  if (typeof process !== 'undefined' && process && process.env) {
    return process.env as Record<string, string | undefined>;
  }
  return {};
};

const getImportMetaEnv = () => {
  if (typeof import.meta !== 'undefined' && (import.meta as any).env) {
    return (import.meta as any).env as Record<string, string | undefined>;
  }
  return {};
};

export const getGeminiApiKey = (): string => {
  const importMetaEnv = getImportMetaEnv();
  const processEnv = getProcessEnv();

  return (
    importMetaEnv.VITE_GEMINI_API_KEY ||
    importMetaEnv.GEMINI_API_KEY ||
    processEnv.VITE_GEMINI_API_KEY ||
    processEnv.GEMINI_API_KEY ||
    processEnv.API_KEY ||
    ''
  );
};

export const createGeminiClient = (): GoogleGenAI | null => {
  const apiKey = getGeminiApiKey();
  if (!apiKey) {
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const GEMINI_KEY_INSTRUCTIONS =
  'Add your Gemini API key to a `.env.local` file as `VITE_GEMINI_API_KEY=your-key` and restart the dev server.';

export const ensureBrowserSupport = () => {
  if (!isBrowser) {
    throw new Error('Gemini client can only be created in a browser environment.');
  }
};
