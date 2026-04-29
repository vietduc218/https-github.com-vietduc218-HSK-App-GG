"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Sparkles, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { GoogleGenAI, Type } from "@google/genai";

// Initialize Gemini API
const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY! });

type Challenge = {
  chineseText: string;
  pinyin: string;
  referenceTranslation: string;
  topic: string;
};

type Evaluation = {
  score: number;
  feedback: string;
  suggestedTranslation: string;
  referenceTranslation: string;
};

export function TranslateClient() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const { toast } = useToast();

  const [topic, setTopic] = useState("Ngẫu nhiên");
  const [level, setLevel] = useState("HSK 3");

  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [userTranslation, setUserTranslation] = useState("");
  const [evaluation, setEvaluation] = useState<Evaluation | null>(null);

  const [showPinyin, setShowPinyin] = useState(false);

  const handleGenerate = async () => {
    setIsGenerating(true);
    setChallenge(null);
    setEvaluation(null);
    setUserTranslation("");
    setShowPinyin(false);

    const topicPrompt = topic === "Ngẫu nhiên" 
      ? "một chủ đề ngẫu nhiên phù hợp với cuộc sống hàng ngày hoặc học tập" 
      : `chủ đề "${topic}"`;

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Tạo một bài tập dịch thuật tiếng Trung sang tiếng Việt ở trình độ ${level} với ${topicPrompt}.
        Yêu cầu:
        1. Văn bản tiếng Trung nên gồm 2-4 câu, phù hợp với trình độ ${level}.
        2. Cung cấp Pinyin tương ứng.
        3. Cung cấp bản dịch tiếng Việt chuẩn để tham khảo.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              chineseText: { type: Type.STRING },
              pinyin: { type: Type.STRING },
              vietnameseTranslation: { type: Type.STRING },
              topic: { type: Type.STRING },
            },
            required: ["chineseText", "pinyin", "vietnameseTranslation", "topic"],
          },
        },
      });

      const result = JSON.parse(response.text || "{}");
      
      if (result.chineseText && result.pinyin && result.vietnameseTranslation) {
        setChallenge({
          chineseText: result.chineseText,
          pinyin: result.pinyin,
          referenceTranslation: result.vietnameseTranslation,
          topic: result.topic || topic,
        });
      } else {
        throw new Error("Dữ liệu AI trả về không hợp lệ");
      }
    } catch (error) {
      console.error("Lỗi khi tạo đề:", error);
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: "Không thể tạo nội dung mới. Vui lòng thử lại sau.",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmit = async () => {
    if (!challenge) return;
    setIsEvaluating(true);
    setEvaluation(null);

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Bạn là một chuyên gia ngôn ngữ Trung-Việt. Hãy chấm điểm bài dịch sau:
        Văn bản gốc: ${challenge.chineseText}
        Bản dịch của người dùng: ${userTranslation}
        Bản dịch tham khảo: ${challenge.referenceTranslation}
        
        Hãy đánh giá dựa trên:
        1. Độ chính xác về nghĩa.
        2. Ngữ pháp và từ vựng.
        3. Độ tự nhiên của câu văn tiếng Việt.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              score: { type: Type.NUMBER },
              feedback: { type: Type.STRING },
              suggestedTranslation: { type: Type.STRING },
            },
            required: ["score", "feedback", "suggestedTranslation"],
          },
        },
      });

      const result = JSON.parse(response.text || "{}");

      if (result.score !== undefined && result.feedback) {
        setEvaluation({
          score: result.score,
          feedback: result.feedback,
          suggestedTranslation: result.suggestedTranslation,
          referenceTranslation: challenge.referenceTranslation,
        });
      } else {
        throw new Error("Lỗi đánh giá");
      }
    } catch (error) {
      console.error("Lỗi khi chấm điểm:", error);
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: "Không thể chấm điểm bản dịch. Vui lòng thử lại.",
      });
    } finally {
      setIsEvaluating(false);
    }
  };

  const isLoading = isGenerating || isEvaluating;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Tùy chỉnh</CardTitle>
          <CardDescription>
            Chọn chủ đề và trình độ để tạo đoạn văn phù hợp.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid sm:grid-cols-3 gap-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Chủ đề</label>
            <Select value={topic} onValueChange={setTopic} disabled={isLoading}>
              <SelectTrigger>
                <SelectValue placeholder="Chọn chủ đề" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Ngẫu nhiên">Ngẫu nhiên</SelectItem>
                <SelectItem value="Đời sống">Đời sống</SelectItem>
                <SelectItem value="Công nghệ">Công nghệ</SelectItem>
                <SelectItem value="Du lịch">Du lịch</SelectItem>
                <SelectItem value="Công việc">Công việc</SelectItem>
                <SelectItem value="Văn hóa">Văn hóa</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">Trình độ</label>
            <Select value={level} onValueChange={setLevel} disabled={isLoading}>
              <SelectTrigger>
                <SelectValue placeholder="Chọn trình độ" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="HSK 1">HSK 1</SelectItem>
                <SelectItem value="HSK 2">HSK 2</SelectItem>
                <SelectItem value="HSK 3">HSK 3</SelectItem>
                <SelectItem value="HSK 4">HSK 4</SelectItem>
                <SelectItem value="HSK 5">HSK 5</SelectItem>
                <SelectItem value="HSK 6">HSK 6</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="sm:self-end">
             <Button onClick={handleGenerate} disabled={isLoading} className="w-full">
              {isGenerating ? <Loader2 className="animate-spin" /> : <Sparkles />}
              <span>Tạo nội dung mới</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {isGenerating && !challenge && (
        <div className="flex justify-center items-center p-12 bg-card rounded-lg border">
            <Loader2 className="animate-spin h-8 w-8 text-primary"/>
            <p className="ml-4 text-muted-foreground">Đang tạo nội dung dịch...</p>
        </div>
      )}

      {challenge && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle>Văn bản gốc (Tiếng Trung)</CardTitle>
                <CardDescription className="mt-1">
                  Chủ đề: <span className="text-primary font-medium">{challenge.topic}</span>
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-secondary rounded-lg text-lg leading-relaxed">
              <p lang="zh-CN">{challenge.chineseText}</p>
              {showPinyin && (
                <p className="text-sm text-muted-foreground mt-2 font-mono">{challenge.pinyin}</p>
              )}
            </div>
            <Separator />
            <div>
              <h3 className="font-semibold mb-2">Bản dịch của bạn</h3>
              <Textarea
                placeholder="Nhập bản dịch tiếng Việt của bạn vào đây..."
                rows={5}
                value={userTranslation}
                onChange={(e) => setUserTranslation(e.target.value)}
                disabled={isEvaluating}
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between items-center">
             <Button variant="outline" onClick={() => setShowPinyin(!showPinyin)}>
                {showPinyin ? "Ẩn" : "Hiện"} Pinyin
            </Button>
            <Button onClick={handleSubmit} disabled={isEvaluating || !userTranslation.trim()}>
              {isEvaluating ? <Loader2 className="animate-spin" /> : <Send />}
              <span>Chấm điểm</span>
            </Button>
          </CardFooter>
        </Card>
      )}

      {isEvaluating && (
          <div className="flex justify-center items-center p-12 bg-card rounded-lg border">
            <Loader2 className="animate-spin h-8 w-8 text-primary"/>
            <p className="ml-4 text-muted-foreground">AI đang chấm điểm bản dịch...</p>
        </div>
      )}

      {evaluation && !isEvaluating && (
          <Card className="border-primary">
              <CardHeader>
                  <CardTitle>Kết quả đánh giá</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                  <div>
                      <h4 className="font-semibold text-lg">Điểm số của bạn</h4>
                      <p className={cn("text-5xl font-bold mt-1", evaluation.score > 70 ? "text-green-500" : "text-amber-500")}>{evaluation.score} / 100</p>
                  </div>
                  <Separator />
                  <div>
                      <h4 className="font-semibold text-lg">Phản hồi từ AI</h4>
                      <div className="mt-2 p-4 bg-secondary rounded-lg prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap">
                        {evaluation.feedback}
                      </div>
                  </div>
                  <Separator />
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                        <h4 className="font-semibold text-lg">Bản dịch gợi ý (AI)</h4>
                        <p className="mt-2 p-4 bg-secondary rounded-lg">{evaluation.suggestedTranslation}</p>
                    </div>
                    <div>
                        <h4 className="font-semibold text-lg">Đáp án tham khảo</h4>
                        <p className="mt-2 p-4 bg-secondary rounded-lg">{evaluation.referenceTranslation}</p>
                    </div>
                  </div>
              </CardContent>
              <CardFooter>
                  <Button onClick={handleGenerate} disabled={isLoading} className="w-full">
                    {isGenerating ? <Loader2 className="animate-spin" /> : <Sparkles />}
                    <span>Tạo bài dịch mới</span>
                  </Button>
              </CardFooter>
          </Card>
      )}
    </div>
  );
}
