import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useInterviewStore } from '../store/interviewStore.js';
import { ROUTES } from '../shared/constants/routes.js';
import Button from '../shared/components/Button.jsx';
import Card from '../shared/components/Card.jsx';
import Modal from '../shared/components/Modal.jsx';
import { Spinner, FullPageLoader } from '../shared/components/Loader.jsx';
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Send,
  Timer,
  Info,
  LogOut,
  AlertCircle,
  Play
} from 'lucide-react';

const correctTechnicalTerms = (text) => {
  if (!text) return '';
  let corrected = text;
  
  const corrections = [
    // JWT
    { regex: /\bjason\s+webtocking\b/gi, replacement: 'JSON Web Token' },
    { regex: /\bjason\s+webtocken\b/gi, replacement: 'JSON Web Token' },
    { regex: /\bjason\s+web\s+tokens\b/gi, replacement: 'JSON Web Tokens' },
    { regex: /\bjason\s+web\s+token\b/gi, replacement: 'JSON Web Token' },
    { regex: /\bjason\s+web\b/gi, replacement: 'JSON Web Token' },
    { regex: /\bjason\s+webtok\b/gi, replacement: 'JSON Web Token' },
    
    // Tech terms
    { regex: /\bfront\s+and\s+family\b/gi, replacement: 'frontend' },
    { regex: /\bfront\s+and\b/gi, replacement: 'frontend' },
    { regex: /\bback\s+and\b/gi, replacement: 'backend' },
    { regex: /\bcreative\s+cells\b/gi, replacement: 'credentials' },
    { regex: /\bstate\s+less\b/gi, replacement: 'stateless' },
    { regex: /\bmicro\s+services\b/gi, replacement: 'microservices' },
    { regex: /\bmicro\s+service\b/gi, replacement: 'microservice' },
    { regex: /\bsql\s+join\b/gi, replacement: 'SQL Join' },
    { regex: /\bsql\s+joins\b/gi, replacement: 'SQL Joins' },
    { regex: /\breact\s+hook\b/gi, replacement: 'React Hook' },
    { regex: /\breact\s+hooks\b/gi, replacement: 'React Hooks' },
    { regex: /\bweb\s+bro\b/gi, replacement: 'web' },
    { regex: /\bweb\s+broken\b/gi, replacement: 'web token' }
  ];

  for (const { regex, replacement } of corrections) {
    corrected = corrected.replace(regex, replacement);
  }
  return corrected;
};

const InterviewPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    activeInterview,
    activeMessages,
    loading,
    messageLoading,
    error,
    fetchInterviewDetails,
    startInterview,
    sendMessage,
    endInterview,
    clearError,
  } = useInterviewStore();

  const [messageText, setMessageText] = useState('');
  
  // Audio Playback & Capture states
  const [isMuted, setIsMuted] = useState(false);
  const [isListening, setIsListeningState] = useState(false);
  const isListeningRef = useRef(false);
  const setIsListening = (val) => {
    setIsListeningState(val);
    isListeningRef.current = val;
  };
  const [isAISpeaking, setIsAISpeaking] = useState(false);
  
  // Timer states
  const [secondsRemaining, setSecondsRemaining] = useState(0);

  // Modal states
  const [isConfirmEndOpen, setIsConfirmEndOpen] = useState(false);
  const [isTimeOutOpen, setIsTimeOutOpen] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);
  
  // Reference hooks
  const chatBottomRef = useRef(null);
  const recognitionRef = useRef(null);
  const lastSpokenMessageIdRef = useRef(null);
  const hasStartedRef = useRef(false);
  const preSpeechTextRef = useRef('');

  // 1. Initial Load: Fetch Details
  useEffect(() => {
    fetchInterviewDetails(id);
    return () => {
      // Clean up audio synthesis on page leave
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      clearError();
    };
  }, [id, fetchInterviewDetails, clearError]);

  // 2. Start Interview if pending
  useEffect(() => {
    if (!activeInterview) return;
    if (
      activeInterview.status === 'pending' &&
      activeMessages.length === 0 &&
      !loading &&
      !error &&
      !hasStartedRef.current
    ) {
      hasStartedRef.current = true;
      startInterview(activeInterview._id);
    }
  }, [activeInterview, startInterview, loading, error, activeMessages.length]);

  // 3. Isolated Countdown Timer with persistence in localStorage
  useEffect(() => {
    if (!activeInterview || activeInterview.status !== 'active') return;

    // Check localStorage for saved seconds first
    const savedTime = localStorage.getItem(`interview_timer_${activeInterview._id}`);
    let secs = 0;
    if (savedTime !== null) {
      secs = parseInt(savedTime, 10);
    } else {
      const minutes = activeInterview.duration || 10;
      secs = minutes * 60;
    }
    setSecondsRemaining(secs);

    const interval = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          localStorage.removeItem(`interview_timer_${activeInterview._id}`);
          handleAutoEnd();
          return 0;
        }
        const nextVal = prev - 1;
        localStorage.setItem(`interview_timer_${activeInterview._id}`, String(nextVal));
        return nextVal;
      });
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [activeInterview?._id, activeInterview?.status]);

  // 4. Auto Scroll & Speech Synthesis Trigger on messages update
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });

    // Speak the last message if it's from the interviewer and hasn't been spoken yet
    if (activeMessages.length > 0 && !isMuted) {
      const lastMsg = activeMessages[activeMessages.length - 1];
      if (lastMsg.sender === 'interviewer' && lastMsg._id !== lastSpokenMessageIdRef.current) {
        lastSpokenMessageIdRef.current = lastMsg._id;
        speakText(lastMsg.message);
      }
    }
  }, [activeMessages, isMuted]);

  // 4. Initialize Speech Recognition (Speech-to-Text)
  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = true;
      rec.interimResults = true;
      rec.lang = 'en-US';

      rec.onresult = (event) => {
        if (!isListeningRef.current) return;
        let speechText = '';
        for (let i = 0; i < event.results.length; ++i) {
          speechText += event.results[i][0].transcript;
        }
        const base = preSpeechTextRef.current.trim();
        const correctedSpeech = correctTechnicalTerms(speechText);
        setMessageText(base ? `${base} ${correctedSpeech.trim()}` : correctedSpeech.trim());
      };

      rec.onerror = (e) => {
        console.error('Speech recognition error:', e.error);
        setIsListening(false);
      };

      rec.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = rec;
    } else {
      console.warn('Web Speech Recognition API is not supported in this browser.');
    }
  }, []);

  // Speak aloud helper
  const speakText = (text) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;

    window.speechSynthesis.cancel(); // Mute ongoing audio first

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    // Manage speaking state triggers
    utterance.onstart = () => {
      setIsAISpeaking(true);
      // Auto turn off microphone if user is speaking
      if (isListeningRef.current && recognitionRef.current) {
        recognitionRef.current.stop();
        setIsListening(false);
      }
    };
    
    const handleSpeechEnd = () => {
      setIsAISpeaking(false);
    };

    utterance.onend = handleSpeechEnd;
    utterance.onerror = handleSpeechEnd;

    // Pick professional voice if available
    const voices = window.speechSynthesis.getVoices();
    const englishVoice = voices.find(
      (v) => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google'))
    );
    if (englishVoice) {
      utterance.voice = englishVoice;
    }

    window.speechSynthesis.speak(utterance);
  };

  // Toggle Microphone (STT)
  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert('Speech Recognition is not supported by your browser. Please try Chrome or Safari.');
      return;
    }

    if (isListeningRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      // Stop TTS if AI is speaking
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      // Record text that was in the input box before starting speech-to-text
      preSpeechTextRef.current = messageText;
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        console.error('Failed to start Speech Recognition:', err);
      }
    }
  };

  // Submit response handler
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!messageText.trim() || messageLoading) return;

    // Stop microphone if it is active
    if (isListeningRef.current && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }

    const text = messageText.trim();
    setMessageText('');
    
    await sendMessage(activeInterview._id, text);
  };

  // End Interview manually
  const handleEndInterview = () => {
    if (!activeInterview) return;
    
    // Pause STT/TTS while modal is open
    if (isListeningRef.current && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setIsConfirmEndOpen(true);
  };

  const confirmEndInterview = async () => {
    setIsConfirmEndOpen(false);
    setIsTimeOutOpen(false);
    localStorage.removeItem(`interview_timer_${activeInterview._id}`);
    setIsEvaluating(true);
    
    const res = await endInterview(activeInterview._id);
    setIsEvaluating(false);
    if (res && res.result) {
      navigate(`/interviews/${activeInterview._id}/result`);
    }
  };

  // Automatic End when Timer reaches 0
  const handleAutoEnd = () => {
    if (!activeInterview) return;
    
    if (isListeningRef.current && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setIsTimeOutOpen(true);
  };

  // Format timer
  const formatTime = (secs) => {
    const minutes = Math.floor(secs / 60);
    const remainingSeconds = secs % 60;
    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
  };

  // Show full loading spinner if activeInterview is not loaded
  if (loading && !activeInterview) {
    return <FullPageLoader message="Setting up AI Interview Room..." />;
  }

  // Show evaluating loading spinner during AI scoring compile phase
  if (isEvaluating) {
    return <FullPageLoader message="Evaluating your responses & compiling feedback... Please wait." />;
  }

  if (!activeInterview) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-slate-50 border border-slate-200 rounded-xl text-center">
        <AlertCircle className="h-10 w-10 text-rose-550 mb-4" />
        <h3 className="text-base font-semibold text-slate-800">Interview Not Found</h3>
        <p className="text-xs text-slate-500 mt-1 mb-4">The requested interview does not exist or you do not have permission to view it.</p>
        <Button onClick={() => navigate(ROUTES.DASHBOARD)}>Back to Dashboard</Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:grid lg:grid-cols-4 gap-4 lg:gap-6 h-[calc(100vh-7rem)] lg:h-[calc(100vh-8.5rem)]">
      
      {/* Mobile Header (only visible on screens below lg) */}
      <div className="lg:hidden flex items-center justify-between p-3 bg-white border border-slate-200 rounded-xl shadow-sm shrink-0">
        <div className="flex items-center gap-2">
          <Timer className="h-5 w-5 text-indigo-650 animate-pulse" />
          <div>
            <span className="text-[10px] text-slate-500 font-bold uppercase block tracking-wider leading-none">Time Left</span>
            <span className="text-sm font-bold font-mono text-slate-800">
              {formatTime(secondsRemaining)}
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {/* TTS Toggle */}
          <button
            type="button"
            onClick={() => {
              const newMuted = !isMuted;
              setIsMuted(newMuted);
              if (newMuted && typeof window !== 'undefined' && window.speechSynthesis) {
                window.speechSynthesis.cancel();
              }
            }}
            className={`p-2 rounded-lg border transition-all ${
              !isMuted
                ? 'bg-indigo-50 border-indigo-200 text-indigo-700'
                : 'bg-slate-50 border-slate-200 text-slate-500'
            }`}
            title={isMuted ? 'Turn on AI Voice' : 'Turn off AI Voice'}
          >
            {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </button>

          {/* End Session Button */}
          <Button
            variant="danger"
            size="sm"
            onClick={handleEndInterview}
            icon={LogOut}
          >
            End
          </Button>
        </div>
      </div>

      {/* Left panel - Status & Controls */}
      <div className="hidden lg:flex lg:col-span-1 flex-col gap-4 h-full">
        {/* Info Card */}
        <Card title="Interview Room" className="shrink-0 border-slate-200 shadow-sm">
          <div className="space-y-4">
            <div>
              <span className="text-[10px] text-slate-550 font-bold uppercase block tracking-wider mb-0.5">Topic</span>
              <p className="text-sm font-bold text-slate-800">{activeInterview.topic}</p>
            </div>
            
            <div>
              <span className="text-[10px] text-slate-550 font-bold uppercase block tracking-wider mb-0.5">Role</span>
              <p className="text-xs text-slate-600">{activeInterview.role}</p>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="text-[10px] text-slate-550 font-bold uppercase block tracking-wider mb-0.5">Difficulty</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-50 border border-indigo-200 text-indigo-700 font-semibold uppercase tracking-wider">
                  {activeInterview.difficulty}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-550 font-bold uppercase block tracking-wider mb-0.5">Type</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-blue-50 border border-blue-200 text-blue-700 font-semibold uppercase tracking-wider">
                  {activeInterview.interviewType}
                </span>
              </div>
            </div>
          </div>
        </Card>

        {/* Live Controls Card */}
        <Card className="flex-1 flex flex-col justify-between border-slate-200 shadow-sm">
          <div className="space-y-5">
            {/* Timer display */}
            <div className="flex items-center gap-3 p-4 rounded-lg bg-slate-50 border border-slate-200">
              <Timer className="h-6 w-6 text-indigo-600 animate-pulse" />
              <div>
                <span className="text-[10px] text-slate-500 font-bold uppercase block tracking-wider">Time Remaining</span>
                <span className="text-lg font-bold font-mono text-slate-800">
                  {formatTime(secondsRemaining)}
                </span>
              </div>
            </div>

            {/* Audio Toggle & Indicators */}
            <div className="space-y-3">
              <span className="text-[10px] text-slate-500 font-bold uppercase block tracking-wider">Audio Tools</span>
              
              {/* Speak Toggle */}
              <button
                onClick={() => {
                  const newMuted = !isMuted;
                  setIsMuted(newMuted);
                  if (newMuted && typeof window !== 'undefined' && window.speechSynthesis) {
                    window.speechSynthesis.cancel();
                  }
                }}
                className={`w-full flex items-center justify-between p-2.5 rounded-lg border transition-all text-xs font-semibold ${
                  !isMuted
                    ? 'bg-indigo-50 border-indigo-200 text-indigo-700'
                    : 'bg-slate-50 border-slate-200 text-slate-500'
                }`}
              >
                <span className="flex items-center gap-2">
                  {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                  AI TTS Voice
                </span>
                <span>{isMuted ? 'OFF' : 'ON'}</span>
              </button>

              {/* STT Status Indicator */}
              {isListening && (
                <div className="flex items-center justify-center gap-2 p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-[10px] font-semibold tracking-wider uppercase animate-pulse">
                  <span className="h-2 w-2 bg-rose-655 rounded-full animate-ping" />
                  Microphone Listening
                </div>
              )}
            </div>
          </div>

          <Button
            variant="danger"
            onClick={handleEndInterview}
            className="w-full mt-6"
            icon={LogOut}
          >
            End Interview
          </Button>
        </Card>
      </div>

      {/* Right panel - Chat Interface */}
      <div className="flex-1 min-h-0 lg:col-span-3 flex flex-col bg-slate-50 rounded-xl border border-slate-200 overflow-hidden lg:h-full">
        {/* Chat Feed */}
        <div className="flex-1 p-4 md:p-6 overflow-y-auto space-y-4">
          
          {/* Welcome/First prompt */}
          {activeMessages.length === 0 && !error && (
            <div className="flex flex-col items-center justify-center text-center p-8 space-y-3 h-full">
              <div className="relative">
                <div className="absolute inset-0 bg-indigo-200/50 rounded-full blur animate-ping" />
                <div className="p-3 bg-indigo-50 rounded-full border border-indigo-200 text-indigo-650 relative">
                  <Play className="h-6 w-6 animate-pulse" />
                </div>
              </div>
              <h3 className="text-sm font-bold text-slate-800">Prepare for First Question</h3>
              <p className="text-xs text-slate-500 max-w-sm">The interviewer will greet you and ask the opening question. Speak or type clearly.</p>
              {loading && <p className="text-xs text-indigo-600 animate-pulse mt-2">Connecting to AI Interview Engine...</p>}
            </div>
          )}

          {/* Error Banner with Retry */}
          {error && (
            <div className="rounded-xl p-6 bg-rose-50 border border-rose-200 text-rose-700 flex flex-col items-center gap-3 text-center max-w-md mx-auto my-12 shadow-md">
              <div className="p-3 bg-rose-50 rounded-full text-rose-600 border border-rose-200">
                <AlertCircle className="h-8 w-8 animate-bounce" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-800">Failed to Start Interview</h4>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">{error}</p>
              </div>
              <div className="flex flex-col gap-2 w-full mt-2">
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => {
                    hasStartedRef.current = false;
                    clearError();
                    startInterview(activeInterview._id);
                  }}
                >
                  Retry Request
                </Button>
                <button
                  type="button"
                  onClick={() => navigate(ROUTES.DASHBOARD)}
                  className="text-xs text-slate-500 hover:text-slate-800 hover:underline font-semibold"
                >
                  Cancel and Return to Dashboard
                </button>
              </div>
            </div>
          )}

          {activeMessages.map((msg) => {
            const isAI = msg.sender === 'interviewer';
            return (
              <div
                key={msg._id}
                className={`flex gap-3 max-w-[85%] ${isAI ? 'mr-auto' : 'ml-auto flex-row-reverse'}`}
              >
                {/* Avatar Icon */}
                <div className={`h-8 w-8 rounded-full border flex items-center justify-center shrink-0 text-xs font-bold uppercase select-none ${
                  isAI
                    ? 'bg-slate-100 border-slate-200 text-indigo-650'
                    : 'bg-indigo-600 border-indigo-500 text-white'
                }`}>
                  {isAI ? 'AI' : 'ME'}
                </div>

                {/* Message Body */}
                <div className={`rounded-xl px-4 py-3 text-xs md:text-sm leading-relaxed ${
                  isAI
                    ? 'bg-white border border-slate-200 text-slate-800 shadow-sm'
                    : 'bg-indigo-600 text-white shadow-sm'
                }`}>
                  <p className="whitespace-pre-line">{msg.message}</p>
                </div>
              </div>
            );
          })}

          {/* AI Typing Indicator bubble */}
          {messageLoading && (
            <div className="flex gap-3 mr-auto max-w-[80%]">
              <div className="h-8 w-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-indigo-655 text-xs font-bold">
                AI
              </div>
              <div className="rounded-xl px-4 py-3.5 bg-white border border-slate-200 flex items-center gap-1 shadow-sm">
                <span className="h-1.5 w-1.5 bg-slate-400 rounded-full typing-dot" />
                <span className="h-1.5 w-1.5 bg-slate-400 rounded-full typing-dot" />
                <span className="h-1.5 w-1.5 bg-slate-400 rounded-full typing-dot" />
              </div>
            </div>
          )}

          <div ref={chatBottomRef} />
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSendMessage} className="p-4 border-t border-slate-200 bg-slate-50 flex items-center gap-2">
          {/* Micro Button STT */}
          <button
            type="button"
            onClick={(messageLoading || isAISpeaking) ? undefined : toggleListening}
            disabled={messageLoading || isAISpeaking}
            className={`p-3.5 rounded-lg border transition-all ${
              (messageLoading || isAISpeaking)
                ? 'opacity-30 cursor-not-allowed bg-slate-105 border-slate-200 text-slate-400'
                : isListening
                ? 'bg-rose-500 hover:bg-rose-600 border-rose-500 text-white mic-active-pulse'
                : 'bg-white border-slate-200 text-slate-500 hover:text-slate-800 hover:border-slate-300'
            }`}
            title={
              (messageLoading || isAISpeaking)
                ? 'Interviewer is speaking or loading... please wait'
                : isListening
                ? 'Stop listening'
                : 'Start speaking your answer'
            }
          >
            {isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
          </button>

          {/* Text Input */}
          <input
            type="text"
            placeholder={
              (messageLoading || isAISpeaking)
                ? 'Please wait for the interviewer to finish speaking...'
                : isListening
                ? 'Listening... speak clearly.'
                : 'Type your technical response here...'
            }
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            disabled={messageLoading || isAISpeaking}
            className="flex-1 bg-white border border-slate-200 hover:border-slate-300 rounded-lg px-4 py-3 text-xs md:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          />

          {/* Send Action */}
          <button
            type="submit"
            disabled={!messageText.trim() || messageLoading || isAISpeaking}
            className="p-3.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-lg transition-colors shadow-sm focus:outline-none"
          >
            <Send className="h-5 w-5" />
          </button>
        </form>
      </div>

      {/* Confirm End Modal */}
      <Modal
        isOpen={isConfirmEndOpen}
        onClose={() => setIsConfirmEndOpen(false)}
        title="End Practice Session"
        footer={
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsConfirmEndOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={confirmEndInterview}
            >
              End & Evaluate
            </Button>
          </div>
        }
      >
        <p className="text-xs md:text-sm text-slate-600">
          Are you sure you want to end this mock interview now? The AI will compile your responses and evaluate your overall performance across all categories.
        </p>
      </Modal>

      {/* Time Out Modal */}
      <Modal
        isOpen={isTimeOutOpen}
        onClose={() => {}}
        closeOnOverlayClick={false}
        title="Time has Expired!"
        footer={
          <Button
            variant="primary"
            size="sm"
            onClick={confirmEndInterview}
          >
            View Evaluation Report
          </Button>
        }
      >
        <p className="text-xs md:text-sm text-slate-600">
          Your interview duration has ended. The AI interviewer has finished collecting responses and is ready to generate your performance feedback.
        </p>
      </Modal>
      
    </div>
  );
};

export default InterviewPage;
