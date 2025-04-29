const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  publicPath: process.env.VUE_APP_IS_SERVE === 'true' ? "/" : process.env.VUE_PUBLIC_PATH,
  configureWebpack: {
    module: {
      exprContextCritical: false,
    },
    output: {
      filename: 'js/[name].[contenthash].js',
      chunkFilename: 'js/[contenthash].js',
    },
  },
  css: {
    extract: {
      filename: 'css/[name].[contenthash].css',
      chunkFilename: 'css/[contenthash].css',
    },
    sourceMap: false,
  },
  devServer: {
    client: {
      overlay: false
    },   
    proxy: {
      '^/ajax': {
        target: 'http://localhost',
        ws: true,
        changeOrigin: true
      },
    }
  }
});
