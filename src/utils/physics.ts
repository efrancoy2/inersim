export type PhysicsInput = {
  appliedForce: number;
  friction: number;
  angle: number;
  mass: number;
  velocity: number;
  deltaTime: number;
};

export type PhysicsResult = {
  gravityForce: number;
  frictionForce: number;
  netForce: number;
  acceleration: number;
  velocity: number;
  direction: 'Izquierda' | 'Derecha' | 'Sin movimiento';
  state: 'Reposo' | 'Movimiento uniforme' | 'Aceleracion';
};

const toRadians = (degrees: number) => (degrees * Math.PI) / 180;

export function calculatePhysics(input: PhysicsInput): PhysicsResult {
  const safeMass = Math.max(input.mass, 0.01);
  const safeFriction = Math.max(input.friction, 0);
  const radians = toRadians(input.angle);
  const gravityForce = -safeMass * 9.8 * Math.sin(radians);
  const maxFrictionForce = safeFriction * safeMass * 9.8 * Math.cos(radians);
  const forceWithoutFriction = input.appliedForce + gravityForce;
  const frictionDirection =
    Math.abs(input.velocity) >= 0.01
      ? -Math.sign(input.velocity)
      : forceWithoutFriction === 0
        ? 0
        : -Math.sign(forceWithoutFriction);
  const frictionForce =
    Math.abs(input.velocity) < 0.01 && Math.abs(forceWithoutFriction) <= maxFrictionForce
      ? -forceWithoutFriction
      : frictionDirection * maxFrictionForce;
  const netForce = forceWithoutFriction + frictionForce;
  const acceleration = netForce / safeMass;
  const velocity = input.velocity + acceleration * input.deltaTime;
  const direction =
    Math.abs(velocity) < 0.01 ? 'Sin movimiento' : velocity > 0 ? 'Derecha' : 'Izquierda';
  const state =
    Math.abs(velocity) < 0.01 && Math.abs(acceleration) < 0.01
      ? 'Reposo'
      : Math.abs(acceleration) < 0.01
        ? 'Movimiento uniforme'
        : 'Aceleracion';

  return {
    gravityForce,
    frictionForce,
    netForce,
    acceleration,
    velocity,
    direction,
    state,
  };
}

export function round(value: number, decimals = 2) {
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
}
