// eslint-disable-next-line @typescript-eslint/no-var-requires
const UglifyPlugin = require('uglifyjs-webpack-plugin')

module.exports = {
    externals: [
        './ormconfig.json'
    ],
    plugins: [
        new UglifyPlugin({
            sourceMap: false,
            test: /\.js($|\?)/i,
            parallel: true,
            uglifyOptions: {
                ecma: 8,
                // 是否删除注释
                output: {
                    comments: false,
                    beautify: false
                },
                warnings: false,
                compress: {
                    // 是否删除警告信息
                    // 是否删除debugger
                    drop_debugger: true,
                    // 是否删除console
                    drop_console: true
                }
            }
        })
    ]
};