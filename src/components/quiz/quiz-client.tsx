"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { HSKWord, QuizScore } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { CheckCircle, XCircle, Award, Volume2 } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

type QuizClientProps = {
  words: HSKWord[];
  level: number;
};

// New question types
type QuestionType =
  | "meaning_for_hanzi"
  | "hanzi_for_audio"
  | "pinyin_for_hanzi"
  | "fill_in_the_blank";

type BaseQuestion = {
  id: string;
  questionType: QuestionType;
  word: HSKWord;
};

type MeaningForHanziQuestion = BaseQuestion & {
  questionType: "meaning_for_hanzi";
  options: string[];
  correctAnswer: string;
};

type HanziForAudioQuestion = BaseQuestion & {
  questionType: "hanzi_for_audio";
  options: string[];
  correctAnswer: string;
};

type PinyinForHanziQuestion = BaseQuestion & {
  questionType: "pinyin_for_hanzi";
  correctAnswer: string; // pinyin without tone marks
};

type FillInTheBlankQuestion = BaseQuestion & {
  questionType: "fill_in_the_blank";
  sentence: string;
  options: string[];
  correctAnswer: string;
};

type Question =
  | MeaningForHanziQuestion
  | HanziForAudioQuestion
  | PinyinForHanziQuestion
  | FillInTheBlankQuestion;


function shuffleArray<T>(array: T[]): T[] {
  let currentIndex = array.length,  randomIndex;

  while (currentIndex != 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }

  return array;
}

function removePinyinTones(pinyin: string): string {
    if (!pinyin) return "";
    return pinyin
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/ü/g, "u");
}


