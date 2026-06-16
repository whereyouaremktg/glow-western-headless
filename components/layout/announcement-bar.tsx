import Link from "next/link";

import { commerceConfig } from "@/lib/config";

export function AnnouncementBar() {
  return (
    <div className="bg-powder py-2.5 text-center text-sm">
      <p>
        Free shipping on US orders over ${commerceConfig.freeShippingThreshold}.{" "}
        <Link href="/collections/the-detangling-brush" className="underline underline-offset-2">
          Shop the lineup
        </Link>
      </p>
    </div>
  );
}
