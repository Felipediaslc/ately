import { ReactNode } from "react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

type TrendType = "up" | "down" | "neutral";

interface KpiCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  iconBg?: string; // ex: "bg-violet-500/10" | "bg-emerald-500/10" | "bg-amber-500/10"
  iconColor?: string; // ex: "text-violet-400"
  subtitle?: string;
  trendValue?: string;
  trendType?: TrendType;
}

export function KpiCard({
  title,
  value,
  icon,
  iconBg = "bg-zinc-800/60",
  iconColor = "text-zinc-300",
  subtitle,
  trendValue,
  trendType = "neutral",
}: KpiCardProps) {
  const trendConfig = {
    up: {
      icon: <TrendingUp size={14} />,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
    },
    down: {
      icon: <TrendingDown size={14} />,
      color: "text-red-400",
      bg: "bg-red-500/10",
    },
    neutral: {
      icon: <Minus size={14} />,
      color: "text-zinc-400",
      bg: "bg-zinc-800/40",
    },
  };

  const trend = trendConfig[trendType];

  return (
    <div className="group relative overflow-hidden bg-zinc-900/60 border border-zinc-800 rounded-2xl p-5 transition-all duration-300 hover:bg-zinc-900 hover:border-zinc-700 hover:shadow-[0_0_30px_rgba(255,255,255,0.03)]">
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />

      <div className="relative flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm text-zinc-400">{title}</p>
          <p className="text-2xl font-semibold tracking-tight text-white">{value}</p>

          {(subtitle || trendValue) && (
            <div className="flex items-center gap-2">
              {trendValue && (
                <span className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${trend.bg} ${trend.color}`}>
                  {trend.icon}
                  {trendValue}
                </span>
              )}
              {subtitle && <span className="text-xs text-zinc-500">{subtitle}</span>}
            </div>
          )}
        </div>

        {/* ICON com cor contextual */}
        <div className={`p-2.5 rounded-xl border border-zinc-700/50 transition ${iconBg} ${iconColor} group-hover:border-zinc-600`}>
          {icon}
        </div>
      </div>
    </div>
  );
}