// src/pages/pronunciation/Pronunciation.tsx
import React, { useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Mic, Volume2, CheckCircle, XCircle, RotateCcw, UploadCloud, Pause, Play } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import BottomNav from '@/components/common/BottomNav';
import api from '@/utils/api';
import { useToast } from '@/hooks/use-toast';

interface Word {
  german: string;
  english: string;
  difficulty: 'Easy' | 'Medium';
}

const WORDS: Word[] = [
  { german: 'Guten Tag', english: 'Good day', difficulty: 'Easy' },
  { german: 'Entschuldigung', english: 'Excuse me', difficulty: 'Medium' },
  { german: 'Danke schön', english: 'Thank you very much', difficulty: 'Easy' },
  { german: 'Wie geht es dir?', english: 'How are you?', difficulty: 'Medium' },
];

const Pronunciation: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [wordIdx, setWordIdx] = useState(0);
  const [recorder, setRecorder] = useState<MediaRecorder | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [chunks, setChunks] = useState<Blob[]>([]);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [duration, setDuration] = useState(0);
  const [note, setNote] = useState('');
  const [uploading, setUploading] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const word = WORDS[wordIdx];

  const playExample = () => {
    const utter = new SpeechSynthesisUtterance(word.german);
    utter.lang = 'de-DE';
    window.speechSynthesis.speak(utter);
  };

  const startTimer = () => {
    timerRef.current = setInterval(() => {
      setDuration((prev) => prev + 1);
    }, 1000);
  };

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const beginRecording = async () => {
    if (recorder) {
      recorder.start();
      setIsRecording(true);
      startTimer();
      chunksRef.current = [];
      setPreviewUrl(null);
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
          setChunks((prev) => [...prev, event.data]);
        }
      };
      mediaRecorder.onstop = () => {
        stopTimer();
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        setPreviewUrl(URL.createObjectURL(blob));
      };
      mediaRecorder.start();
      setRecorder(mediaRecorder);
      setIsRecording(true);
      startTimer();
      chunksRef.current = [];
      setPreviewUrl(null);
    } catch (error) {
      console.error(error);
      toast({ title: 'Microphone blocked', description: 'Please allow microphone access.' });
    }
  };

  const stopRecording = () => {
    if (!recorder) return;
    recorder.stop();
    setIsRecording(false);
  };

  const discardRecording = () => {
    chunksRef.current = [];
    setChunks([]);
    setPreviewUrl(null);
    setDuration(0);
    setNote('');
  };

  const uploadRecording = async () => {
    if (!previewUrl || !chunksRef.current.length) return;
    const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
    const formData = new FormData();
    formData.append('audio', blob, 'sprachprobe.webm');
    formData.append('phrase', word.german);
    formData.append('location', note);
    formData.append('duration', duration.toString());
    setUploading(true);
    try {
      await api.post('/practice/recordings', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      await Promise.allSettled([
        api.post('/progress/xp', { moduleId: 'pronunciation', xp: 15 }),
        api.post('/progress/streak', {}),
      ]);
      toast({ title: 'Recording saved!', description: 'We will analyze and share feedback soon.' });
      discardRecording();
    } catch (error) {
      console.error(error);
      toast({ title: 'Upload failed', description: 'Please try again.' });
    } finally {
      setUploading(false);
    }
  };

  const statusMessage = useMemo(() => {
    if (isRecording) return 'Recording… tap to stop';
    if (previewUrl) return 'Preview your recording or upload it for review.';
    return 'Tap to record';
  }, [isRecording, previewUrl]);

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="max-w-lg mx-auto p-4 space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard')}>
            Back
          </Button>
          <h1 className="text-3xl font-bold text-foreground">Pronunciation Coach</h1>
          <p className="text-muted-foreground">Practice speaking German</p>
        </div>

        {/* Progress */}
        <div className="flex justify-between items-center">
          <Badge variant="secondary">{wordIdx + 1} / {WORDS.length}</Badge>
          <Badge variant={word.difficulty === 'Easy' ? 'default' : 'secondary'}>
            {word.difficulty}
          </Badge>
        </div>

        {/* Word Card */}
        <Card className="p-8 shadow-card text-center space-y-6">
          <div className="space-y-2">
            <div className="flex items-center justify-center gap-3">
              <h2 className="text-4xl font-bold text-primary">{word.german}</h2>
              <Button variant="ghost" size="icon" onClick={playExample}>
                <Volume2 className="w-6 h-6" />
              </Button>
            </div>
            <p className="text-muted-foreground">{word.english}</p>
          </div>

          <div className="py-6 flex flex-col items-center gap-4">
            <button
              onClick={isRecording ? stopRecording : beginRecording}
              className={`w-24 h-24 rounded-full flex items-center justify-center transition-all ${
                isRecording
                  ? 'bg-destructive animate-pulse-glow'
                  : 'bg-gradient-primary hover:scale-110 shadow-elegant'
              }`}
            >
              {isRecording ? (
                <Pause className="w-10 h-10 text-white" />
              ) : (
                <Mic className="w-10 h-10 text-primary-foreground" />
              )}
            </button>

            <div className="w-full">
              <Progress value={Math.min((duration / 30) * 100, 100)} />
              <p className="mt-2 text-xs text-muted-foreground text-center">
                {statusMessage} {duration > 0 && !isRecording ? `(${duration}s)` : ''}
              </p>
            </div>
          </div>
        </Card>

        {previewUrl && (
          <Card className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <p className="font-semibold text-foreground">Your recording</p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={discardRecording}>
                  <RotateCcw className="w-4 h-4 mr-1" />
                  Discard
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  onClick={uploadRecording}
                  disabled={uploading}
                >
                  <UploadCloud className="w-4 h-4 mr-1" />
                  {uploading ? 'Uploading…' : 'Save'}
                </Button>
              </div>
            </div>
            <audio controls src={previewUrl} className="w-full" />
            <Textarea
              placeholder="Notes or location (optional)"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="rounded-2xl"
            />
          </Card>
        )}

        {/* Tips */}
        <Card className="p-6 shadow-card">
          <h3 className="font-semibold mb-3 text-foreground">Tips</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• Listen to the example first</li>
            <li>• Speak clearly and at a moderate pace</li>
            <li>• Find a quiet place</li>
            <li>• Practice regularly</li>
          </ul>
        </Card>
      </div>

      <BottomNav />
    </div>
  );
};

export default Pronunciation;
