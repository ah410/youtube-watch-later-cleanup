import { build } from 'esbuild';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const dir = path.dirname(fileURLToPath(import.meta.url));

await build({
    entryPoints: [
        path.join(dir, 'background.ts'),
        path.join(dir, 'content/content.ts'),
    ],
    outdir: path.join(dir, 'dist'),
    bundle: true,
    format: 'iife',
    target: 'es2022',
    sourcemap: true,
});

console.log('Extension built to extension/dist/');
