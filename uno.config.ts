import { defineConfig, presetWind4 } from 'unocss';

export default defineConfig({
  presets: [presetWind4()],
  theme: {
    colors: {
      primary: '#303133',
      regular: '#606266',
      line: {
        light: '#e4e7ed',
      },
    },
  },
  shortcuts: {
    app: 'flex flex-col',

    header: 'top-0 left-0 right-0 z-1000 block static border-b border-b-line-light border-solid',
    'header-container': 'flex justify-between items-center w-full',
    'header-left': 'cursor-pointer no-underline leading-[60px] font-bold text-xl',
    'header-right': 'flex items-center',
    'header-icon': 'text-2xl leading-[60px] cursor-pointer text-regular',

    main: 'block pt-4 px-4 pb-8 max-w-[82.5rem] ml-auto mr-auto',

    card: 'h-full flex flex-col',
    'card-header': 'flex justify-between items-center',
    'card-body': 'leading-[1.55rem] min-h-[3.1rem] no-underline mb-2',
    'card-bottom': 'leading-[1rem] flex justify-between items-center mt-auto',
  },
});
