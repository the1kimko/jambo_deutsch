// src/pages/partners/Partners.tsx
import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, MapPin, Target, Search } from 'lucide-react';
import api from '@/utils/api';
import { usePartnerSocket } from '@/hooks/usePartnerSocket';
import { buildPartnerChatRoute } from '@/utils/constants';

interface Partner {
  id: string;
  name: string;
  location: string;
  level: string;
  goal: string;
  interests: string[];
  online: boolean;
}

const Partners: React.FC = () => {
  const navigate = useNavigate();
  const [all, setAll] = useState<Partner[]>([]);
  const [query, setQuery] = useState('');
  const [presenceMap, setPresenceMap] = useState<Record<string, boolean>>({});
  const { connected, joinPartnerRoom, presenceEvent } = usePartnerSocket();

  useEffect(() => {
    api.get('/partners').then((r) => setAll(r.data));
  }, []);

  useEffect(() => {
    if (!presenceEvent) return;
    setPresenceMap((prev) => ({
      ...prev,
      [presenceEvent.partnerId]: presenceEvent.online,
    }));
  }, [presenceEvent]);

  useEffect(() => {
    if (!connected || !all.length) return;
    all.forEach((partner) => joinPartnerRoom(partner.id));
  }, [connected, all, joinPartnerRoom]);

  const filtered = useMemo(
    () =>
      all.filter(
        (p) =>
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.location.toLowerCase().includes(query.toLowerCase()) ||
          p.goal.toLowerCase().includes(query.toLowerCase())
      ),
    [all, query]
  );

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="max-w-lg mx-auto p-4 space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard')}>
            Back
          </Button>
          <h1 className="text-3xl font-bold text-foreground">Study Partners</h1>
          <p className="text-muted-foreground">Connect with fellow learners</p>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder="Search by name, location, goal..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-10 h-12"
          />
        </div>

        {/* Quick filters */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          <Button variant="outline" size="sm">All Regions</Button>
          <Button variant="outline" size="sm">My Level</Button>
          <Button variant="outline" size="sm">Online Now</Button>
        </div>

        {/* List */}
        <div className="space-y-4">
          {filtered.map((p) => {
            const online = presenceMap[p.id] ?? p.online;
            return (
              <Card key={p.id} className="p-6 shadow-card hover:shadow-elegant transition-shadow">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center text-primary-foreground font-bold text-lg">
                      {p.name.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-foreground">{p.name}</h3>
                        {online && <div className="w-2 h-2 rounded-full bg-success animate-pulse" />}
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {p.level}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    <span>{p.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Target className="w-4 h-4" />
                    <span>{p.goal}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {p.interests.map((i) => (
                    <Badge key={i} variant="outline" className="text-xs">
                      {i}
                    </Badge>
                  ))}
                </div>

                <Button
                  variant="default"
                  size="sm"
                  className="w-full"
                  onClick={() => navigate(buildPartnerChatRoute(p.id))}
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Chat
                </Button>
              </Card>
            );
          })}
          {filtered.length === 0 && (
            <Card className="p-12 text-center shadow-card">
              <p className="text-muted-foreground">No partners found.</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Partners;
