import { toast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

export const showLoadingToast = (message: string) => {
  toast({
    description: (
      <div className="flex items-center space-x-2">
        <Loader2 className="animate-spin h-5 w-5 text-primary" />
        <span>{message}</span>
      </div>
    ),
    duration: Infinity, // Keep the toast open until manually dismissed
  });
};
