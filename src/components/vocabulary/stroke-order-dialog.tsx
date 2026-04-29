"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { FilePenLine } from "lucide-react";
import { useState } from "react";

type StrokeOrderDialogProps = {
  character: string;
};

export function StrokeOrderDialog({ character }: StrokeOrderDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  // Use the first character for multi-character words
  const displayChar = character.charAt(0);
  const strokeURL = `https://www.mdbg.net/chinese/dictionary?page=worddict&wdrst=0&wdqb=${displayChar}`;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <FilePenLine className="mr-2 h-4 w-4" />
          Thứ tự nét
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl w-full h-[85vh] flex flex-col p-0">
        <DialogHeader className="p-4">
          <DialogTitle>Thứ tự nét chữ: {displayChar}</DialogTitle>
        </DialogHeader>
        <div className="flex-1 border-t">
          {isOpen && (
            <iframe
              src={strokeURL}
              title={`Stroke order for ${displayChar}`}
              className="w-full h-full border-0"
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}