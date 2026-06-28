# InerSim Web: Primera Ley de Newton

Aplicacion web educativa creada con React, Vite, TypeScript, Tailwind CSS y Recharts.

Permite simular un carrito sobre una rampa, aplicar fuerza hacia la izquierda o derecha, usar modo manual, calcular resultados fisicos aproximados, guardar historial en `localStorage`, graficar datos y exportarlos a CSV.

## Requisitos

- Node.js 18 o superior
- npm

## Ejecutar en desarrollo

```bash
npm install
npm run dev
```

## Compilar para produccion

```bash
npm run build
```

La salida queda en la carpeta `dist/`.

## Vista previa local de produccion

```bash
npm run preview
```

## Despliegue en Vercel

1. Subir el proyecto a GitHub.
2. Entrar a Vercel y crear un nuevo proyecto desde el repositorio.
3. Usar la configuracion detectada:
   - Framework: Vite
   - Build command: `npm run build`
   - Output directory: `dist`
4. Publicar.

## Despliegue en Netlify

1. Subir el proyecto a GitHub.
2. Entrar a Netlify y crear un sitio desde el repositorio.
3. Configurar:
   - Build command: `npm run build`
   - Publish directory: `dist`
4. Publicar.

## Despliegue en GitHub Pages

1. Instalar `gh-pages` si se desea publicar desde npm:

```bash
npm install --save-dev gh-pages
```

2. Agregar estos scripts en `package.json`:

```json
{
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  }
}
```

3. Ejecutar:

```bash
npm run deploy
```

Tambien se puede desplegar con GitHub Actions usando `npm run build` y publicando la carpeta `dist`.

## Notas de fisica

La simulacion usa un modelo simplificado:

- `fuerzaGravedad = masa * 9.8 * sin(angulo)`
- `fuerzaFriccion = friccion * masa * 9.8 * cos(angulo)`
- `fuerzaNeta = fuerzaAplicada + fuerzaGravedad - fuerzaFriccion`
- `aceleracion = fuerzaNeta / masa`
- `velocidad = velocidad + aceleracion * deltaTiempo`

Los resultados son aproximados y se presentan con fines educativos.
