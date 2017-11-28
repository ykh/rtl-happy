const CopyWebpackPlugin = require('copy-webpack-plugin');

const entry = [];
entry.push('./src/assets/styles/style.scss');
entry.push('./src/rtl-happy.js');
entry.push({'dist/extension': './src/extension/background.js'});

module.exports = {
    entry: {
        'rtl-happy.min': [
            './src/assets/styles/style.scss',
            './src/rtl-happy.js'
        ],
        'background': './src/extension/background.js',
    },
    output: {
        path: __dirname,
        filename: "./dist/extension/[name].js"
    },
    module: {
        loaders: [
            {
                test: /\.css$/,
                loader: "style!css",
            },
        ],
        rules: [
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            },
            {
                test: /src\/assets\/styles\/style\.scss$/,
                use: [{
                    loader: "style-loader" // creates style nodes from JS strings
                }, {
                    loader: "css-loader" // translates CSS into CommonJS
                }, {
                    loader: "sass-loader" // compiles Sass to CSS
                }]
            },
        ]
    },
    plugins: [
        new CopyWebpackPlugin([
            {
                from: './src/assets/styles/applications/**/*.css',
                to: './dist/extension/css',
                flatten: true,
            },
        ]),
    ],
};