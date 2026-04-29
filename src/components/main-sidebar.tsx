"use client";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarTrigger,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from "@/components/ui/sidebar";
import { Home, Book, BrainCircuit, GraduationCap, Languages, Rocket } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible";
import { useState } from "react";

const hskLevels = [
  { level: 1, roman: "I" },
  { level: 2, roman: "II" },
  { level: 3, roman: "III" },
  { level: 4, roman: "IV" },
  { level: 5, roman: "V" },
  { level: 6, roman: "VI" },
];

export function MainSidebar() {
  const pathname = usePathname();
  const [vocabOpen, setVocabOpen] = useState(pathname.includes("/vocabulary"));
  const [quizOpen, setQuizOpen] = useState(pathname.includes("/quiz"));

  return (
    <Sidebar className="border-r border-white/5 bg-sidebar font-inter">
      <SidebarHeader className="p-8">
        <div className="flex flex-col gap-1">
            <span className="text-[10px] uppercase tracking-[0.3em] text-primary/50 font-semibold">Cá nhân</span>
            <div className="flex items-center gap-2 group-data-[collapsed=icon]:hidden">
                <h1 className="text-xl serif italic tracking-tight">HSK by Duc</h1>
            </div>
        </div>
      </SidebarHeader>
      <SidebarContent className="px-4">
        <SidebarMenu className="gap-2">
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={pathname === "/"}
              tooltip="Tổng quan"
              className="rounded-xl h-11 text-xs uppercase tracking-widest px-4 font-medium"
            >
              <Link href="/">
                <Home className="w-4 h-4" />
                <span>Tổng quan</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={pathname === "/translate"}
              tooltip="Dịch thuật"
              className="rounded-xl h-11 text-xs uppercase tracking-widest px-4 font-medium"
            >
              <Link href="/translate">
                <Languages className="w-4 h-4" />
                <span>Dịch thuật</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <Collapsible open={vocabOpen} onOpenChange={setVocabOpen}>
            <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                    <SidebarMenuButton tooltip="Từ vựng" className="rounded-xl h-11 text-xs uppercase tracking-widest px-4 font-medium">
                        <Book className="w-4 h-4" />
                        <span>Học tập</span>
                    </SidebarMenuButton>
                </CollapsibleTrigger>
            </SidebarMenuItem>
            <CollapsibleContent>
              <SidebarMenuSub className="ml-6 border-l border-white/5 py-2">
                {hskLevels.map((item) => (
                  <SidebarMenuSubItem key={item.level}>
                    <SidebarMenuSubButton
                      asChild
                      isActive={pathname === `/vocabulary/${item.level}`}
                      className="text-[10px] uppercase tracking-widest py-2"
                    >
                      <Link href={`/vocabulary/${item.level}`}>
                        HSK {item.level}
                      </Link>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                ))}
              </SidebarMenuSub>
            </CollapsibleContent>
          </Collapsible>
          
          <Collapsible open={quizOpen} onOpenChange={setQuizOpen}>
            <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                    <SidebarMenuButton tooltip="Bài tập" className="rounded-xl h-11 text-xs uppercase tracking-widest px-4 font-medium">
                        <BrainCircuit className="w-4 h-4" />
                        <span>Luyện tập</span>
                    </SidebarMenuButton>
                </CollapsibleTrigger>
            </SidebarMenuItem>
            <CollapsibleContent>
              <SidebarMenuSub className="ml-6 border-l border-white/5 py-2">
                {hskLevels.map((item) => (
                  <SidebarMenuSubItem key={item.level}>
                    <SidebarMenuSubButton
                      asChild
                      isActive={pathname === `/quiz/${item.level}`}
                      className="text-[10px] uppercase tracking-widest py-2"
                    >
                      <Link href={`/quiz/${item.level}`}>
                        HSK {item.level} Quiz
                      </Link>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                ))}
              </SidebarMenuSub>
            </CollapsibleContent>
          </Collapsible>
          
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="p-4 hidden md:flex">
         <SidebarTrigger />
      </SidebarFooter>
    </Sidebar>
  );
}
