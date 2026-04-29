"use client";

import {
  getStatusConfig,
  type OrderStatus,
} from "@/app/utils/getStatusConfig";

type Props = {
  status: OrderStatus;
};

export function StatusBadge({ status }: Props) {
  const statusConfig = getStatusConfig(status);
  const StatusIcon = statusConfig.icon;

  return (
    <span
      className={`
        inline-flex items-center gap-1.5
        px-2 py-1 text-xs font-medium
        rounded border
        transition-all duration-200
        ${statusConfig.className}
      `}
    >
      <StatusIcon size={14} />
      {statusConfig.label}
    </span>
  );
}