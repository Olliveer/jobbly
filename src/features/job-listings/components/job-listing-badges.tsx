import { Badge } from "@/components/ui/badge";
import { JobListingTable } from "@/drizzle/schema";
import { cn } from "@/lib/utils";
import { ComponentProps } from "react";
import {
  formatExperienceLevel,
  formatJobType,
  formatLocation,
  formatLocationRequirement,
  formatWage,
} from "../lib/formatters";
import {
  BanknoteIcon,
  BuildingIcon,
  GraduationCapIcon,
  HourglassIcon,
  MapPinIcon,
  StarIcon,
} from "lucide-react";

export default function JobListingBadges({
  jobListing: {
    isFeatured,
    wageInterval,
    city,
    experienceLevel,
    locationRequirement,
    type,
    stateAbbreviation,
    wage,
  },
  className,
}: {
  jobListing: Pick<
    typeof JobListingTable.$inferSelect,
    | "wage"
    | "wageInterval"
    | "type"
    | "locationRequirement"
    | "experienceLevel"
    | "city"
    | "stateAbbreviation"
    | "isFeatured"
  >;
  className?: string;
}) {
  const badgeProps = {
    variant: "outline",
    className,
  } satisfies ComponentProps<typeof Badge>;

  return (
    <>
      {!isFeatured ? (
        <Badge
          {...badgeProps}
          className={cn(
            className,
            "border-featured bg-featured/50 text-featured-foreground"
          )}
        >
          <StarIcon /> Featured
        </Badge>
      ) : null}
      {wage && wageInterval ? (
        <Badge {...badgeProps}>
          <BanknoteIcon /> {formatWage(wage, wageInterval)}
        </Badge>
      ) : null}
      {stateAbbreviation || city ? (
        <Badge {...badgeProps}>
          <MapPinIcon /> {formatLocation(stateAbbreviation, city)}
        </Badge>
      ) : null}

      <Badge {...badgeProps}>
        <BuildingIcon /> {formatLocationRequirement(locationRequirement)}
      </Badge>

      <Badge {...badgeProps}>
        <HourglassIcon /> {formatJobType(type)}
      </Badge>

      <Badge {...badgeProps}>
        <GraduationCapIcon /> {formatExperienceLevel(experienceLevel)}
      </Badge>
    </>
  );
}
