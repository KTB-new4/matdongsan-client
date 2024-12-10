module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    'react-native-reanimated/plugin',
    [
      '@babel/plugin-transform-class-properties',
      { loose: true }, // loose 모드 설정
    ],
    [
      '@babel/plugin-transform-private-methods',
      { loose: true }, // loose 모드 설정
    ],
    [
      '@babel/plugin-transform-private-property-in-object',
      { loose: true }, // loose 모드 설정
    ],
  ],
};