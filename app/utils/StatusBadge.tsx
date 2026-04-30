import { getStatusConfig, OrderStatus } from "@/app/utils/getStatusConfig";

export function StatusBadge({ status }: { status: OrderStatus }) {
  const config = getStatusConfig(status);

  const Icon = config.icon;

  return (
    <span className={config.className}>
      <Icon className="w-3 h-3 mr-1" />
      {config.label}
    </span>
  );
}