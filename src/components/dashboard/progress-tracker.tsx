"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useLocalStorage } from "@/hooks/use-local-storage";
import type { QuizScore, Alias } from "@/lib/types";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import { BarChart } from "lucide-react";

export function ProgressTracker() {
  const [alias, setAlias] = useLocalStorage<Alias>("hsk-alias", "");
  const [scores] = useLocalStorage<QuizScore[]>("hsk-scores", []);
  const [tempAlias, setTempAlias] = useState(alias);

  const handleSaveAlias = () => {
    setAlias(tempAlias);
  };

  const userScores = scores
    .filter((s) => s.alias === alias)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  return (
    <Card className="bg-transparent border-none shadow-none p-0">
      <CardHeader className="p-0 mb-8">
        <CardTitle className="text-sm uppercase tracking-[0.2em] font-semibold opacity-60">
          Phân tích Cá nhân
        </CardTitle>
        <CardDescription className="text-2xl mt-1 serif italic font-light tracking-tight text-foreground">
          Chỉ số <span className="text-primary">Năng lực</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0 space-y-8">
        {alias ? (
          <div className="space-y-6">
            <div className="flex flex-col">
              <span className="text-[10px] uppercase tracking-widest opacity-40">Học giả Hoạt động</span>
              <span className="text-xl font-light mt-1">{alias}</span>
            </div>
            
            <div className="space-y-4">
              <h4 className="text-[10px] uppercase tracking-widest font-semibold opacity-60">Kết quả Gần đây</h4>
              {userScores.length > 0 ? (
                <ul className="space-y-3">
                  {userScores.map((score, index) => (
                    <li key={index} className="flex flex-col p-4 rounded-2xl bg-white/5 border border-white/5">
                      <div className="flex justify-between items-end mb-2">
                        <span className="text-[10px] uppercase tracking-widest opacity-50">Cấp độ {score.level}</span>
                        <span className={`text-sm font-bold ${score.score > 70 ? 'text-primary' : 'text-amber-500'}`}>{score.score}%</span>
                      </div>
                      <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden">
                        <div 
                          className="bg-primary h-full transition-all duration-1000" 
                          style={{ width: `${score.score}%` }}
                        />
                      </div>
                      <span className="text-[9px] uppercase tracking-widest opacity-30 mt-3 self-end text-right">
                        {formatDistanceToNow(new Date(score.date), {
                          addSuffix: true,
                          locale: vi,
                        })}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="p-8 rounded-2xl bg-white/5 border border-white/5 text-center">
                   <p className="text-[10px] uppercase tracking-widest opacity-30">Chưa có dữ liệu đánh giá</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
             <div className="flex flex-col">
              <span className="text-[10px] uppercase tracking-widest opacity-40 mb-3">Định danh của bạn</span>
              <Input
                placeholder="Tên hoặc biệt hiệu học tập..."
                value={tempAlias}
                onChange={(e) => setTempAlias(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSaveAlias()}
                className="bg-white/5 border-white/10 rounded-xl h-12 focus:border-primary/50 transition-colors"
              />
            </div>
             <Button onClick={handleSaveAlias} disabled={!tempAlias.trim()} className="w-full h-12 rounded-full bg-primary text-primary-foreground text-[10px] uppercase tracking-widest font-bold">
                Khởi tạo Hồ sơ
            </Button>
          </div>
        )}
      </CardContent>
      {alias && (
         <CardFooter className="p-0 mt-8">
            <Button variant="link" size="sm" className="p-0 h-auto text-[9px] uppercase tracking-widest opacity-30 hover:opacity-100 transition-opacity" onClick={() => setAlias("")}>Đặt lại danh tính</Button>
         </CardFooter>
      )}
    </Card>
  );
}
