import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, Book, BrainCircuit } from "lucide-react";
import { ProgressTracker } from "@/components/dashboard/progress-tracker";
import { PageHeader } from "@/components/page-header";

const hskLevels = [
  {
    level: 1,
    roman: "I",
    title: "HSK 1",
    description: "Nắm vững 150 từ cơ bản cho người mới bắt đầu.",
  },
  {
    level: 2,
    roman: "II",
    title: "HSK 2",
    description: "Mở rộng vốn từ lên 300 từ cho các cuộc hội thoại đơn giản.",
  },
  {
    level: 3,
    roman: "III",
    title: "HSK 3",
    description: "Học 600 từ để giao tiếp về cuộc sống hàng ngày.",
  },
  {
    level: 4,
    roman: "IV",
    title: "HSK 4",
    description: "Thành thạo 1200 từ thảo luận về nhiều chủ đề.",
  },
  {
    level: 5,
    roman: "V",
    title: "HSK 5",
    description:
      "Đạt 2500 từ để đọc báo và diễn đạt ý kiến phức tạp.",
  },
  {
    level: 6,
    roman: "VI",
    title: "HSK 6",
    description:
      "Nắm vững trên 5000 từ để giao tiếp như người bản xứ.",
  },
];

export default function DashboardPage() {
  return (
    <div className="flex flex-col w-full min-h-screen">
      <PageHeader
        title="Tổng quan Chương trình"
        description="Chọn cấp độ HSK để bắt đầu hành trình học tập của bạn."
      />

      <div className="p-8 grid grid-cols-1 md:grid-cols-12 gap-8">
        <div className="md:col-span-8 space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {hskLevels.map((item) => (
              <Card key={item.level} className="glass border-white/5 rounded-3xl p-6 flex flex-col group hover:border-primary/30 transition-all duration-500">
                <CardHeader className="p-0">
                  <span className="text-[10px] uppercase tracking-[0.3em] opacity-40 group-hover:text-primary group-hover:opacity-100 transition-colors">Level {item.level}</span>
                  <CardTitle className="text-2xl mt-1 serif italic font-light tracking-tight">
                    HSK <span className="text-primary italic">{item.roman}</span>
                  </CardTitle>
                  <CardDescription className="text-xs mt-2 opacity-60 leading-relaxed font-light">{item.description}</CardDescription>
                </CardHeader>
                <CardContent className="p-0 mt-8 flex items-center justify-between gap-4">
                  <div className="flex gap-3">
                    <Button asChild variant="outline" className="rounded-full border-white/10 hover:bg-white/5 h-10 px-6 text-[10px] uppercase tracking-widest font-bold">
                      <Link href={`/vocabulary/${item.level}`}>
                        Học tập
                      </Link>
                    </Button>
                    <Button asChild className="rounded-full bg-primary hover:bg-primary/90 text-primary-foreground h-10 px-8 text-[10px] uppercase tracking-widest font-bold">
                      <Link href={`/quiz/${item.level}`}>
                        Kiểm tra
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
        <aside className="md:col-span-4 space-y-8">
          <div className="glass rounded-3xl p-8 sticky top-8">
            <ProgressTracker />
          </div>
        </aside>
      </div>
      <footer className="p-8 mt-auto border-t border-white/10 flex justify-between items-center opacity-30 text-[9px] uppercase tracking-[0.3em]">
        <span>&copy; 2024 HSK Learning App by Duc</span>
        <span>Phân tích Ngôn ngữ Nâng cao</span>
      </footer>
    </div>
  );
}
