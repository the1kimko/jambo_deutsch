export interface Lesson {
    module: string;
    content: {
        horen: string[];
        lesen: string;
        schreiben: string[];
        sprechen: string[];
    };
    quiz: {
        question: string;
        options: string[];
        answer: string;
    }[];
    scenario: string;
}
