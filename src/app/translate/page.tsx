import { PageHeader } from "@/components/page-header";
import { TranslateClient } from "@/components/translate/translate-client";

export const metadata = {
  title: "Dịch thuật | HSK by Duc",
  description: "Luyện tập dịch thuật Tiếng Trung với sự trợ giúp của AI.",
};

export default function TranslatePage() {
  return (
    <div className="flex flex-col w-full h-full text-foreground bg-background">
      <PageHeader
        title="Dịch thuật"
        subtitle="Học HSK by Duc"
        description="Luyện kỹ năng dịch Trung-Việt với các đoạn văn do AI tạo ra."
      />
      <div className="flex-grow p-4 md:p-6">
        <TranslateClient />
      </div>
    </div>
  );
}
