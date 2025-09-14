import {
  ExperienceLevel,
  JobListingType,
  LocationRequirement,
  WageInterval,
} from "@/drizzle/schema";

export function formatWageInterval(interval: WageInterval) {
  switch (interval) {
    case "hourly":
      return "Hour";
    case "daily":
      return "Day";
    case "weekly":
      return "Week";
    case "monthly":
      return "Month";
    case "yearly":
      return "Year";
    default:
      throw new Error(`Unknown wage interval: ${interval}`);
  }
}

export function formatLocationRequirement(
  locationRequirement: LocationRequirement
) {
  switch (locationRequirement) {
    case "in-office":
      return "In Office";
    case "remote":
      return "Remote";
    case "hybrid":
      return "Hybrid";
    default:
      throw new Error(`Unknown location requirement: ${locationRequirement}`);
  }
}

export function formatJobType(type: JobListingType) {
  switch (type) {
    case "full-time":
      return "Full Time";
    case "part-time":
      return "Part Time";
    case "contract":
      return "Contract";
    case "internship":
      return "Internship";
    default:
      throw new Error(`Unknown job type: ${type}`);
  }
}

export function formatExperienceLevel(experienceLevel: ExperienceLevel) {
  switch (experienceLevel) {
    case "junior":
      return "Junior";
    case "mid-level":
      return "Mid Level";
    case "senior":
      return "Senior";
    default:
      throw new Error(`Unknown experience level: ${experienceLevel}`);
  }
}
