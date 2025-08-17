import { defineConfig, presetWind4 } from 'unocss';

export default defineConfig({
  presets: [presetWind4()],
  theme: {
    colors: {
      brand: '#409eff',
      success: '#67c23a',
      warning: '#e6a23c',
      danger: '#f56c6c',
      info: '#909399',
      primary: '#303133',
      regular: '#606266',
      line: {
        base: '#dcdfe6',
        light: '#e4e7ed',
      },
      fill: {
        base: '#f0f2f5',
      },
    },
  },
  shortcuts: {
    app: 'flex flex-col leading-[1.55rem] text-4 antialiased',

    header: 'top-0 left-0 right-0 z-1000 block static border-b border-b-line-light border-solid',
    'header-container': 'flex justify-between items-center w-full',
    'header-left': 'cursor-pointer no-underline leading-[60px] font-bold text-2xl',
    'header-right': 'flex items-center',
    'header-icon': 'text-2xl leading-[60px] cursor-pointer',

    main: 'block pt-4 px-4 pb-8 w-full max-w-[82.5rem] ml-auto mr-auto',

    card: 'h-full flex flex-col',
    'card-header': 'flex justify-between items-center',
    'card-header-title': 'flex items-center gap-2 text-xl font-bold',
    'card-body': 'leading-[1.55rem] min-h-[3.1rem] no-underline mb-2',
    'card-bottom': 'leading-[1rem] flex justify-between items-center mt-auto',

    'project-search': 'w-full flex flex-row gap-2 justify-between mb-4',
    'project-list': 'w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-4',

    page: 'flex justify-center items-center h-full',
  },
});
