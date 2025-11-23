"use client";

import { UploadDropzone } from "@/services/uploadthig/components/uploadthing";
import { useRouter } from "next/navigation";

const DropzoneClient: React.FC = () => {
  const router = useRouter();
  return (
    <UploadDropzone
      endpoint="resumeUploader"
      onClientUploadComplete={() => router.refresh()}
    />
  );
};

export default DropzoneClient;