export function QuizClient({ words, level }: QuizClientProps) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [typedAnswer, setTypedAnswer] = useState("");
  const [score, setScore] = useState(0);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [quizFinished, setQuizFinished] = useState(false);

  const [scores, setScores] = useLocalStorage<QuizScore[]>("hsk-scores", []);
  const [alias] = useLocalStorage<string>("hsk-alias", "");

  useEffect(() => {
    const generateQuestions = () => {
      // Create a copy before shuffling to avoid mutating the original 'words' prop
      const quizWords = shuffleArray([...words]).slice(0, 10);
      const allQuestionTypes: QuestionType[] = [
        "meaning_for_hanzi",
        "hanzi_for_audio",
        "pinyin_for_hanzi",
        "fill_in_the_blank",
      ];

      const newQuestions: Question[] = quizWords.map((correctWord, index) => {
        const id = `${correctWord.id}-${Date.now()}-${index}`;
        const otherWords = words.filter((w) => w.id !== correctWord.id);
        
        const possibleTypes = allQuestionTypes.filter(type => {
            if (type === 'fill_in_the_blank' && (!correctWord.example?.hanzi || !correctWord.example.hanzi.includes(correctWord.hanzi))) {
                return false;
            }
            return true;
        });

        const questionType = possibleTypes[Math.floor(Math.random() * possibleTypes.length)];

        switch (questionType) {
          case "hanzi_for_audio": {
            const wrongOptions = shuffleArray(otherWords).slice(0, 3).map((w) => w.hanzi);
            const options = shuffleArray([correctWord.hanzi, ...wrongOptions]);
            return {
              id,
              word: correctWord,
              questionType,
              options,
              correctAnswer: correctWord.hanzi,
            };
          }
          case "pinyin_for_hanzi": {
            return {
              id,
              word: correctWord,
              questionType,
              correctAnswer: removePinyinTones(correctWord.pinyin),
            };
          }
          case "fill_in_the_blank": {
            const wrongOptions = shuffleArray(otherWords).slice(0, 3).map(w => w.hanzi);
            const options = shuffleArray([correctWord.hanzi, ...wrongOptions]);
            return {
              id,
              word: correctWord,
              questionType,
              sentence: correctWord.example.hanzi.replace(correctWord.hanzi, "____"),
              options,
              correctAnswer: correctWord.hanzi,
            };
          }
          case "meaning_for_hanzi":
          default: {
            const wrongOptions = shuffleArray(otherWords).slice(0, 3).map((w) => w.meaning);
            const options = shuffleArray([correctWord.meaning, ...wrongOptions]);
            return {
              id,
              word: correctWord,
              questionType: "meaning_for_hanzi",
              options,
              correctAnswer: correctWord.meaning,
            };
          }
        }
      });

      setQuestions(shuffleArray(newQuestions));
      setCurrentQuestionIndex(0);
      setScore(0);
      setQuizFinished(false);
      setIsAnswered(false);
      setSelectedAnswer(null);
      setTypedAnswer("");
      setIsCorrect(false);
    };

    if (words && words.length >= 4) {
      generateQuestions();
    }
  }, [words]); // Only re-generate questions when the 'words' prop changes.

  const speak = useCallback((text: string) => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "zh-CN";
      window.speechSynthesis.speak(utterance);
    }
  }, []);

  const handleAnswer = (answer: string) => {
    if (isAnswered) return;
    
    const currentQuestion = questions[currentQuestionIndex];
    let correct = false;

    if (currentQuestion.questionType === 'pinyin_for_hanzi') {
        setSelectedAnswer(answer);
        correct = answer.trim().toLowerCase() === currentQuestion.correctAnswer.toLowerCase();
    } else {
        setSelectedAnswer(answer);
        correct = answer === currentQuestion.correctAnswer;
    }

    if (correct) {
      setScore(score + 1);
    }
    setIsCorrect(correct);
    setIsAnswered(true);
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setIsAnswered(false);
      setSelectedAnswer(null);
      setTypedAnswer("");
      setIsCorrect(false);
    } else {
      const finalScore = Math.round((score / questions.length) * 100);
      if (alias) {
        const newScore: QuizScore = {
            level,
            score: finalScore,
            date: new Date().toISOString(),
            alias: alias,
        };
        setScores([...scores, newScore]);
      }
      setQuizFinished(true);
    }
  };
  
  const handlePinyinSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      handleAnswer(typedAnswer);
  }

  const currentQuestion = useMemo(() => questions[currentQuestionIndex], [questions, currentQuestionIndex]);
  
  if (questions.length === 0) {
    return (
      <Card className="w-full max-w-2xl glass border-white/5 rounded-3xl p-12 text-center">
        <CardHeader>
          <CardTitle className="serif italic">Đang chuẩn bị học liệu...</CardTitle>
        </CardHeader>
      </Card>
    );
  }

  const progressValue = ((currentQuestionIndex + 1) / questions.length) * 100;

  if (quizFinished) {
    const finalScore = Math.round((score / questions.length) * 100);
    return (
      <Card className="w-full max-w-2xl glass border-white/5 rounded-3xl p-12 text-center flex flex-col items-center">
        <CardHeader className="items-center">
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6">
            <Award className="w-10 h-10 text-primary" />
          </div>
          <CardTitle className="text-4xl serif italic">Hoàn thành!</CardTitle>
          <p className="text-xs uppercase tracking-widest opacity-40 mt-2">Bạn đã hoàn tất lộ trình đánh giá</p>
        </CardHeader>
        <CardContent className="space-y-6 w-full">
          <div className="text-6xl font-light text-primary">{finalScore}%</div>
          <p className="text-sm opacity-60">
            Độ chính xác đạt {score} trên {questions.length} mục tiêu kiến thức.
          </p>
          <div className="flex gap-4 justify-center pt-8">
            <Button onClick={() => window.location.reload()} className="rounded-full bg-primary text-primary-foreground px-8 h-12 text-[10px] uppercase tracking-widest font-bold">Làm lại</Button>
            <Button asChild variant="outline" className="rounded-full border-white/10 px-8 h-12 text-[10px] uppercase tracking-widest font-bold">
                <Link href="/">Về Trang chủ</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const renderQuestionSpecifics = () => {
    if (!currentQuestion) return null;

    switch (currentQuestion.questionType) {
      case "meaning_for_hanzi":
        return (
          <>
            <div className="flex flex-col items-center py-8">
              <span className="text-8xl serif italic accent-text mb-4">
                {currentQuestion.word.hanzi}
              </span>
              <span className="text-xs uppercase tracking-[0.3em] opacity-40">
                {currentQuestion.word.pinyin}
              </span>
            </div>
            <p className="text-center text-[10px] uppercase tracking-widest font-bold opacity-30 mb-6">Xác định ý nghĩa chính xác</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentQuestion.options.map((option) => {
                const isCorrectOption = option === currentQuestion.correctAnswer;
                const isSelected = option === selectedAnswer;
                return (
                  <Button
                    key={option}
                    variant="outline"
                    className={cn(
                      "h-auto py-5 text-sm rounded-2xl border-white/10 hover:bg-white/5 transition-all duration-300",
                      isAnswered && isCorrectOption && "bg-primary/20 border-primary text-primary hover:bg-primary/20",
                      isAnswered && isSelected && !isCorrectOption && "bg-red-500/10 border-red-500 text-red-500 hover:bg-red-500/10"
                    )}
                    onClick={() => handleAnswer(option)}
                    disabled={isAnswered}
                  >
                    {option}
                  </Button>
                );
              })}
            </div>
          </>
        );
      case "hanzi_for_audio":
        return (
          <>
            <div className="text-center py-12">
              <Button size="icon" className="w-24 h-24 rounded-full bg-primary/10 hover:bg-primary/20 border border-primary/20 text-primary transition-all duration-500" onClick={() => speak(currentQuestion.word.hanzi)}>
                <Volume2 className="w-10 h-10" />
              </Button>
            </div>
             <p className="text-center text-[10px] uppercase tracking-widest font-bold opacity-30 mb-6">Nghe và nhận diện ký tự</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentQuestion.options.map((option) => {
                    const isCorrectOption = option === currentQuestion.correctAnswer;
                    const isSelected = option === selectedAnswer;
                    return (
                        <Button
                            key={option}
                            variant="outline"
                            className={cn(
                            "h-auto py-6 text-3xl serif rounded-2xl border-white/10 hover:bg-white/5 transition-all duration-300",
                            isAnswered && isCorrectOption && "bg-primary/20 border-primary text-primary hover:bg-primary/20",
                            isAnswered && isSelected && !isCorrectOption && "bg-red-500/10 border-red-500 text-red-500 hover:bg-red-500/10"
                            )}
                            onClick={() => handleAnswer(option)}
                            disabled={isAnswered}
                        >
                            {option}
                        </Button>
                    );
                })}
            </div>
          </>
        );
      case "pinyin_for_hanzi":
        return (
          <>
            <div className="flex flex-col items-center py-8">
              <span className="text-8xl serif italic accent-text mb-4">
                {currentQuestion.word.hanzi}
              </span>
              <p className="text-[10px] uppercase tracking-widest font-bold opacity-30">Phiên âm Latinh tương ứng</p>
            </div>
            <form onSubmit={handlePinyinSubmit} className="flex flex-col items-center gap-6 max-w-xs mx-auto">
              <Input
                value={typedAnswer}
                onChange={(e) => setTypedAnswer(e.target.value)}
                disabled={isAnswered}
                placeholder="Nhập pinyin (không dấu)..."
                className="text-center h-12 rounded-xl bg-white/5 border-white/10 focus:border-primary/50 text-lg"
              />
              {!isAnswered && <Button type="submit" className="rounded-full bg-primary px-8 text-[10px] uppercase tracking-widest font-bold h-10">Xác nhận</Button>}
            </form>
          </>
        );
      case "fill_in_the_blank":
        return (
          <>
            <div className="flex flex-col items-center py-12 text-center">
              <span className="text-2xl font-light mb-4 leading-relaxed">
                {currentQuestion.sentence}
              </span>
              <p className="text-[10px] uppercase tracking-widest font-bold opacity-30 mt-4">Điền từ còn thiếu</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentQuestion.options.map((option) => {
                const isCorrectOption = option === currentQuestion.correctAnswer;
                const isSelected = option === selectedAnswer;
                return (
                  <Button
                    key={option}
                    variant="outline"
                    className={cn(
                      "h-auto py-5 text-xl serif rounded-2xl border-white/10 hover:bg-white/5 transition-all duration-300",
                      isAnswered && isCorrectOption && "bg-primary/20 border-primary text-primary hover:bg-primary/20",
                      isAnswered && isSelected && !isCorrectOption && "bg-red-500/10 border-red-500 text-red-500 hover:bg-red-500/10"
                    )}
                    onClick={() => handleAnswer(option)}
                    disabled={isAnswered}
                  >
                    {option}
                  </Button>
                );
              })}
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <Card className="w-full max-w-2xl glass border-white/5 rounded-3xl overflow-hidden">
      <CardHeader className="p-0">
        <div className="h-1.5 w-full bg-white/5">
            <div 
              className="h-full bg-primary transition-all duration-500 ease-out" 
              style={{ width: `${progressValue}%` }}
            />
        </div>
      </CardHeader>
      <CardContent className="p-8">
        <div className="space-y-4">
            {renderQuestionSpecifics()}
        </div>

        {isAnswered && (
          <div className="flex flex-col items-center gap-6 pt-8 mt-12 border-t border-white/5">
             <div className={cn(
                "w-full p-4 rounded-2xl text-center font-bold text-xs uppercase tracking-widest",
                isCorrect ? "bg-primary/10 text-primary border border-primary/20" : "bg-red-500/10 text-red-400 border border-red-500/20"
             )}>
                {isCorrect ? "Phân tích chính xác" : "Cần xem xét lại"}
             </div>
            <div className="text-center p-6 bg-white/5 rounded-2xl w-full flex flex-col items-center">
                <span className="text-[10px] uppercase tracking-widest opacity-30 mb-3">Thông tin chi tiết</span>
                <p className="text-4xl serif italic text-primary">{currentQuestion.word.hanzi}</p>
                <div className="flex gap-3 items-center mt-3">
                   <span className="text-xs uppercase tracking-widest opacity-60">{currentQuestion.word.pinyin}</span>
                   <span className="w-1 h-1 rounded-full bg-white/20"></span>
                   <span className="text-sm font-light text-foreground/80">{currentQuestion.word.meaning}</span>
                </div>
            </div>
            <Button onClick={handleNext} className="w-full rounded-full h-12 bg-white text-black hover:bg-white/90 text-[10px] uppercase tracking-widest font-bold">
              {currentQuestionIndex === questions.length - 1
                ? "Tổng hợp kết quả"
                : "Mục tiêu tiếp theo"}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}