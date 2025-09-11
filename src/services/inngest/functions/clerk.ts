import { env } from "@/data/env/server";
import { inngest } from "../client";
import { Webhook } from "svix";
import { NonRetriableError } from "inngest";
import { deleteUser, insertUser, updateUser } from "@/features/users/db/users";
import { insertUserNotificationSettings } from "@/features/users/db/user-notification-settings";
import {
  deleteOrganization,
  insertOrganization,
  updateOrganization,
} from "@/features/organizations/db/organizations";

function verifyWebhook({
  raw,
  headers,
}: {
  raw: string;
  headers: Record<string, string>;
}) {
  return new Webhook(env.CLERK_WEBHOOK_SECRET).verify(raw, headers);
}

// USERS
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

    await step.run("Create User Notification Settings", async () => {
      await insertUserNotificationSettings({
        userId,
      });
    });
  }
);

export const clerkUpdateUser = inngest.createFunction(
  { id: "clerk/update-db-user", name: "Clerk - Update DB User" },
  {
    event: "clerk/user.updated",
  },
  async ({ event, step }) => {
    try {
      await step.run("verify-webhook", () => verifyWebhook(event.data));
    } catch {
      // If the webhook is not verified, throw a non-retriable error
      // This will prevent the function from being retried
      throw new NonRetriableError("Failed to verify webhook");
    }

    const userId = await step.run("update-user", async () => {
      const userData = event.data.data;
      const email = userData.email_addresses.find(
        (email) => email.id === userData.primary_email_address_id
      );

      if (email === null) {
        throw new NonRetriableError("No primary email address found");
      }

      await updateUser(userData.id, {
        name: `${userData.first_name} ${userData.last_name}`,
        email: email!.email_address,
        imageUrl: userData.image_url,
        updatedAt: new Date(userData.updated_at),
      });

      return userData.id;
    });

    await step.run("update-user-notification-settings", async () => {
      await insertUserNotificationSettings({
        userId,
      });
    });
  }
);

export const clerkDeleteUser = inngest.createFunction(
  { id: "clerk/delete-db-user", name: "Clerk - Delete DB User" },
  {
    event: "clerk/user.deleted",
  },
  async ({ event, step }) => {
    try {
      await step.run("Verify Webhook", () => verifyWebhook(event.data));
    } catch {
      // If the webhook is not verified, throw a non-retriable error
      // This will prevent the function from being retried
      throw new NonRetriableError("Failed to verify webhook");
    }

    await step.run("delete-user", async () => {
      const { id } = event.data.data;

      if (!id) {
        throw new NonRetriableError("No user id found");
      }

      await deleteUser(id);
    });
  }
);

// ORGANIZATIONS
export const clerkCreateOrganization = inngest.createFunction(
  {
    id: "clerk/create-db-organization",
    name: "Clerk - Create DB Organization",
  },
  {
    event: "clerk/organization.created",
  },
  async ({ event, step }) => {
    try {
      await step.run("Verify Webhook", () => verifyWebhook(event.data));
    } catch {
      // If the webhook is not verified, throw a non-retriable error
      // This will prevent the function from being retried
      throw new NonRetriableError("Failed to verify webhook");
    }

    await step.run("create-organization", async () => {
      const organizationData = event.data.data;

      await insertOrganization({
        id: organizationData.id,
        name: organizationData.name,
        imageUrl: organizationData.image_url,
        createdAt: new Date(organizationData.created_at),
        updatedAt: new Date(organizationData.updated_at),
      });
    });
  }
);

export const clerkUpdateOrganization = inngest.createFunction(
  {
    id: "clerk/update-db-organization",
    name: "Clerk - Update DB Organization",
  },
  {
    event: "clerk/organization.updated",
  },
  async ({ event, step }) => {
    try {
      await step.run("verify-webhook", () => verifyWebhook(event.data));
    } catch {
      // If the webhook is not verified, throw a non-retriable error
      // This will prevent the function from being retried
      throw new NonRetriableError("Failed to verify webhook");
    }

    await step.run("update-organization", async () => {
      const organizationData = event.data.data;

      await updateOrganization(organizationData.id, {
        name: organizationData.name,
        imageUrl: organizationData.image_url,
        updatedAt: new Date(organizationData.updated_at),
      });
    });
  }
);

export const clerkDeleteOrganization = inngest.createFunction(
  {
    id: "clerk/delete-db-organization",
    name: "Clerk - Delete DB Organization",
  },
  {
    event: "clerk/organization.deleted",
  },
  async ({ event, step }) => {
    try {
      await step.run("Verify Webhook", () => verifyWebhook(event.data));
    } catch {
      // If the webhook is not verified, throw a non-retriable error
      // This will prevent the function from being retried
      throw new NonRetriableError("Failed to verify webhook");
    }

    await step.run("delete-organization", async () => {
      const { id } = event.data.data;

      if (!id) {
        throw new NonRetriableError("No organization id found");
      }

      await deleteOrganization(id);
    });
  }
);
