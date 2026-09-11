export default defineAppConfig({
  baseUrl: 'https://lab.nya.run',
  itemConfig: {
    rate: {
      icon: 'circle-dollar-sign',
      title: 'Exchange Rate Query',
      name: 'rate',
      path: '/rate',
      desc: 'Exchange rates provided on this website are from UnionPay System.',
    },
    longTextMaker: {
      icon: 'text',
      title: 'Long Text Maker',
      name: 'longTextMaker',
      path: '/long-text-maker',
      desc: 'Make long text with ease. Also support Chinese, Japanese, etc...',
    },
    randomId: {
      icon: 'braces',
      title: 'Random ID Generator',
      name: 'randomId',
      path: '/random-id',
      desc: 'Generate a random ID. Supports UUID v4, CUID, and UUID v1.',
    },
    encode: {
      icon: 'file-json',
      title: 'Encode/Decode String',
      name: 'encode',
      path: '/encode',
      desc: 'Encode and decode string with ease. base64, MD5, URL, etc.',
    },
    underDevelopment: {
      icon: 'wrench',
      title: 'Under Development',
      name: 'underDevelopment',
      path: '/under-development',
      desc: 'This project is under development, please wait.',
    },
  },
});
