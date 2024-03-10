const { defineConfig } = require('@vue/cli-service')
module.exports = {
  devServer: {
    proxy: {
      '/api': {
        target: 'http://161.35.19.27:8000',
        changeOrigin: true,
        pathRewrite: { '^/api': '' }
      }
    }
  }
}
