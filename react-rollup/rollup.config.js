import babel from 'rollup-plugin-babel'
import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import copy from 'rollup-plugin-copy'
import { terser } from 'rollup-plugin-terser'
import replace from 'rollup-plugin-replace'
import livereload from 'rollup-plugin-livereload'
import serve from 'rollup-plugin-serve'

const dist = 'dist'
const production = !process.env.ROLLUP_WATCH
const mode = production ? 'production' : 'development'

export default {
  input: 'src/index.js',
  output: {
    file: `${dist}/bundle.js`,
    format: 'iife', // iife|esm|es|csj
    sourcemap: true
  },
  plugins: [
    copy({
      'index.html': `${dist}/index.html`
    }),
    serve({
      open: true,
      port: 3000,
      contentBase: dist,
      historyApiFallback: true
    }),
    livereload(),
    // Babel at the top, otherwise can't interpret JSX
    babel({
      exclude: 'node_modules/**'
    }),
    // Requires Node.js resolution algorithm for 3rd-party libs
    resolve({
      browser: true // Look for "browser" in package.json
    }),
    // For react-dom because it's written purely in CJS
    commonjs({
      namedExports: {
        // Enable import { render } from 'react-dom'
        'node_modules/react-dom/index.js': ['render']
      }
    }),
    replace({
      // react-dom has process.env conditional(s) that get bundled
      'process.env.NODE_ENV': JSON.stringify(mode)
    }),
    // Because rollup-plugin-uglify only transpiles ES5
    production && terser()
  ]
}
