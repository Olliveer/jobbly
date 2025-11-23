import DropzoneClient from "@/components/dropzone-client";
import { Card, CardContent } from "@/components/ui/card";
import { Suspense } from "react";

export default function UserResumePage() {
  return (
    <div className="max-w-3xl mx-auto py-8 space-y-6 px-4">
      <h1 className="text-2xl font-bold">User Resume</h1>
      <Card>
        <CardContent>
          <DropzoneClient />
        </CardContent>
        <Suspense>
          <ResumeDetails />
        </Suspense>
      </Card>
      <Suspense>
        <AISummaryCard />
      </Suspense>
    </div>
  );
}

async function ResumeDetails() {
  return null;
}

async function AISummaryCard() {
  return null;
}
