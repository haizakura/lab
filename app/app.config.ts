export default defineAppConfig({
  baseUrl: 'https://lab.nya.run',
  itemConfig: {
    rate: {
      icon: 'mdi:currency-usd-circle-outline',
      title: 'Exchange Rate Query',
      name: 'rate',
      path: '/rate',
      desc: 'Exchange rates provided on this website are from UnionPay System.',
    },
    longTextMaker: {
      icon: 'mdi:text-long',
      title: 'Long Text Maker',
      name: 'longTextMaker',
      path: '/long-text-maker',
      desc: 'Make long text with ease.',
    },
    randomId: {
      icon: 'mdi:code-tags',
      title: 'Random ID Generator',
      name: 'randomId',
      path: '/random-id',
      desc: 'Generate a random ID. Supports UUID v4, CUID, and UUID v1.',
    },
    item02: {
      icon: 'mdi:tools',
      title: 'Under Development',
      name: 'underDevelopment',
      path: '/under-development',
      desc: 'This project is under development.',
    },
    item03: {
      icon: 'mdi:tools',
      title: 'Under Development',
      name: 'underDevelopment',
      path: '/under-development',
      desc: 'This project is under development.',
    },
  },
});
