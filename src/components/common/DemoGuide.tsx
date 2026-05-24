import { ArrowRight, RotateCcw } from "lucide-react";
import { useApp } from "../../app/AppState";
import {
  SCENARIO_APPOINTMENT_ID,
  SCENARIO_CAMPAIGN_ID,
  SCENARIO_PRESCRIPTION_ID,
  SCENARIO_TRIAGE_ID
} from "../../data/mockData";
import { Badge } from "./Badge";

export function DemoGuide() {
  const { data, resetDemoData } = useApp();
  const appointment = data.appointments.find((item) => item.id === SCENARIO_APPOINTMENT_ID);
  const triage = data.triages.find((item) => item.id === SCENARIO_TRIAGE_ID);
  const prescription = data.prescriptions.find((item) => item.id === SCENARIO_PRESCRIPTION_ID);
  const campaign = data.campaigns.find((item) => item.id === SCENARIO_CAMPAIGN_ID);

  const steps = [
    { label: "Student booked", done: Boolean(appointment) },
    { label: "Nurse validated", done: appointment?.status === "CONFIRMED" || appointment?.status === "IN_PROGRESS" || appointment?.status === "COMPLETED" },
    { label: "Triage saved", done: Boolean(triage) },
    { label: "Doctor finalized", done: appointment?.status === "COMPLETED" },
    { label: "Prescription dispensed", done: prescription?.status === "DISPENSED" },
    { label: "Campaign published", done: campaign?.status === "PUBLISHED" }
  ];

  return (
    <aside className="rounded-lg border border-aethera-line bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-aethera-cyan">Guided demo flow</p>
          <h3 className="mt-1 text-sm font-bold text-aethera-ink">
            From appointment request to admin supervision
          </h3>
        </div>
        <button className="btn-ghost px-2 py-1" onClick={resetDemoData} title="Reset demo state">
          <RotateCcw className="h-4 w-4" />
        </button>
      </div>
      <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-1">
        {steps.map((step, index) => (
          <div key={step.label} className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2">
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-xs font-bold text-slate-600">
                {index + 1}
              </span>
              <span className="text-xs font-semibold text-slate-700">{step.label}</span>
            </div>
            {step.done ? <Badge tone="green">Done</Badge> : <ArrowRight className="h-4 w-4 text-slate-300" />}
          </div>
        ))}
      </div>
    </aside>
  );
}
