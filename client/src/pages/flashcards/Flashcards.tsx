// src/pages/flashcards/Flashcards.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Volume2, ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react';
import BottomNav from '@/components/common/BottomNav';

interface Flashcard {
  german: string;
  english: string;
  category: string;
}

const CARDS: Flashcard[] = [
  { german: 'Hallo', english: 'Hello', category: 'Greetings' },
  { german: 'Danke', english: 'Thank you', category: 'Greetings' },
  { german: 'Guten Morgen', english: 'Good morning', category: 'Greetings' },
  { german: 'Tschüss', english: 'Goodbye', category: 'Greetings' },
  { german: 'Ja', english: 'Yes', category: 'Basic' },
  { german: 'Nein', english: 'No', category: 'Basic' },
  { german: 'Bitte', english: 'Please', category: 'Greetings' },
  { german: 'Entschuldigung', english: 'Excuse me', category: 'Greetings' },
];

const Flashcards: React.FC = () => {
  const navigate = useNavigate();
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const card = CARDS[idx];

  const play = () => {
    const utter = new SpeechSynthesisUtterance(card.german);
    utter.lang = 'de-DE';
    window.speechSynthesis.speak(utter);
  };

  const next = () => {
    if (idx < CARDS.length - 1) {
      setIdx(idx + 1);
      setFlipped(false);
    }
  };
  const prev = () => {
    if (idx > 0) {
      setIdx(idx - 1);
      setFlipped(false);
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="max-w-lg mx-auto p-4 space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard')}>
            Back
          </Button>
          <h1 className="text-3xl font-bold text-foreground">Flashcards</h1>
          <p className="text-muted-foreground">Card {idx + 1} of {CARDS.length}</p>
        </div>

        <div className="flex justify-center">
          <Badge variant="secondary" className="px-4 py-1">
            {card.category}
          </Badge>
        </div>

        {/* Flip Card */}
        <div className="relative" style={{ perspective: '1000px' }}>
          <div
            className="relative w-full transition-transform duration-500 cursor-pointer"
            style={{
              transformStyle: 'preserve-3d',
              transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
            }}
            onClick={() => setFlipped(!flipped)}
          >
            {/* Front */}
            <Card
              className={`min-h-[400px] p-8 shadow-elegant flex flex-col items-center justify-center ${flipped ? 'invisible' : 'visible'}`}
              style={{ backfaceVisibility: 'hidden' }}
            >
              <div className="flex items-center gap-3 mb-8">
                <span className="text-6xl font-bold text-primary">{card.german}</span>
                <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); play(); }}>
                  <Volume2 className="w-6 h-6" />
                </Button>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <RotateCcw className="w-4 h-4" />
                <span className="text-sm">Tap to reveal</span>
              </div>
            </Card>

            {/* Back */}
            <Card
              className="absolute inset-0 min-h-[400px] p-8 shadow-elegant flex flex-col items-center justify-center"
              style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
            >
              <span className="text-6xl font-bold text-secondary mb-8">{card.english}</span>
              <div className="flex items-center gap-2 text-muted-foreground">
                <RotateCcw className="w-4 h-4" />
                <span className="text-sm">Tap to flip back</span>
              </div>
            </Card>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center gap-4">
          <Button variant="outline" size="lg" onClick={prev} disabled={idx === 0}>
            <ChevronLeft className="w-5 h-5 mr-2" />
            Previous
          </Button>

          <div className="text-center">
            <div className="text-sm text-muted-foreground">{idx + 1} / {CARDS.length}</div>
          </div>

          <Button variant="outline" size="lg" onClick={next} disabled={idx === CARDS.length - 1}>
            Next
            <ChevronRight className="w-5 h-5 ml-2" />
          </Button>
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-2">
          {CARDS.map((_, i) => (
            <button
              key={i}
              onClick={() => { setIdx(i); setFlipped(false); }}
              className={`w-2 h-2 rounded-full transition-all ${i === idx ? 'bg-primary w-6' : 'bg-muted'}`}
            />
          ))}
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default Flashcards;