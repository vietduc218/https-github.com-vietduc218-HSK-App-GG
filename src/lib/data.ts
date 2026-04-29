import { HSKWord } from "./types";
import hsk1 from "./hsk-data/hsk1.json";
import hsk2 from "./hsk-data/hsk2.json";
import hsk3 from "./hsk-data/hsk3.json";
import hsk4 from "./hsk-data/hsk4.json";
import hsk5 from "./hsk-data/hsk5.json";
import hsk6 from "./hsk-data/hsk6.json";

const allWords: Record<string, HSKWord[]> = {
  "1": hsk1,
  "2": hsk2,
  "3": hsk3,
  "4": hsk4,
  "5": hsk5,
  "6": hsk6,
};

export function getHskWordsByLevel(level: string | number): HSKWord[] {
  const levelStr = String(level);
  return allWords[levelStr] || [];
}

export function getHskWord(
  level: string | number,
  wordId: string | number
): HSKWord | undefined {
  const words = getHskWordsByLevel(level);
  return words.find((word) => String(word.id) === String(wordId));
}

export function getAllHskWords(): HSKWord[] {
  return Object.values(allWords).flat();
}
