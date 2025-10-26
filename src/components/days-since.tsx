import { differenceInDays } from "date-fns";
import { connection } from "next/server";
import { Badge } from "./ui/badge";

interface DaySinceProps {
  date: Date | string;
}

const DaySince: React.FC<DaySinceProps> = async ({ date }) => {
  await connection();
  const days = differenceInDays(new Date(date), Date.now());

  if (days === 0) {
    return <Badge>New</Badge>;
  }

  return new Intl.RelativeTimeFormat(undefined, {
    style: "narrow",
    numeric: "always",
  }).format(days, "day");
};

export default DaySince;
