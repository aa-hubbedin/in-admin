const fs = require('fs')

module.exports = {
    "transpileDependencies": [
      "vuetify"
    ],
    devServer: {
        host: 'hubbedin.admin',
        port: 3001,
        https: {
            key: fs.readFileSync("./certs/hubbedin.admin.key"),
            cert: fs.readFileSync("./certs/hubbedin.admin.crt")
        }
    },
    configureWebpack: {
        module: {
            rules: [
                {
                    test: /\.(csv|xlsx)$/,
                    loader: 'file-loader',
                    options: {
                        name: `[name].[ext]`
                    }
                }
            ]
        }
    }
}