"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { HSKWord } from "@/lib/types";
import { Button } from "../ui/button";
import { Volume2 } from "lucide-react";
import { StrokeOrderDialog } from "./stroke-order-dialog";

type WordCardProps = {
  word: HSKWord;
};

export function WordCard({ word }: WordCardProps) {
  const handleSpeak = () => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(word.hanzi);
      utterance.lang = "zh-CN";
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <Card className="flex flex-col glass border-white/5 rounded-3xl p-2 group hover:border-primary/30 transition-all duration-300">
      <CardHeader>
        <div className="flex justify-between items-start">
            <div>
                <CardTitle className="text-4xl font-light serif italic text-primary">{word.hanzi}</CardTitle>
                <CardDescription className="text-[10px] uppercase tracking-widest opacity-40 mt-1">{word.pinyin}</CardDescription>
            </div>
            <Button variant="ghost" size="icon" onClick={handleSpeak} className="rounded-full hover:bg-white/5 text-primary">
                <Volume2 className="h-5 w-5" />
                <span className="sr-only">Phát âm</span>
            </Button>
        </div>
        <p className="text-lg pt-4 font-light text-foreground/90">{word.meaning}</p>
      </CardHeader>
      <CardContent className="flex-grow space-y-3 mt-2">
        <p className="text-[10px] uppercase tracking-widest font-bold opacity-30">Ví dụ minh họa</p>
        <div className="pl-4 border-l border-primary/30 py-1">
            <p className="text-sm font-medium">{word.example.hanzi}</p>
            <p className="text-[10px] opacity-40 italic mt-1 leading-relaxed">"{word.example.meaning}"</p>
        </div>
      </CardContent>
      <CardFooter className="flex-wrap gap-2 pt-4">
        <StrokeOrderDialog character={word.hanzi} />
      </CardFooter>
    </Card>
  );
}
