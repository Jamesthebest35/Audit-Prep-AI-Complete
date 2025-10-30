
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality, Blob } from '@google/genai';
// Fix: Add FileTextIcon, ZapIcon, BarChartIcon, BrainCircuitIcon to Icon.tsx and import them here.
import { ShieldCheckIcon, FileTextIcon, ZapIcon, BarChartIcon, BrainCircuitIcon } from '../shared/Icon';

// --- Start: Audio Helper Functions ---
function encode(bytes: Uint8Array) {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

function createBlob(data: Float32Array): Blob {
  const l = data.length;
  const int16 = new Int16Array(l);
  for (let i = 0; i < l; i++) {
    int16[i] = data[i] * 32768;
  }
  return {
    data: encode(new Uint8Array(int16.buffer)),
    mimeType: 'audio/pcm;rate=16000',
  };
}
// --- End: Audio Helper Functions ---

// --- Start: SVG Icons ---
const MicIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
    <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="23"></line>
  </svg>
);
const StopCircleIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <circle cx="12" cy="12" r="10"></circle><rect x="9" y="9" width="6" height="6"></rect>
  </svg>
);
const LoaderIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="animate-spin" {...props}>
      <line x1="12" y1="2" x2="12" y2="6"></line><line x1="12" y1="18" x2="12" y2="22"></line>
      <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line>
      <line x1="2" y1="12" x2="6" y2="12"></line><line x1="18" y1="12" x2="22" y2="12"></line>
      <line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line>
  </svg>
);
// --- End: SVG Icons ---

type SimulationState = 'idle' | 'starting' | 'active' | 'generating_report' | 'report';
type TranscriptEntry = { speaker: 'Auditor' | 'You'; text: string };

const SCENARIOS = [
  'ISO 27001: Information Security',
  'SOC 2: Trust Services Criteria',
  'ISO 9001: Quality Management',
  'Financial Controls (SOX)',
];

const auditPrepAISystemInstruction = (scenario: string) => `You are "AuditPrepAI", an elite AI Audit Co-Pilot conducting a simulated audit interview.
Your persona is a professional, experienced auditor for ${scenario}.
Your task is to conduct a realistic, voice-based audit interview.
- Start with a professional opening statement.
- Ask questions one at a time, clearly and concisely.
- Wait for the user to respond before asking the next question.
- Based on the user's spoken answers, ask relevant follow-up questions.
- Maintain a professional and courteous tone throughout.
- Your responses will be converted to speech, so keep them natural for verbal delivery.
- Do not use markdown formatting like **bold** or lists.`;

const FILLER_WORDS_REGEX = /\b(ah|um|uh|er|like|okay|right|so|you know)\b/gi;

