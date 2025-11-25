const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    client: {
      overlay: {
        runtimeErrors: (error) => {
          if (!error || !error.message) return true
          const errorMessage = String(error.message)
          if (errorMessage.includes('ResizeObserver')) {
            return false
          }
          return true
        },
        errors: true,
        warnings: false
      }
    }
  }
})
