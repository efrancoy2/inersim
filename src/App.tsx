import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { BookOpen, Gauge, Sigma } from 'lucide-react';
import ChartsPanel from './components/ChartsPanel';
import ControlPanel, { type SimulationValues } from './components/ControlPanel';
import HistoryTable, { type HistoryEntry } from './components/HistoryTable';
import SimulationCanvas from './components/SimulationCanvas';
import { calculatePhysics, round } from './utils/physics';

const STORAGE_KEY = 'inersim-web-history';
const DELTA_TIME = 0.2;
const MIN_POSITION = 0.05;
const MAX_POSITION = 0.94;
const INITIAL_POSITION = MIN_POSITION;

const initialValues: SimulationValues = {
  appliedForce: 0,
  friction: 0.08,
  angle: 0,
  mass: 4,
  velocity: 0,
};

function loadHistory(): HistoryEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as HistoryEntry[]) : [];
  } catch {
    return [];
  }
}

export default function App() {
  const [values, setValues] = useState<SimulationValues>(initialValues);
  const [manualMode, setManualMode] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof SimulationValues, string>>>({});
  const [history, setHistory] = useState<HistoryEntry[]>(loadHistory);
  const [time, setTime] = useState(0);
  const [position, setPosition] = useState(INITIAL_POSITION);
  const [simulationActive, setSimulationActive] = useState(false);
  const isFirstHistoryWrite = useRef(true);
  const valuesRef = useRef(values);
  const positionRef = useRef(position);

  const result = useMemo(
    () =>
      calculatePhysics({
        ...values,
        deltaTime: DELTA_TIME,
      }),
    [values],
  );

  const addHistoryEntry = useCallback(
    (nextValues: SimulationValues, nextTime = time) => {
      const nextResult = calculatePhysics({
        ...nextValues,
        deltaTime: DELTA_TIME,
      });
      const entry: HistoryEntry = {
        id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
        time: round(nextTime, 1),
        appliedForce: round(nextValues.appliedForce),
        friction: round(nextValues.friction),
        angle: round(nextValues.angle),
        velocity: round(nextResult.velocity),
        acceleration: round(nextResult.acceleration),
        netForce: round(nextResult.netForce),
      };
      setHistory((current) => [...current.slice(-79), entry]);
    },
    [time],
  );

  useEffect(() => {
    if (isFirstHistoryWrite.current) {
      isFirstHistoryWrite.current = false;
      return;
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    valuesRef.current = values;
  }, [values]);

  useEffect(() => {
    positionRef.current = position;
  }, [position]);

  useEffect(() => {
    if (!simulationActive) return;

    const interval = window.setInterval(() => {
      const nextResult = calculatePhysics({ ...valuesRef.current, deltaTime: DELTA_TIME });
      const nextVelocity = round(nextResult.velocity, 3);
      const nextPosition = positionRef.current + nextVelocity * 0.012;
      const reachedRightLimit = nextPosition >= MAX_POSITION && nextVelocity > 0;
      const reachedLeftLimit = nextPosition <= MIN_POSITION && nextVelocity < 0;

      if (reachedRightLimit || reachedLeftLimit) {
        const boundaryPosition = reachedRightLimit ? MAX_POSITION : MIN_POSITION;
        const stoppedValues = { ...valuesRef.current, appliedForce: 0, velocity: 0 };

        positionRef.current = boundaryPosition;
        valuesRef.current = stoppedValues;
        setPosition(boundaryPosition);
        setValues(stoppedValues);
        setSimulationActive(false);
        return;
      }

      valuesRef.current = { ...valuesRef.current, velocity: nextVelocity };
      positionRef.current = nextPosition;
      setValues(valuesRef.current);
      setTime((current) => round(current + DELTA_TIME, 1));
      setPosition(nextPosition);
    }, 500);

    return () => window.clearInterval(interval);
  }, [simulationActive]);

  const updateValues = (nextValues: SimulationValues) => {
    setValues(nextValues);
    addHistoryEntry(nextValues);
  };

  const handlePresetForce = (force: number) => {
    if (force < 0 && position <= MIN_POSITION) return;
    if (force > 0 && position >= MAX_POSITION) return;

    setSimulationActive(true);
    updateValues({ ...values, appliedForce: force });
  };

  const handleReset = () => {
    setTime(0);
    setPosition(INITIAL_POSITION);
    setSimulationActive(false);
    setErrors({});
    updateValues(initialValues);
  };

  const handleManualChange = (key: keyof SimulationValues, rawValue: string) => {
    const parsed = Number(rawValue);
    if (rawValue.trim() === '' || Number.isNaN(parsed)) {
      setErrors((current) => ({ ...current, [key]: 'Ingrese un valor numerico.' }));
      return;
    }

    const normalized =
      key === 'mass'
        ? Math.max(parsed, 0.01)
        : key === 'friction'
          ? Math.max(parsed, 0)
          : key === 'angle'
            ? Math.max(Math.min(parsed, 60), 0)
            : parsed;

    setErrors((current) => {
      const next = { ...current };
      delete next[key];
      return next;
    });
    setSimulationActive(true);
    updateValues({ ...values, [key]: normalized });
  };

  const handleClearHistory = () => {
    setHistory([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  const handleExportCsv = () => {
    const headers = [
      'Tiempo',
      'Fuerza aplicada',
      'Friccion',
      'Angulo',
      'Velocidad',
      'Aceleracion',
      'Fuerza neta',
    ];
    const rows = history.map((entry) => [
      entry.time,
      entry.appliedForce,
      entry.friction,
      entry.angle,
      entry.velocity,
      entry.acceleration,
      entry.netForce,
    ]);
    const csv = [headers, ...rows].map((row) => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'inersim-historial.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <main className="min-h-screen bg-slate-100">
      <section className="bg-white">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[1fr_380px] lg:px-8 lg:py-10">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-base font-bold text-blue-700">
              <BookOpen size={19} />
              Primera Ley de Newton
            </div>
            <h1 className="max-w-4xl text-4xl font-black leading-tight text-slate-950 sm:text-5xl">
              InerSim Web: Primera Ley de Newton
            </h1>
            <p className="mt-4 max-w-3xl text-xl leading-relaxed text-slate-600">
              Explora como un carrito permanece en reposo o mantiene su movimiento cuando la
              fuerza neta es cercana a cero, y como acelera cuando aparece una fuerza neta.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
            <Summary icon={<Sigma size={24} />} label="Fuerza neta" value={`${result.netForce.toFixed(2)} N`} />
            <Summary icon={<Gauge size={24} />} label="Estado" value={result.state} />
          </div>
        </div>
      </section>

      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[1fr_380px] lg:px-8">
        <div className="space-y-6">
          <SimulationCanvas
            angle={values.angle}
            position={position}
            appliedForce={values.appliedForce}
            velocity={values.velocity}
            acceleration={result.acceleration}
            direction={result.direction}
            state={result.state}
          />

          <section className="rounded-lg bg-white p-5 shadow-soft lg:p-7">
            <h2 className="text-2xl font-bold text-slate-900">Explicacion sencilla</h2>
            <p className="mt-3 text-lg leading-relaxed text-slate-600">
              La Primera Ley de Newton dice que un objeto conserva su estado de reposo o de
              movimiento rectilineo uniforme si la fuerza neta sobre el es cero. En esta actividad,
              cuando la fuerza neta cambia, tambien cambia la aceleracion del carrito.
            </p>
          </section>
        </div>

        <ControlPanel
          values={values}
          manualMode={manualMode}
          errors={errors}
          isAtLeftLimit={position <= MIN_POSITION}
          isAtRightLimit={position >= MAX_POSITION}
          onPresetForce={handlePresetForce}
          onReset={handleReset}
          onToggleManual={() => setManualMode((current) => !current)}
          onChangeValue={handleManualChange}
        />
      </div>

      <div className="mx-auto grid max-w-7xl gap-6 px-4 pb-8 sm:px-6 lg:px-8">
        <ChartsPanel history={history} />
        <HistoryTable history={history} onClear={handleClearHistory} onExport={handleExportCsv} />
      </div>
    </main>
  );
}

function Summary({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 p-5">
      <div className="mb-3 text-blue-700">{icon}</div>
      <p className="text-sm font-bold uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-1 text-2xl font-black text-slate-900">{value}</p>
    </div>
  );
}
