import { defineConfig } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'

export default defineConfig({
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] }),
  ],
  resolve: { dedupe: ['three'] },
  // Let Rolldown preserve dependency ordering. Forced size-based renderer groups
  // created circular chunks that crashed before React could mount in production.
})
