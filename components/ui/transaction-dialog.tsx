import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { CheckCircle, Loader2, XCircle } from "lucide-react";
import React from "react";
import { Button } from "./button";
import { TextMorph } from "./text-morph";

export type TransactionStep = "sent" | "confirmed" | "success" | "error";

interface TransactionDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  currentStep: TransactionStep;
  title: string;
  message: string;
}

const StepIcon = ({ step }: { step: TransactionStep }) => {
  switch (step) {
    case "sent":
    case "confirmed":
      return (
        <Loader2 className="h-8 w-8 animate-spin text-gray-500 dark:text-white" />
      );
    case "success":
      return <CheckCircle className="h-8 w-8 text-green-500" />;
    case "error":
      return <XCircle className="h-8 w-8 text-red-500" />;
  }
};

const StepIndicator = ({ currentStep }: { currentStep: TransactionStep }) => {
  const steps = ["sent", "confirmed", "success"];

  return (
    <div className="flex items-center justify-center space-x-2">
      {steps.map((step, index) => (
        <div key={step} className="flex items-center">
          <div
            className={cn(
              "h-2 w-2 rounded-full",
              currentStep === "error"
                ? "bg-red-500"
                : steps.indexOf(currentStep) >= index
                  ? "bg-emerald-500"
                  : "bg-gray-300"
            )}
          />
          {index < steps.length - 1 && (
            <div
              className={cn(
                "h-[2px] w-8",
                currentStep === "error"
                  ? "bg-red-500"
                  : steps.indexOf(currentStep) > index
                    ? "bg-emerald-500"
                    : "bg-gray-300"
              )}
            />
          )}
        </div>
      ))}
    </div>
  );
};

const getStepMessage = (step: TransactionStep, message: string) => {
  switch (step) {
    case "sent":
      return "Transaction sent. Waiting for confirmation...";
    case "confirmed":
      return "Transaction confirmed. Processing...";
    case "success":
      return "Transaction completed successfully!";
    case "error":
      return message || "Transaction failed. Please try again.";
  }
};

const TransactionDialog = ({
  isOpen,
  onOpenChange,
  currentStep,
  title,
  message,
}: TransactionDialogProps) => {
  React.useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isOpen) {
        e.preventDefault();
        e.returnValue = "";
      }
    };

    if (isOpen) window.addEventListener("beforeunload", handleBeforeUnload);

    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isOpen]);

  React.useEffect(() => {
    const handlePopState = (e: PopStateEvent) => {
      if (isOpen) {
        e.preventDefault();
        window.history.pushState(null, "", window.location.href);
      }
    };

    if (isOpen) {
      window.history.pushState(null, "", window.location.href);
      window.addEventListener("popstate", handlePopState);
    }

    return () => window.removeEventListener("popstate", handlePopState);
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="sm:max-w-md"
        >
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center space-y-4 py-4">
            <StepIndicator currentStep={currentStep} />
            <StepIcon step={currentStep} />
            <TextMorph
              className={cn(
                "text-center text-sm",
                currentStep === "error"
                  ? "text-red-500"
                  : "text-muted-foreground dark:text-white"
              )}
            >
              {getStepMessage(currentStep, message)}
            </TextMorph>
          </div>
        </motion.div>
        <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{
                opacity:
                  currentStep === "success" || currentStep === "error" ? 1 : 0,
                height:
                  currentStep === "success" || currentStep === "error"
                    ? "auto"
                    : 0,
              }}
              className="w-full"
            >
              <Button type="button" className="w-full">
                Close
              </Button>
            </motion.div>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TransactionDialog;
