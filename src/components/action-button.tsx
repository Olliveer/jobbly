"use client";

import { ComponentPropsWithRef, useTransition } from "react";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { LoadingSwap } from "./loading-swap";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";

interface ActionButtonProps
  extends Omit<ComponentPropsWithRef<typeof Button>, "onClick"> {
  action: () => Promise<{ error: boolean; message: string }>;
  requireAreYouSure?: boolean;
  areYouSureDescription?: string;
}

const ActionButton: React.FC<ActionButtonProps> = ({
  action,
  requireAreYouSure = false,
  areYouSureDescription = "This option can not be undone",
  ...props
}) => {
  const [isLoading, startTransition] = useTransition();

  function performAction() {
    startTransition(async () => {
      const result = await action();
      if (result.error) {
        toast.error(result.message ?? "An error occurred");
      } else {
        toast.success(result.message ?? "Action completed");
      }
    });

    if (requireAreYouSure) {
      <AlertDialog open={isLoading ? true : undefined}>
        <AlertDialogTrigger asChild>
          <Button {...props} />
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              {areYouSureDescription}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction disabled={isLoading} onClick={performAction}>
              <LoadingSwap
                isLoading={isLoading}
                className="inline-flex items-center gap-2"
              >
                Confirm
              </LoadingSwap>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>;
    }
  }

  return (
    <Button onClick={performAction} {...props} disabled={isLoading}>
      <LoadingSwap
        isLoading={isLoading}
        className="inline-flex items-center gap-2"
      >
        {props.children}
      </LoadingSwap>
    </Button>
  );
};

export default ActionButton;
