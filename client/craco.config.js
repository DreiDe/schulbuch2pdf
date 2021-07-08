// craco.config.js
module.exports = {
  style: {
    postcss: {
      plugins: [
        require('tailwindcss'),
        require('autoprefixer'),
      ],
    },
  },
  devServer: {
    proxy: {
      "/socket.io": {
        target: 'ws://localhost:5000',
        ws: true,
        changeOrigin: true
      },
      "/download": {
        target: 'http://localhost:5000',
      },
    }
  },
}