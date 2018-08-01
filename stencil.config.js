const sass = require('@stencil/sass');

exports.config = {
  namespace: 'bind-gallery',
  outputTargets:[
    {
      type: 'dist'
    },
    {
      type: 'www',
      serviceWorker: false
    }
  ],
  plugins: [
    sass()
  ],
  enableCache: false
};
