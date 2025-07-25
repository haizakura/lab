import { defineConfig, presetWind4 } from 'unocss';

export default defineConfig({
  presets: [presetWind4()],
  shortcuts: {
    app: 'flex flex-col',
    header: 'top-0 left-0 right-0 z-1000 block static border-b border-b-[#E9ECEF] border-solid',
    main: 'block pt-4 px-4 pb-8 max-w-[82.5rem] ml-auto mr-auto',
    footer: 'shrink-0 text-center',
  },
});
