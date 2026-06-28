import { ArrowLeft, ArrowRight, CirclePause, RotateCcw, SlidersHorizontal } from 'lucide-react';

export type SimulationValues = {
  appliedForce: number;
  friction: number;
  angle: number;
  mass: number;
  velocity: number;
};

type ControlPanelProps = {
  values: SimulationValues;
  manualMode: boolean;
  errors: Partial<Record<keyof SimulationValues, string>>;
  isAtLeftLimit: boolean;
  isAtRightLimit: boolean;
  onPresetForce: (force: number) => void;
  onReset: () => void;
  onToggleManual: () => void;
  onChangeValue: (key: keyof SimulationValues, value: string) => void;
};

const fields: Array<{
  key: keyof SimulationValues;
  label: string;
  unit: string;
  step: string;
  min?: string;
  max?: string;
}> = [
  { key: 'appliedForce', label: 'Fuerza aplicada', unit: 'N', step: '1' },
  { key: 'friction', label: 'Friccion', unit: '', step: '0.01' },
  { key: 'angle', label: 'Angulo de la rampa', unit: 'grados', step: '1', min: '0', max: '60' },
  { key: 'mass', label: 'Masa del carrito', unit: 'kg', step: '0.1' },
  { key: 'velocity', label: 'Velocidad inicial', unit: 'm/s', step: '0.1' },
];

export default function ControlPanel({
  values,
  manualMode,
  errors,
  isAtLeftLimit,
  isAtRightLimit,
  onPresetForce,
  onReset,
  onToggleManual,
  onChangeValue,
}: ControlPanelProps) {
  return (
    <section className="rounded-lg bg-white p-5 shadow-soft lg:p-7">
      <div className="mb-5">
        <h2 className="text-2xl font-bold text-slate-900">Controles</h2>
        <p className="mt-1 text-lg text-slate-600">Aplica fuerza o ajusta los valores manualmente.</p>
      </div>

      <div className="grid gap-3">
        <button
          type="button"
          disabled={isAtLeftLimit}
          onClick={() => onPresetForce(-50)}
          className="inline-flex min-h-14 items-center justify-center gap-3 rounded-lg bg-red-600 px-5 text-xl font-bold text-white shadow-md transition hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500 disabled:shadow-none"
        >
          <ArrowLeft size={24} />
          Fuerza izquierda
        </button>
        <button
          type="button"
          disabled={isAtRightLimit}
          onClick={() => onPresetForce(50)}
          className="inline-flex min-h-14 items-center justify-center gap-3 rounded-lg bg-green-600 px-5 text-xl font-bold text-white shadow-md transition hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500 disabled:shadow-none"
        >
          Fuerza derecha
          <ArrowRight size={24} />
        </button>
        <div className="grid gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => onPresetForce(0)}
            className="inline-flex min-h-14 items-center justify-center gap-3 rounded-lg bg-slate-700 px-5 text-lg font-bold text-white shadow-md transition hover:bg-slate-800"
          >
            <CirclePause size={22} />
            Sin fuerza
          </button>
          <button
            type="button"
            onClick={onReset}
            className="inline-flex min-h-14 items-center justify-center gap-3 rounded-lg bg-blue-600 px-5 text-lg font-bold text-white shadow-md transition hover:bg-blue-700"
          >
            <RotateCcw size={22} />
            Reiniciar
          </button>
        </div>
        <button
          type="button"
          onClick={onToggleManual}
          className={`inline-flex min-h-14 items-center justify-center gap-3 rounded-lg px-5 text-lg font-bold shadow-md transition ${
            manualMode
              ? 'bg-blue-100 text-blue-800 ring-2 ring-blue-500'
              : 'bg-white text-slate-800 ring-1 ring-slate-200 hover:bg-slate-50'
          }`}
        >
          <SlidersHorizontal size={22} />
          Modo manual
        </button>
      </div>

      {manualMode && (
        <div className="mt-6 grid gap-4">
          {fields.map((field) => (
            <label key={field.key} className="block">
              <span className="mb-2 block text-base font-bold text-slate-700">
                {field.label} {field.unit && <span className="font-semibold text-slate-500">({field.unit})</span>}
              </span>
              <input
                type="number"
                step={field.step}
                min={field.min}
                max={field.max}
                value={values[field.key]}
                onChange={(event) => onChangeValue(field.key, event.target.value)}
                className={`h-14 w-full rounded-lg border bg-white px-4 py-3 text-lg font-semibold text-slate-900 outline-none transition focus:ring-4 ${
                  errors[field.key]
                    ? 'border-red-500 focus:ring-red-100'
                    : 'border-slate-300 focus:border-blue-500 focus:ring-blue-100'
                }`}
              />
              {errors[field.key] && <span className="mt-1 block text-sm font-semibold text-red-600">{errors[field.key]}</span>}
            </label>
          ))}
        </div>
      )}
    </section>
  );
}