export const AuditSimulation: React.FC = () => {
  const [simulationState, setSimulationState] = useState<SimulationState>('idle');
  const [selectedScenario, setSelectedScenario] = useState(SCENARIOS[0]);
  const [transcript, setTranscript] = useState<TranscriptEntry[]>([]);
  const [finalReport, setFinalReport] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  
  // Real-time metrics state
  const [fillerWordCount, setFillerWordCount] = useState(0);
  const [wordCount, setWordCount] = useState(0);
  const [sessionStartTime, setSessionStartTime] = useState<number | null>(null);

  const sessionPromiseRef = useRef<Promise<any> | null>(null);
  const inputAudioContextRef = useRef<AudioContext | null>(null);
  const outputAudioContextRef = useRef<AudioContext | null>(null);
  const scriptProcessorRef = useRef<ScriptProcessorNode | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const mediaStreamSourceRef = useRef<MediaStreamAudioSourceNode | null>(null);

  const cleanup = useCallback(() => {
    scriptProcessorRef.current?.disconnect();
    scriptProcessorRef.current = null;
    mediaStreamSourceRef.current?.disconnect();
    mediaStreamSourceRef.current = null;
    inputAudioContextRef.current?.close().catch(console.error);
    inputAudioContextRef.current = null;
    outputAudioContextRef.current?.close().catch(console.error);
    outputAudioContextRef.current = null;
    mediaStreamRef.current?.getTracks().forEach(track => track.stop());
    mediaStreamRef.current = null;
    sessionPromiseRef.current?.then(session => session.close()).catch(console.error);
    sessionPromiseRef.current = null;
    // Reset metrics
    setFillerWordCount(0);
    setWordCount(0);
    setSessionStartTime(null);
  }, []);

  useEffect(() => {
    return () => {
      cleanup();
    };
  }, [cleanup]);

  const startSimulation = async () => {
    setError(null);
    setTranscript([]);
    setFinalReport('');
    setSimulationState('starting');
    setSessionStartTime(Date.now());


    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;

      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

      inputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      outputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      
      let nextStartTime = 0;
      const sources = new Set<AudioBufferSourceNode>();
      let currentInputText = '';

      sessionPromiseRef.current = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
        callbacks: {
          onopen: () => {
            const source = inputAudioContextRef.current!.createMediaStreamSource(stream);
            mediaStreamSourceRef.current = source;
            const scriptProcessor = inputAudioContextRef.current!.createScriptProcessor(4096, 1, 1);
            scriptProcessorRef.current = scriptProcessor;

            scriptProcessor.onaudioprocess = (audioProcessingEvent) => {
              const inputData = audioProcessingEvent.inputBuffer.getChannelData(0);
              const pcmBlob = createBlob(inputData);
              sessionPromiseRef.current?.then((session) => {
                session.sendRealtimeInput({ media: pcmBlob });
              });
            };
            source.connect(scriptProcessor);
            scriptProcessor.connect(inputAudioContextRef.current!.destination);
            setSimulationState('active');
          },
          onmessage: async (message: LiveServerMessage) => {
            if (message.serverContent?.inputTranscription) {
              const text = message.serverContent.inputTranscription.text;
              currentInputText += text;
              const fillers = (text.match(FILLER_WORDS_REGEX) || []).length;
              if (fillers > 0) {
                  setFillerWordCount(prev => prev + fillers);
              }
              const words = (text.match(/\b\w+\b/g) || []).length;
              if (words > 0) {
                  setWordCount(prev => prev + words);
              }
              setTranscript(prev => {
                const last = prev[prev.length - 1];
                if (last?.speaker === 'You') {
                  return [...prev.slice(0, -1), { ...last, text: currentInputText }];
                }
                return [...prev, { speaker: 'You', text }];
              });
            } else if(message.serverContent?.turnComplete) {
                currentInputText = '';
            } else if (message.serverContent?.outputTranscription) {
              const text = message.serverContent.outputTranscription.text;
               setTranscript(prev => {
                const last = prev[prev.length - 1];
                if (last?.speaker === 'Auditor') {
                  return [...prev.slice(0, -1), { ...last, text: last.text + text }];
                }
                return [...prev, { speaker: 'Auditor', text }];
              });
            }

            const base64EncodedAudioString = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
            if (base64EncodedAudioString) {
              nextStartTime = Math.max(nextStartTime, outputAudioContextRef.current!.currentTime);
              const audioBuffer = await decodeAudioData(decode(base64EncodedAudioString), outputAudioContextRef.current!, 24000, 1);
              const source = outputAudioContextRef.current!.createBufferSource();
              source.buffer = audioBuffer;
              source.connect(outputAudioContextRef.current!.destination);
              source.addEventListener('ended', () => sources.delete(source));
              source.start(nextStartTime);
              nextStartTime += audioBuffer.duration;
              sources.add(source);
            }
          },
          onerror: (e: ErrorEvent) => {
            console.error('Session error:', e);
            setError('A session error occurred. Please try again.');
            setSimulationState('idle');
            cleanup();
          },
          onclose: () => {
            console.log('Session closed');
          },
        },
        config: {
          responseModalities: [Modality.AUDIO],
          inputAudioTranscription: {},
          outputAudioTranscription: {},
          systemInstruction: auditPrepAISystemInstruction(selectedScenario),
        },
      });
    } catch (err) {
      console.error('Failed to start simulation:', err);
      setError('Could not access microphone. Please grant permission and try again.');
      setSimulationState('idle');
    }
  };

  const endSimulation = async () => {
    cleanup();
    setSimulationState('generating_report');
    
    const fullTranscript = transcript.map(t => `${t.speaker}: ${t.text}`).join('\n');
    const reportPrompt = `Based on the following audit interview transcript, provide a summary of the interviewee's performance, identify key strengths and weaknesses, and suggest actionable improvements for better audit readiness. Format the response as a professional report in markdown. Use headings for "Overall Summary", "Strengths", "Areas for Improvement", and "Actionable Recommendations". \n\nTranscript:\n\n${fullTranscript}`;
    
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-pro',
            contents: reportPrompt,
        });
        setFinalReport(response.text);
    } catch (err) {
        console.error("Failed to generate report:", err);
        setFinalReport("Could not generate a report at this time.");
    }

    setSimulationState('report');
  };

  const calculateWPM = () => {
      if (!sessionStartTime || wordCount === 0) return 0;
      const elapsedTimeMinutes = (Date.now() - sessionStartTime) / (1000 * 60);
      return Math.round(wordCount / elapsedTimeMinutes);
  }

  const renderContent = () => {
    switch (simulationState) {
      case 'idle':
        return <StartScreen scenarios={SCENARIOS} selectedScenario={selectedScenario} setSelectedScenario={setSelectedScenario} onStart={startSimulation} error={error} />;
      case 'starting':
        return <div className="flex flex-col items-center justify-center h-full text-gray-600"><LoaderIcon className="w-12 h-12 mb-4" /><p className="text-lg">Initializing simulation...</p></div>;
      case 'active':
        return <LiveScreen transcript={transcript} onEnd={endSimulation} wpm={calculateWPM()} fillerCount={fillerWordCount} />;
      case 'generating_report':
        return <div className="flex flex-col items-center justify-center h-full text-gray-600"><LoaderIcon className="w-12 h-12 mb-4" /><p className="text-lg">Analyzing performance and generating report...</p></div>;
      case 'report':
        return <ReportScreen report={finalReport} onRestart={() => setSimulationState('idle')} />;
    }
  };

  return <div className="h-[calc(100vh-10rem)] bg-white rounded-xl border border-gray-border shadow-sm">{renderContent()}</div>;
};

