"use client";

import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

export default function DashboardRefreshButton() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [lastRefreshed, setLastRefreshed] = useState(new Date());

  const handleRefresh = () => {
    startTransition(() => {
      router.refresh();
      setLastRefreshed(new Date());
    });
  };

  return (
    <div className="flex items-center justify-between">
      <p className="text-xs text-muted-foreground">
        {lastRefreshed ? `Last refreshed: ${lastRefreshed.toLocaleTimeString()}` : "Loading..."}
      </p>
      <Button
        size="sm"
        variant="outline"
        onClick={handleRefresh}
        disabled={isPending}
        className="gap-1.5"
      >
        <RefreshCw size={13} className={isPending ? "animate-spin" : ""} />
        {isPending ? "Refreshing..." : "Refresh"}
      </Button>
    </div>
  );
}
