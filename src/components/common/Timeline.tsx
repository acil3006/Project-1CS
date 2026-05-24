import { CheckCircle2, CircleDashed } from "lucide-react";

interface TimelineItem {
  label: string;
  detail: string;
  done: boolean;
}

export function Timeline({ items }: { items: TimelineItem[] }) {
  return (
    <ol className="space-y-4">
      {items.map((item, index) => {
        const Icon = item.done ? CheckCircle2 : CircleDashed;
        return (
          <li key={item.label} className="flex gap-3">
            <div className="flex flex-col items-center">
              <Icon className={`h-5 w-5 ${item.done ? "text-emerald-600" : "text-slate-300"}`} />
              {index < items.length - 1 ? <span className="mt-2 h-10 w-px bg-slate-200" /> : null}
            </div>
            <div>
              <p className="text-sm font-semibold text-aethera-ink">{item.label}</p>
              <p className="text-xs text-slate-500">{item.detail}</p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
