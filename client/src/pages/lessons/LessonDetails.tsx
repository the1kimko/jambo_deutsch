// src/pages/lessons/LessonDetail.tsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Volume2, CheckCircle, XCircle } from 'lucide-react';
import api from '@/utils/api';

interface Question {
  type: 'multiple-choice';
  question: string;
  audio: boolean;
  options: string[];
  correct: number;
}

interface Lesson {
  title: string;
  questions: Question[];
}

const LessonDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [qIdx, setQIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  useEffect(() => {
    api.get(`/lessons/${id}`).then((r) => setLesson(r.data));
  }, [id]);

  if (!lesson) return null;

  const q = lesson.questions[qIdx];
  const progress = ((qIdx + 1) / lesson.questions.length) * 100;

  const play = () => {
    const utter = new SpeechSynthesisUtterance(q.question);
    utter.lang = 'de-DE';
    window.speechSynthesis.speak(utter);
  };

  const choose = (i: number) => {
    setSelected(i);
    setIsCorrect(i === q.correct);
  };

  const next = () => {
    if (qIdx < lesson.questions.length - 1) {
      setQIdx(qIdx + 1);
      setSelected(null);
      setIsCorrect(null);
    } else {
      navigate('/lessons');
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="max-w-lg mx-auto w-full p-4 space-y-6 flex-1">
        {/* Header */}
        <div className="space-y-3">
          <Button variant="ghost" size="sm" onClick={() => navigate('/lessons')}>
            Exit
          </Button>
          <div>
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-sm font-medium text-muted-foreground">
                Question {qIdx + 1} of {lesson.questions.length}
              </h2>
              <span className="text-sm font-medium text-primary">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </div>

        {/* Question */}
        <Card className="p-6 shadow-card">
          <div className="flex items-start justify-between gap-4 mb-6">
            <h3 className="text-xl font-semibold text-foreground flex-1">{q.question}</h3>
            {q.audio && (
              <Button variant="outline" size="icon" onClick={play}>
                <Volume2 className="w-5 h-5" />
              </Button>
            )}
          </div>

          <div className="space-y-3">
            {q.options.map((opt, i) => (
              <button
                key={i}
                onClick={() => choose(i)}
                disabled={selected !== null}
                className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                  selected === i
                    ? isCorrect
                      ? 'border-success bg-success/10'
                      : 'border-destructive bg-destructive/10'
                    : 'border-border hover:border-primary hover:bg-muted'
                } disabled:cursor-not-allowed`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium text-foreground">{opt}</span>
                  {selected === i && (isCorrect ? <CheckCircle className="w-5 h-5 text-success" /> : <XCircle className="w-5 h-5 text-destructive" />)}
                </div>
              </button>
            ))}
          </div>
        </Card>

        {/* Feedback */}
        {selected !== null && (
          <Card className={`p-6 ${isCorrect ? 'bg-success/10' : 'bg-destructive/10'}`}>
            <div className="flex items-start gap-3">
              {isCorrect ? (
                <CheckCircle className="w-6 h-6 text-success flex-shrink-0 mt-0.5" />
              ) : (
                <XCircle className="w-6 h-6 text-destructive flex-shrink-0 mt-0.5" />
              )}
              <div>
                <h4 className="font-semibold mb-1 text-foreground">
                  {isCorrect ? 'Correct! Well done!' : 'Not quite right'}
                </h4>
                <p className="text-sm text-muted-foreground">
                  {isCorrect ? 'Keep up the great work!' : `Correct: ${q.options[q.correct]}`}
                </p>
              </div>
            </div>
          </Card>
        )}
      </div>

      {/* Bottom CTA */}
      <div className="border-t border-border bg-card p-4">
        <div className="max-w-lg mx-auto">
          <Button
            variant="hero"
            size="lg"
            className="w-full"
            onClick={next}
            disabled={selected === null}
          >
            {qIdx < lesson.questions.length - 1 ? 'Next Question' : 'Finish'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LessonDetail;
