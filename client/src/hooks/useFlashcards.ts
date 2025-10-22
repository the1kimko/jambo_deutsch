import { useState, useEffect } from 'react';
import type { Flashcard } from '@/types/flashcard';
import api from '@/utils/api';

export const useFlashcards = (moduleId: string) => {
    const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchFlashcards = async () => {
            try {
                setLoading(true);
                const response = await api.get(`/flashcards/${moduleId}`);
                setFlashcards(response.data);
            } catch (err) {
                setError((err as Error).message);
            } finally {
                setLoading(false);
            }
        };

        if (moduleId) {
            fetchFlashcards();
        }
    }, [moduleId]);
    return { flashcards, loading, error };
};