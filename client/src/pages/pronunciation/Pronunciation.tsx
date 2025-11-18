// src/pages/pronunciation/Pronunciation.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Mic, Volume2, CheckCircle, XCircle, RotateCcw } from 'lucide-react';
import BottomNav from '@/components/common/BottomNav';

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
  const [wordIdx, setWordIdx] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [hasRecorded, setHasRecorded] = useState(false);
  const [feedback, setFeedback] = useState<'good' | 'tryagain' | null>(null);

  const word = WORDS[wordIdx];

  const playExample = () => {
    const utter = new SpeechSynthesisUtterance(word.german);
    utter.lang = 'de-DE';
    window.speechSynthesis.speak(utter);
  };

  const toggleRecording = () => {
    if (isRecording) {
      setIsRecording(false);
      setHasRecorded(true);
      // fake analysis
      setTimeout(() => setFeedback(Math.random() > 0.3 ? 'good' : 'tryagain'), 800);
    } else {
      setIsRecording(true);
      setHasRecorded(false);
      setFeedback(null);
    }
  };

  const nextWord = () => {
    setWordIdx((i) => (i + 1) % WORDS.length);
    setIsRecording(false);
    setHasRecorded(false);
    setFeedback(null);
  };

  const retry = () => {
    setIsRecording(false);
    setHasRecorded(false);
    setFeedback(null);
  };

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

          <div className="py-8">
            <button
              onClick={toggleRecording}
              className={`w-24 h-24 rounded-full flex items-center justify-center transition-all ${
                isRecording
                  ? 'bg-destructive animate-pulse-glow'
                  : 'bg-gradient-primary hover:scale-110 shadow-elegant'
              }`}
            >
              <Mic className="w-12 h-12 text-primary-foreground" />
            </button>
          </div>

          <p className="text-sm text-muted-foreground">
            {isRecording
              ? 'Recording… tap to stop'
              : hasRecorded
              ? 'Analyzing…'
              : 'Tap to record'}
          </p>
        </Card>

        {/* Feedback */}
        {feedback && (
          <Card className={`p-6 ${feedback === 'good' ? 'bg-success/10' : 'bg-accent/10'}`}>
            <div className="flex items-start gap-3">
              {feedback === 'good' ? (
                <CheckCircle className="w-6 h-6 text-success flex-shrink-0" />
              ) : (
                <XCircle className="w-6 h-6 text-accent flex-shrink-0" />
              )}
              <div className="flex-1">
                <h3 className="font-semibold mb-2 text-foreground">
                  {feedback === 'good' ? 'Excellent pronunciation!' : 'Good try!'}
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {feedback === 'good'
                    ? 'Your pronunciation is clear and accurate.'
                    : 'Focus on the vowel sounds. Listen again and try once more.'}
                </p>
                <div className="flex gap-2">
                  {feedback === 'tryagain' && (
                    <Button variant="outline" size="sm" onClick={retry}>
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Try Again
                    </Button>
                  )}
                  <Button variant="default" size="sm" onClick={nextWord}>
                    {wordIdx < WORDS.length - 1 ? 'Next Word' : 'Start Over'}
                  </Button>
                </div>
              </div>
            </div>
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