module.exports = {
    entry: './example/main.js',
    output: {
        path: __dirname + "/example",
        filename: 'bundle.js',
        publicPath: '/example'
    }
}
