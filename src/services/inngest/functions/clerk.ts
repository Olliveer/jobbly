import { env } from "@/data/env/server";
import { inngest } from "../client";
import { Webhook } from "svix";
import { NonRetriableError } from "inngest";
import { insertUser } from "@/components/features/users/db/users";
import { insertUserNotificationSettings } from "@/components/features/users/db/user-notification-settings";

function verifyWebhook({
  raw,
  headers,
}: {
  raw: string;
  headers: Record<string, string>;
}) {
  return new Webhook(env.CLERK_WEBHOOK_SECRET).verify(raw, headers);
}

export const clerkCreateUser = inngest.createFunction(
  { id: "clerk/create-db-user", name: "Clerk - Create DB User" },
  {
    event: "clerk/user.created",
  },
  async ({ event, step }) => {
    try {
      await step.run("Verify Webhook", () => verifyWebhook(event.data));
    } catch {
      // If the webhook is not verified, throw a non-retriable error
      // This will prevent the function from being retried
      throw new NonRetriableError("Failed to verify webhook");
    }

    const userId = await step.run("Create User", async () => {
      const userData = event.data.data;
      const email = userData.email_addresses.find(
        (email) => email.id === userData.primary_email_address_id
      );

      if (email === null) {
        throw new NonRetriableError("No primary email address found");
      }

      await insertUser({
        id: userData.id,
        name: `${userData.first_name} ${userData.last_name}`,
        email: email!.email_address,
        imageUrl: userData.image_url,
        createdAt: new Date(userData.created_at),
        updatedAt: new Date(userData.updated_at),
      });

      return userData.id;
    });

    await step.run("create-user-notification-settings", async () => {
      await insertUserNotificationSettings({
        userId,
      });
    });
  }
);
