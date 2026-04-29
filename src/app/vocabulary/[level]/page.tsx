import { getHskWordsByLevel } from "@/lib/data";
import { WordCard } from "@/components/vocabulary/word-card";
import { PageHeader } from "@/components/page-header";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

type VocabularyPageProps = {
  params: {
    level: string;
  };
};

export function generateMetadata({ params }: VocabularyPageProps) {
    return {
        title: `Từ vựng HSK ${params.level} | HSK by Duc`,
    };
}


export default function VocabularyPage({ params }: VocabularyPageProps) {
  const { level } = params;
  const words = getHskWordsByLevel(level);

  if (words.length === 0) {
    return (
        <div className="flex flex-col w-full bg-background text-foreground min-h-screen">
            <PageHeader title={`HSK ${level}`} description="Không tìm thấy dữ liệu cho cấp độ này."/>
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
    <div className="flex flex-col w-full bg-background text-foreground min-h-screen">
       <PageHeader 
          title={`Từ vựng HSK ${level}`} 
          subtitle="Học HSK by Duc"
          description={`Duyệt qua ${words.length} từ vựng trong danh sách.`}
        />
      <div className="p-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {words.map((word) => (
          <WordCard key={word.id} word={word} />
        ))}
      </div>
    </div>
  );
}
