import { useEffect, useRef, useState } from 'react';
import { RotateCcw, Zap } from 'lucide-react';

type SimulationCanvasProps = {
  angle: number;
  position: number;
  appliedForce: number;
  velocity: number;
  acceleration: number;
  direction: string;
  state: string;
};

export default function SimulationCanvas({
  angle,
  position,
  appliedForce,
  velocity,
  acceleration,
  direction,
  state,
}: SimulationCanvasProps) {
  const sceneRef = useRef<HTMLDivElement>(null);
  const [sceneSize, setSceneSize] = useState({ width: 100, height: 330 });
  const clampedAngle = Math.max(0, Math.min(angle, 60));
  const rampStart = { x: 12, y: 62 };
  const rampEnd = { x: 90, y: 62 - (clampedAngle / 60) * 42 };
  const cartProgress = Math.max(0.05, Math.min(position, 0.94));
  const cartSvgX = rampStart.x + (rampEnd.x - rampStart.x) * cartProgress;
  const cartSvgY = rampStart.y + (rampEnd.y - rampStart.y) * cartProgress;
  const cartX = cartSvgX;
  const cartY = (cartSvgY / 70) * 100;
  const rampWidthPx = ((rampEnd.x - rampStart.x) / 100) * sceneSize.width;
  const rampHeightPx = ((rampStart.y - rampEnd.y) / 70) * sceneSize.height;
  const visualRampAngle = (Math.atan2(rampHeightPx, rampWidthPx) * 180) / Math.PI;
  const forceDirection = appliedForce > 0 ? 'right' : appliedForce < 0 ? 'left' : 'none';

  useEffect(() => {
    if (!sceneRef.current) return;

    const updateSceneSize = () => {
      if (!sceneRef.current) return;
      const { width, height } = sceneRef.current.getBoundingClientRect();
      setSceneSize({ width, height });
    };

    updateSceneSize();
    const resizeObserver = new ResizeObserver(updateSceneSize);
    resizeObserver.observe(sceneRef.current);

    return () => resizeObserver.disconnect();
  }, []);

  return (
    <section className="rounded-lg bg-white p-5 shadow-soft lg:p-7">
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Simulacion del carrito</h2>
          <p className="mt-1 text-lg text-slate-600">
            Rampa inclinada a {angle.toFixed(0)} grados con movimiento animado.
          </p>
        </div>
        <span className="inline-flex w-fit items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-base font-semibold text-blue-700">
          <Zap size={19} />
          {state}
        </span>
      </div>

      <div
        ref={sceneRef}
        className="relative h-[330px] overflow-hidden rounded-lg border border-slate-200 bg-gradient-to-b from-blue-50 to-white"
      >
        <div className="absolute inset-x-0 bottom-0 h-24 bg-green-100" />
        <svg viewBox="0 0 100 70" className="absolute inset-0 h-full w-full" aria-hidden="true">
          <line
            x1={rampStart.x}
            y1={rampStart.y}
            x2={rampEnd.x}
            y2={rampEnd.y}
            stroke="#64748b"
            strokeWidth="3.5"
          />
          <line
            x1={rampStart.x}
            y1={rampStart.y + 3}
            x2={rampEnd.x + 1}
            y2={rampEnd.y + 3}
            stroke="#e2e8f0"
            strokeWidth="2"
          />
          <path
            d={`M${rampStart.x} ${rampStart.y} L${rampEnd.x} ${rampEnd.y} L${rampEnd.x} 66 L${rampStart.x} 66 Z`}
            fill="#dcfce7"
            opacity="0.72"
          />
          <text x="68" y="56" fill="#475569" fontSize="4.2" fontWeight="700">
            angulo {angle.toFixed(0)} grados
          </text>
        </svg>

        <div
          className="absolute h-16 w-24 transition-all duration-500 ease-out"
          style={{
            left: `${cartX}%`,
            top: `${cartY}%`,
            transform: 'translate(-50%, -95%)',
          }}
        >
          <div
            className="relative h-full w-full"
            style={{
              transform: `rotate(${-visualRampAngle}deg)`,
              transformOrigin: '50% 95%',
            }}
          >
            <div className="absolute left-2 top-3 h-9 w-20 rounded-lg border-4 border-blue-800 bg-blue-500 shadow-lg" />
            <div className="absolute left-5 top-1 h-5 w-9 rounded-t-lg bg-blue-200" />
            <div className="absolute bottom-2 left-4 h-5 w-5 rounded-full border-4 border-slate-800 bg-white" />
            <div className="absolute bottom-2 right-4 h-5 w-5 rounded-full border-4 border-slate-800 bg-white" />
          </div>
        </div>

        {forceDirection !== 'none' && (
          <div
            className={`absolute top-16 flex items-center gap-2 rounded-full px-4 py-2 text-lg font-bold text-white shadow-lg ${
              forceDirection === 'right' ? 'left-8 bg-green-600' : 'right-8 flex-row-reverse bg-red-600'
            }`}
          >
            <span>{forceDirection === 'right' ? '→' : '←'}</span>
            <span>{Math.abs(appliedForce).toFixed(0)} N</span>
          </div>
        )}
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <Metric label="Direccion" value={direction} />
        <Metric label="Velocidad" value={`${velocity.toFixed(2)} m/s`} />
        <Metric label="Aceleracion" value={`${acceleration.toFixed(2)} m/s²`} />
      </div>

      <p className="mt-4 flex items-start gap-2 rounded-lg bg-slate-50 p-4 text-base text-slate-600">
        <RotateCcw className="mt-1 shrink-0 text-slate-500" size={18} />
        Esta es una simulacion educativa simplificada. Los resultados aproximan el movimiento para
        explorar la Primera Ley de Newton.
      </p>
    </section>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
      <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-1 text-xl font-bold text-slate-900">{value}</p>
    </div>
  );
}
