import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import tsConfigPaths from "rollup-plugin-tsconfig-paths"

export default [
  {
    input: 'src/main.ts',
    output: {
      dir: 'dist',
      format: 'esm',
    },
    plugins: [
      tsConfigPaths(),
      resolve(),
      commonjs(),
      typescript({
        tsconfig: './tsconfig.rollup.json',
      }),
    ],
  },
];