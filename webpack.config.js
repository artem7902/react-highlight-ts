const nodeExternals = require("webpack-node-externals");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const DtsBundleWebpack = require('dts-bundle-webpack');
const path = require("path");
const env = require("yargs").argv.env; // use --env with webpack 2

const plugins = [];
const libraryName = "highlightable-ts"
let outputFile;
if (env === "build") {
    plugins.push(new DtsBundleWebpack({
        name: libraryName,
        main: __dirname + "/lib/index.d.ts",
        out: __dirname + "/lib/index.d.ts",
        removeSource: true,
        outputAsModuleFolder: true
    }));
    outputFile = libraryName + ".js";
} else {
    outputFile = libraryName + ".js";
}

const buildConfig =  {
        entry: __dirname + "/src/index.ts",
        devtool: "source-map",
        output: {
            path: __dirname + "/lib",
            filename: outputFile,
            library: libraryName,
            libraryTarget: "umd",
            umdNamedDefine: true
        },
        module: {
            rules: [
                {
                    test: /(\.tsx|\.ts)$/,
                    loader: "ts-loader"
                },
                { test: /sinon\.js$/, loader: "imports-loader?define=>false,require=>false"}
            ]
        },
        resolve: {
            modules: [path.resolve("./node_modules"), path.resolve("./src")],
            extensions: [".json", ".js", ".jsx", ".ts", ".tsx"],
            alias: { sinon: 'sinon/pkg/sinon.js' }
        },
        optimization: {
            minimizer: [new UglifyJsPlugin()],
        },
        externals: [nodeExternals()],
        plugins: plugins
    };

module.exports = buildConfig;