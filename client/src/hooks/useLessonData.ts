import { useState, useEffect } from 'react';
import type { Lesson } from '@/types/lesson';
import api from '@/utils/api';

export const useLessonData = (moduleId: string) => {
    const [lessons, setLessons] = useState<Lesson | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchLessons = async () => {
            try {
                setLoading(true);
                const response = await api.get(`/lessons/${moduleId}`);
                setLessons(response.data);
            } catch (err) {
                setError((err as Error).message);
            } finally {
                setLoading(false);
            }
        };

        fetchLessons();
    }, [moduleId]);

    return { lessons, loading, error };
};