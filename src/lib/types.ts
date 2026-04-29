export type HSKWord = {
  id: number;
  hanzi: string;
  pinyin: string;
  meaning: string;
  example: {
    hanzi: string;
    pinyin: string;
    meaning: string;
  };
};

export type QuizScore = {
  level: number;
  score: number;
  date: string;
  alias: string;
};

export type Alias = string;
