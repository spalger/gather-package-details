import { resolve } from 'path'

export default {
  context: resolve(__dirname, 'src'),
  entry: './index.js',
  output: {
    path: resolve(__dirname, 'dist'),
    filename: 'bundle.js',
  },
}
