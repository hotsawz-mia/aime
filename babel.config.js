module.exports = {
  presets: [
    ['@babel/preset-env', { targets: { node: 'current' } }], // for Jest/node
    ['@babel/preset-react', { runtime: 'automatic' }],       // automatic JSX runtime
  ],
};
