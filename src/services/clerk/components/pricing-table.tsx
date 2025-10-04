import { PricingTable } from "@clerk/nextjs";

export function PricingPageComponent() {
  return (
    <div className="flex items-center justify-center min-h-full p-4">
      <PricingTable
        forOrganizations
        newSubscriptionRedirectUrl="/employer/pricing"
      />
    </div>
  );
}
