import { Download, Trash2 } from 'lucide-react';
import type { ReactNode } from 'react';

export type HistoryEntry = {
  id: string;
  time: number;
  appliedForce: number;
  friction: number;
  angle: number;
  velocity: number;
  acceleration: number;
  netForce: number;
};

type HistoryTableProps = {
  history: HistoryEntry[];
  onClear: () => void;
  onExport: () => void;
};

export default function HistoryTable({ history, onClear, onExport }: HistoryTableProps) {
  return (
    <section className="rounded-lg bg-white p-5 shadow-soft lg:p-7">
      <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Historial del movimiento</h2>
          <p className="mt-1 text-lg text-slate-600">Se guarda cada cambio de valores en localStorage.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={onExport}
            disabled={history.length === 0}
            className="inline-flex min-h-12 items-center gap-2 rounded-lg bg-green-600 px-4 text-base font-bold text-white shadow-md transition hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            <Download size={20} />
            Exportar CSV
          </button>
          <button
            type="button"
            onClick={onClear}
            disabled={history.length === 0}
            className="inline-flex min-h-12 items-center gap-2 rounded-lg bg-red-600 px-4 text-base font-bold text-white shadow-md transition hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            <Trash2 size={20} />
            Limpiar
          </button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border border-slate-200">
        <table className="min-w-full divide-y divide-slate-200 text-left text-base">
          <thead className="bg-slate-100 text-sm uppercase tracking-wide text-slate-600">
            <tr>
              <Th>Tiempo</Th>
              <Th>Fuerza aplicada</Th>
              <Th>Friccion</Th>
              <Th>Angulo</Th>
              <Th>Velocidad</Th>
              <Th>Aceleracion</Th>
              <Th>Fuerza neta</Th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {history.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-lg font-semibold text-slate-500">
                  Aun no hay datos guardados.
                </td>
              </tr>
            ) : (
              history.slice(-12).reverse().map((entry) => (
                <tr key={entry.id} className="hover:bg-blue-50/60">
                  <Td>{entry.time.toFixed(1)} s</Td>
                  <Td>{entry.appliedForce.toFixed(2)} N</Td>
                  <Td>{entry.friction.toFixed(2)}</Td>
                  <Td>{entry.angle.toFixed(1)}°</Td>
                  <Td>{entry.velocity.toFixed(2)} m/s</Td>
                  <Td>{entry.acceleration.toFixed(2)} m/s²</Td>
                  <Td>{entry.netForce.toFixed(2)} N</Td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function Th({ children }: { children: ReactNode }) {
  return <th className="whitespace-nowrap px-4 py-3 font-bold">{children}</th>;
}

function Td({ children }: { children: ReactNode }) {
  return <td className="whitespace-nowrap px-4 py-3 font-semibold text-slate-700">{children}</td>;
}
