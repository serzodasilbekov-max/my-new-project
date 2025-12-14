
import React, { useState, useRef } from 'react';
import { Image, Video, Volume2, Loader2, Sparkles, Music, Film } from 'lucide-react';

type MediaType = 'image' | 'video' | 'audio';

const IMAGE_MODELS = [
  { id: 'gemini-3-pro-image-preview', name: 'Gemini 3 Pro Image', provider: 'Google' },
  { id: 'gemini-2.5-flash-image-preview', name: 'Gemini 2.5 Flash Image', provider: 'Google' },
  { id: 'gpt-image-1-mini', name: 'GPT Image 1 Mini', provider: 'OpenAI' },
  { id: 'gpt-image-1', name: 'GPT Image 1', provider: 'OpenAI' },
  { id: 'dall-e-3', name: 'DALL-E 3', provider: 'OpenAI' },
];

const VIDEO_MODELS = [
  { id: 'sora-2', name: 'Sora 2', provider: 'OpenAI' },
  { id: 'sora-2-pro', name: 'Sora 2 Pro', provider: 'OpenAI' },
];

const AUDIO_MODELS = [
  { id: 'gpt-4o-audio-preview', name: 'GPT-4o Audio', provider: 'OpenAI' },
  { id: 'gpt-4o-mini-tts', name: 'GPT-4o Mini TTS', provider: 'OpenAI' },
  { id: 'tts-1', name: 'TTS-1', provider: 'OpenAI' },
  { id: 'tts-1-hd', name: 'TTS-1 HD', provider: 'OpenAI' },
  { id: 'eleven_multilingual_v2', name: 'ElevenLabs Multilingual v2', provider: 'ElevenLabs' },
  { id: 'eleven_flash_v2_5', name: 'ElevenLabs Flash v2.5', provider: 'ElevenLabs' },
];

const AIMedia: React.FC = () => {
  const [activeMode, setActiveMode] = useState<MediaType>('image');
  const [prompt, setPrompt] = useState('');
  const [selectedModel, setSelectedModel] = useState(IMAGE_MODELS[0].id); // Default to first image model
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{ type: MediaType, url: string } | null>(null);

  const handleModeChange = (mode: MediaType) => {
    setActiveMode(mode);
    setResult(null);
    setPrompt('');
    
    // Set default model for the new mode
    if (mode === 'image') setSelectedModel(IMAGE_MODELS[0].id); // gemini-3-pro-image-preview
    else if (mode === 'video') setSelectedModel(VIDEO_MODELS[0].id);
    else if (mode === 'audio') setSelectedModel(AUDIO_MODELS[0].id); // gpt-4o-audio-preview
  };

  const getModelList = () => {
    if (activeMode === 'image') return IMAGE_MODELS;
    if (activeMode === 'video') return VIDEO_MODELS;
    return AUDIO_MODELS;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isLoading) return;

    setIsLoading(true);
    setResult(null);

    try {
      if (activeMode === 'image') {
        const imgElement = await puter.ai.txt2img(prompt, { model: selectedModel });
        setResult({ type: 'image', url: imgElement.src });
      } else if (activeMode === 'video') {
        const vidElement = await puter.ai.txt2vid(prompt, { model: selectedModel, seconds: 8 });
        setResult({ type: 'video', url: vidElement.src });
      } else if (activeMode === 'audio') {
        const audioElement = await puter.ai.txt2speech(prompt, { model: selectedModel });
        setResult({ type: 'audio', url: audioElement.src });
      }
    } catch (error) {
      console.error('Generation Error:', error);
      alert(`Failed to generate ${activeMode}. Please try again.`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <Sparkles className="text-purple-600" />
          Generative Media
        </h2>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col md:flex-row min-h-[500px]">
        {/* Controls Sidebar */}
        <div className="w-full md:w-80 border-b md:border-b-0 md:border-r border-slate-100 bg-slate-50/50 p-6 flex flex-col gap-6">
          
          {/* Mode Tabs */}
          <div className="flex bg-slate-200 p-1 rounded-lg">
            <button
              onClick={() => handleModeChange('image')}
              className={`flex-1 flex items-center justify-center py-2 rounded-md text-sm font-medium transition-all ${
                activeMode === 'image' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <Image size={16} className="mr-2" /> Image
            </button>
            <button
              onClick={() => handleModeChange('video')}
              className={`flex-1 flex items-center justify-center py-2 rounded-md text-sm font-medium transition-all ${
                activeMode === 'video' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <Video size={16} className="mr-2" /> Video
            </button>
            <button
              onClick={() => handleModeChange('audio')}
              className={`flex-1 flex items-center justify-center py-2 rounded-md text-sm font-medium transition-all ${
                activeMode === 'audio' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <Volume2 size={16} className="mr-2" /> Audio
            </button>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5 flex-1">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-500 uppercase">Model</label>
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                {getModelList().map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2 flex-1 flex flex-col">
              <label className="text-xs font-semibold text-slate-500 uppercase">
                {activeMode === 'audio' ? 'Text to Speak' : 'Prompt'}
              </label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder={activeMode === 'audio' ? "Enter text to convert to speech..." : `Describe the ${activeMode} you want to generate...`}
                className="w-full flex-1 px-4 py-3 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none min-h-[120px]"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading || !prompt.trim()}
              className="w-full py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-purple-200"
            >
              {isLoading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles size={18} />
                  Generate {activeMode.charAt(0).toUpperCase() + activeMode.slice(1)}
                </>
              )}
            </button>
          </form>
        </div>

        {/* Preview Area */}
        <div className="flex-1 p-6 flex items-center justify-center bg-white min-h-[400px]">
          {result ? (
            <div className="w-full h-full flex flex-col items-center justify-center gap-4 animate-in fade-in zoom-in-95 duration-300">
              {result.type === 'image' && (
                <img src={result.url} alt="Generated result" className="max-w-full max-h-[600px] rounded-lg shadow-md object-contain" />
              )}
              
              {result.type === 'video' && (
                <video controls autoPlay loop src={result.url} className="max-w-full max-h-[600px] rounded-lg shadow-md" />
              )}
              
              {result.type === 'audio' && (
                <div className="w-full max-w-md p-8 bg-purple-50 rounded-2xl flex flex-col items-center gap-4 border border-purple-100">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 mb-2">
                    <Music size={32} />
                  </div>
                  <audio controls src={result.url} className="w-full" />
                </div>
              )}
              
              <div className="text-xs text-slate-400 mt-2">
                Right click (or use menu) to save
              </div>
            </div>
          ) : (
            <div className="text-center text-slate-400">
              {isLoading ? (
                <div className="flex flex-col items-center gap-4">
                  <div className="relative">
                    <div className="w-16 h-16 border-4 border-purple-100 border-t-purple-500 rounded-full animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Sparkles size={20} className="text-purple-500 animate-pulse" />
                    </div>
                  </div>
                  <p>Creating masterpiece...</p>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-4 opacity-50">
                  {activeMode === 'image' && <Image size={64} strokeWidth={1} />}
                  {activeMode === 'video' && <Film size={64} strokeWidth={1} />}
                  {activeMode === 'audio' && <Volume2 size={64} strokeWidth={1} />}
                  <p>Enter a prompt to generate {activeMode}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIMedia;