// --- Sub-Components for different states ---

const StartScreen: React.FC<{scenarios: string[], selectedScenario: string, setSelectedScenario: (s: string) => void, onStart: () => void, error: string | null}> = ({scenarios, selectedScenario, setSelectedScenario, onStart, error}) => (
    <div className="flex flex-col items-center justify-center h-full p-8 text-center">
        <ShieldCheckIcon className="w-16 h-16 text-brand-primary mb-4"/>
        <h2 className="text-3xl font-bold text-gray-800">Audit Interview Simulator</h2>
        <p className="mt-2 mb-8 max-w-lg text-gray-600">Prepare for your next audit with a realistic, AI-powered interview. Select a scenario and click "Start Interview" to begin. You will need to grant microphone access.</p>
        <div className="w-full max-w-md">
            <label htmlFor="scenario" className="block text-sm font-medium text-gray-700 text-left mb-2">Select Audit Scenario</label>
            <select id="scenario" value={selectedScenario} onChange={e => setSelectedScenario(e.target.value)} className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-light focus:border-brand-light">
                {scenarios.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
        </div>
        {error && <div className="mt-4 text-sm text-red-600 bg-red-50 p-3 rounded-md">{error}</div>}
        <button onClick={onStart} className="mt-8 flex items-center justify-center px-8 py-4 bg-brand-primary text-white font-bold rounded-lg hover:bg-brand-secondary transition-colors text-lg">
            <MicIcon className="w-6 h-6 mr-3"/>
            Start Interview
        </button>
    </div>
);

const LiveScreen: React.FC<{transcript: TranscriptEntry[], onEnd: () => void, wpm: number, fillerCount: number}> = ({transcript, onEnd, wpm, fillerCount}) => {
    const transcriptEndRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        transcriptEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [transcript]);
    
    const confidence = fillerCount < 5 ? 'High' : fillerCount < 15 ? 'Medium' : 'Low';
    const paceDescription = wpm < 120 ? 'A bit slow' : wpm > 160 ? 'A bit fast' : 'Optimal';


    return (
        <div className="flex h-full">
            <div className="flex-1 flex flex-col p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex-shrink-0">Live Interview Transcript</h3>
                <div className="flex-1 overflow-y-auto pr-4 space-y-4">
                    {transcript.map((entry, i) => (
                        <div key={i} className={`flex items-start gap-3 ${entry.speaker === 'You' ? 'justify-end' : ''}`}>
                            {entry.speaker === 'Auditor' && <div className="w-8 h-8 rounded-full bg-brand-primary flex items-center justify-center flex-shrink-0 text-white mt-1"><ShieldCheckIcon className="w-5 h-5"/></div>}
                            <div className={`p-3 rounded-lg max-w-lg ${entry.speaker === 'Auditor' ? 'bg-gray-100' : 'bg-brand-surface text-brand-primary'}`}>{entry.text || '...'}</div>
                        </div>
                    ))}
                     <div ref={transcriptEndRef} />
                </div>
                <div className="mt-6 flex justify-center flex-shrink-0">
                    <button onClick={onEnd} className="flex items-center px-6 py-3 bg-status-red text-white font-bold rounded-lg hover:bg-red-700 transition-colors">
                        <StopCircleIcon className="w-6 h-6 mr-2"/> End Session
                    </button>
                </div>
            </div>
            <div className="w-80 bg-gray-light border-l border-gray-border p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-6">Performance Metrics</h3>
                <div className="space-y-6">
                    <MetricCard icon={<ZapIcon/>} title="Pace (WPM)" value={`${wpm}`} description={paceDescription}/>
                    <MetricCard icon={<BarChartIcon/>} title="Filler Words" value={fillerCount} description="Count of 'um', 'ah', etc."/>
                    <MetricCard icon={<BrainCircuitIcon/>} title="Confidence" value={confidence} description="Based on filler word usage."/>
                </div>
            </div>
        </div>
    );
};

