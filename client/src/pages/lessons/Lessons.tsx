// src/pages/lessons/Lessons.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Headphones, Mic2, PenTool, Play, Lock, CheckCircle2 } from 'lucide-react';
import BottomNav from '@/components/common/BottomNav';
import api from '@/utils/api';

interface Module {
  id: number;
  moduleId: string;
  title: string;
  description: string;
  completed: boolean;
  locked: boolean;
  progress: number;
}

const Lessons: React.FC = () => {
  const navigate = useNavigate();
  const [modules, setModules] = useState<Module[]>([]);

  useEffect(() => {
    api.get('/lessons').then((r) => setModules(r.data));
  }, []);

  const skills = [
    { name: 'Listening', Icon: Headphones, color: 'bg-secondary' },
    { name: 'Speaking', Icon: Mic2, color: 'bg-accent' },
    { name: 'Reading', Icon: BookOpen, color: 'bg-primary' },
    { name: 'Writing', Icon: PenTool, color: 'bg-success' },
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="max-w-lg mx-auto p-4 space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard')}>
            Back
          </Button>
          <h1 className="text-3xl font-bold text-foreground">Lessons</h1>
          <p className="text-muted-foreground">Choose a module to practice</p>
        </div>

        {/* Skill filter */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {skills.map((s) => (
            <Button key={s.name} variant="outline" size="sm" className="flex-shrink-0">
              <s.Icon className="w-4 h-4 mr-2" />
              {s.name}
            </Button>
          ))}
        </div>

        {/* Modules */}
        <div className="space-y-4">
          {modules.map((m) => (
            <Card
              key={m.moduleId ?? m.id}
              className={`p-6 shadow-card ${m.locked ? 'opacity-60' : 'hover:shadow-elegant transition-shadow'}`}
            >
              <div className="flex items-start gap-4">
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    m.completed ? 'bg-success' : m.locked ? 'bg-muted' : 'bg-primary'
                  }`}
                >
                  {m.completed ? (
                    <CheckCircle2 className="w-6 h-6 text-success-foreground" />
                  ) : m.locked ? (
                    <Lock className="w-6 h-6 text-muted-foreground" />
                  ) : (
                    <Play className="w-6 h-6 text-primary-foreground" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="font-semibold text-foreground">{m.title}</h3>
                    {m.completed && <Badge variant="secondary">Complete</Badge>}
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{m.description}</p>

                  {!m.locked && m.progress > 0 && (
                    <div className="mb-3">
                      <div className="flex justify-between text-xs text-muted-foreground mb-1">
                        <span>Progress</span>
                        <span>{m.progress}%</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full transition-all"
                          style={{ width: `${m.progress}%` }}
                        />
                      </div>
                    </div>
                  )}

                  <Button
                    variant={m.completed ? 'secondary' : 'default'}
                    size="sm"
                    className="w-full"
                    disabled={m.locked}
                    onClick={() => navigate(`/lessons/${m.moduleId ?? m.id}`)}
                  >
                    {m.locked ? 'Locked' : m.completed ? 'Review' : 'Start'}
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default Lessons;
