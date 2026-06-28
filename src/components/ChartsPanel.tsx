import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { ReactElement } from 'react';
import type { HistoryEntry } from './HistoryTable';

type ChartsPanelProps = {
  history: HistoryEntry[];
};

export default function ChartsPanel({ history }: ChartsPanelProps) {
  const data = history.map((entry) => ({
    tiempo: Number(entry.time.toFixed(1)),
    velocidad: Number(entry.velocity.toFixed(2)),
    fuerzaNeta: Number(entry.netForce.toFixed(2)),
  }));

  return (
    <section className="rounded-lg bg-white p-5 shadow-soft lg:p-7">
      <div className="mb-5">
        <h2 className="text-2xl font-bold text-slate-900">Graficas</h2>
        <p className="mt-1 text-lg text-slate-600">Velocidad y fuerza neta comparadas con el tiempo.</p>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <ChartCard title="Velocidad vs tiempo" empty={data.length === 0}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#dbe4ef" />
            <XAxis dataKey="tiempo" tick={{ fontSize: 13 }} unit="s" />
            <YAxis tick={{ fontSize: 13 }} />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="velocidad" name="Velocidad (m/s)" stroke="#2563eb" strokeWidth={3} dot />
          </LineChart>
        </ChartCard>

        <ChartCard title="Fuerza neta vs tiempo" empty={data.length === 0}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#dbe4ef" />
            <XAxis dataKey="tiempo" tick={{ fontSize: 13 }} unit="s" />
            <YAxis tick={{ fontSize: 13 }} />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="fuerzaNeta" name="Fuerza neta (N)" stroke="#16a34a" strokeWidth={3} dot />
          </LineChart>
        </ChartCard>
      </div>
    </section>
  );
}

function ChartCard({
  title,
  empty,
  children,
}: {
  title: string;
  empty: boolean;
  children: ReactElement;
}) {
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
      <h3 className="mb-3 text-xl font-bold text-slate-800">{title}</h3>
      <div className="h-72">
        {empty ? (
          <div className="flex h-full items-center justify-center rounded-lg bg-white text-lg font-semibold text-slate-500">
            Sin datos para graficar.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            {children}
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
