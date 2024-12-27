import React from 'react';
import Navi from './navigation/AppNavigator'
import { AppRegistry, LogBox } from 'react-native';
import {name as appName} from '../app.json';
import 'react-native-reanimated'

LogBox.ignoreAllLogs(true); // 모든 경고 숨기기

AppRegistry.registerComponent(appName, () => App);

const App = () => {
  return (
    <Navi>
    </Navi>
  );
};

export default App;
