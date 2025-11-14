"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { newApplicationSchema } from "../actions/schemas";
import { MarkdownEditor } from "@/components/markdown/markdown-editor";
import { LoadingSwap } from "@/components/loading-swap";
import { createJobListingApplication } from "../actions/actions";

export function NewJobListingApplicationForm({
  jobListingId,
}: {
  jobListingId: string;
}) {
  const form = useForm({
    resolver: zodResolver(newApplicationSchema),
    defaultValues: { coverLetter: "" },
  });

  async function onSubmit(data: z.infer<typeof newApplicationSchema>) {
    const results = await createJobListingApplication({
      jobId: jobListingId,
      content: data,
    });
    if (results.error) {
      toast.error(results.message);
      return;
    }
    toast.success(results.message);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          name="coverLetter"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cover Letter</FormLabel>
              <FormControl>
                <MarkdownEditor {...field} markdown={field.value ?? ""} />
              </FormControl>
              <FormDescription>Optional</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          disabled={form.formState.isSubmitting}
          type="submit"
          className="w-full"
        >
          <LoadingSwap isLoading={form.formState.isSubmitting}>
            Apply
          </LoadingSwap>
        </Button>
      </form>
    </Form>
  );
}
