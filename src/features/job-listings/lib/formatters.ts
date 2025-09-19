import {
  ExperienceLevel,
  JobListingStatus,
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

export function formatJobListingStatus(status: JobListingStatus) {
  switch (status) {
    case "draft":
      return "Draft";
    case "published":
      return "Published";
    case "delisted":
      return "Delisted";
    default:
      throw new Error(`Unknown job listing status: ${status}`);
  }
}

export function formatWage(wage: number, interval: WageInterval) {
  const wageFormatter = Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });

  switch (interval) {
    case "hourly":
      return `${wageFormatter.format(wage)} / hr`;
    case "daily":
      return `${wageFormatter.format(wage)} / day`;
    case "weekly":
      return `${wageFormatter.format(wage)} / week`;
    case "monthly":
      return `${wageFormatter.format(wage)} / month`;
    case "yearly":
      return `${wageFormatter.format(wage)} / year`;
    default:
      throw new Error(`Unknown wage interval: ${interval}`);
  }
}

export function formatLocation(
  stateAbbreviation: string | null,
  city: string | null
) {
  if (!stateAbbreviation || !city) {
    return "None";
  }

  const locationParts = [];

  if (city) {
    locationParts.push(city);
  }

  if (stateAbbreviation) {
    locationParts.push(stateAbbreviation.toUpperCase());
  }

  return locationParts.join(", ");
}
