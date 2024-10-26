export type Result = {
    model: string;
    difficultyLevel: number;
    iteration: number;
    duration?: number;
    hasValidJsonFormat: boolean;
    hasValidSchema: boolean;
    hasValidData: boolean;
    absoluteScore: number;
    relativeScore: number;
    isSuccessful: boolean;
};
