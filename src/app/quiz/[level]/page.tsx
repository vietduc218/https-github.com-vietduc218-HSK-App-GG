import { getHskWordsByLevel } from "@/lib/data";
import { QuizClient } from "@/components/quiz/quiz-client";
import { PageHeader } from "@/components/page-header";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";


type QuizPageProps = {
  params: {
    level: string;
  };
};

export function generateMetadata({ params }: QuizPageProps) {
    return {
        title: `Bài tập HSK ${params.level} | HSK by Duc`,
    };
}


export default function QuizPage({ params }: QuizPageProps) {
  const { level } = params;
  const words = getHskWordsByLevel(level);

  if (words.length < 4) {
     return (
        <div className="flex flex-col w-full bg-background text-foreground min-h-screen">
            <PageHeader title={`Bài tập HSK ${level}`} description="Không đủ từ vựng để tạo bài quiz."/>
            <div className="p-6">
                <Button asChild variant="outline" className="rounded-full">
                    <Link href="/">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Quay lại trang chủ
                    </Link>
                </Button>
            </div>
        </div>
    );
  }

  return (
    <div className="flex flex-col w-full h-full bg-background text-foreground min-h-screen">
       <PageHeader 
          title={`Bài tập HSK ${level}`} 
          subtitle="Học HSK by Duc"
          description="Chọn nghĩa tiếng Việt đúng cho mỗi từ."
        />
       <div className="flex-grow p-8 grid place-items-center">
            <QuizClient words={words} level={parseInt(level, 10)} />
       </div>
    </div>
  );
}
