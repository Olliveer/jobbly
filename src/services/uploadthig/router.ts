import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { getCurrentUser } from "../clerk/lib/get-current-user";
import { inngest } from "../inngest/client";
import {
  getUserResumeFileKey,
  upsertUserResume,
} from "@/features/users/actions/user-resume";
import { uploadthing } from "./client";

const f = createUploadthing();

export const customFileRouter = {
  resumeUploader: f(
    {
      pdf: {
        maxFileSize: "8MB",
        maxFileCount: 1,
      },
    },
    {
      awaitServerData: true,
    },
  )
    .middleware(async () => {
      const { userId } = await getCurrentUser({});

      if (!userId) throw new UploadThingError("Unauthorized");

      return { userId };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      const resumeFileKey = await getUserResumeFileKey(metadata.userId);

      await upsertUserResume(metadata.userId, {
        resumeFileUrl: file.ufsUrl,
        resumeFileKey: file.key,
      });

      if (resumeFileKey) {
        await uploadthing.deleteFiles(resumeFileKey);
      }

      // TODO
      await inngest.send({
        name: "app/resume.uploaded",
        user: {
          id: metadata.userId,
        },
      });
      return { message: "Resume uploaded successfully" };
    }),
} satisfies FileRouter;

export type CustomFileRouter = typeof customFileRouter;
