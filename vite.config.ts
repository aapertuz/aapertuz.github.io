import { defineConfig } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'

export default defineConfig({
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] }),
  ],
  resolve: { dedupe: ['three'] },
  build: {
    rolldownOptions: {
      output: {
        codeSplitting: {
          groups: [
            {
              name: 'three-core',
              test: /node_modules[\\/]three[\\/]build[\\/]/,
              priority: 30,
              maxSize: 400_000,
            },
            {
              name: 'three-addons',
              test: /node_modules[\\/]three[\\/]examples[\\/]/,
              priority: 20,
              maxSize: 400_000,
            },
            {
              name: 'react-three',
              test: /node_modules[\\/]@react-three[\\/]/,
              priority: 10,
              maxSize: 400_000,
            },
          ],
        },
      },
    },
  },
})