const MetricCard: React.FC<{icon: React.ReactNode, title: string, value: string | number, description: string}> = ({icon, title, value, description}) => (
    <div>
        <div className="flex items-center text-gray-600 mb-2">
           <span className="w-5 h-5 mr-2">{icon}</span>
           <h4 className="font-semibold">{title}</h4>
        </div>
        <p className="text-3xl font-bold text-brand-primary">{value}</p>
        <p className="text-sm text-gray-500 mt-1">{description}</p>
    </div>
);


const ReportScreen: React.FC<{report: string, onRestart: () => void}> = ({report, onRestart}) => (
    <div className="flex flex-col h-full p-8">
        <div className="flex justify-between items-center mb-4 flex-shrink-0">
            <h2 className="text-3xl font-bold text-gray-800 flex items-center"><FileTextIcon className="w-8 h-8 mr-3 text-brand-primary"/>Performance Report</h2>
            <button onClick={onRestart} className="px-5 py-2 bg-brand-primary text-white font-semibold rounded-lg hover:bg-brand-secondary transition-colors">
                Start New Simulation
            </button>
        </div>
        <div className="flex-1 overflow-y-auto bg-gray-light p-6 rounded-lg border border-gray-border">
            <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: report.replace(/\n/g, '<br />').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
        </div>
    </div>
);
