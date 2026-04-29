"use client";

import { useState, useTransition } from "react";
import { getAiExamples } from "@/app/actions";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { Sparkles, Loader2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { useToast } from "@/hooks/use-toast";

type AiExampleViewProps = {
  word: {
    chineseCharacter: string;
    pinyin: string;
    vietnameseMeaning: string;
  };
};

export function AiExampleView({ word }: AiExampleViewProps) {
  const [isPending, startTransition] = useTransition();
  const [examples, setExamples] = useState<string[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  const handleGenerate = () => {
    // Don't re-generate if we already have examples
    if (examples) {
      setIsOpen(true);
      return;
    }

    setIsOpen(true);
    startTransition(async () => {
      setError(null);
      const result = await getAiExamples(word);
      if (result.success) {
        setExamples(result.examples);
      } else {
        setError(result.error || "Lỗi không xác định");
        toast({
          title: "Lỗi tạo ví dụ",
          description: result.error,
          variant: "destructive",
        })
        setIsOpen(false);
      }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="default" onClick={handleGenerate} disabled={isPending}>
          {isPending ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Sparkles className="mr-2 h-4 w-4" />
          )}
          Ví dụ AI
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Ví dụ nâng cao cho:{" "}
            <span className="text-primary">{word.chineseCharacter}</span>
          </DialogTitle>
        </DialogHeader>
        {isPending && (
          <div className="flex items-center justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="ml-4">AI đang viết ví dụ...</p>
          </div>
        )}
        {error && (
            <Alert variant="destructive">
                <AlertTitle>Lỗi</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        )}
        {examples && (
          <ul className="space-y-4 mt-4">
            {examples.map((ex, index) => (
              <li key={index} className="p-3 bg-secondary rounded-md text-secondary-foreground">
                {ex}
              </li>
            ))}
          </ul>
        )}
      </DialogContent>
    </Dialog>
  );
}
