import { defineConfig } from 'astro/config';
import react from "@astrojs/react";

import tailwind from "@astrojs/tailwind";

// https://astro.build/config
export default defineConfig({
  output: "static",
  integrations: [react({
    experimentalReactChildren: true,
    contentCollectionCache: true,
  }), tailwind()]
});