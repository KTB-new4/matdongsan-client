import React from 'react';
import Navi from './navigation/AppNavigator'
import { AppRegistry } from 'react-native';
import {name as appName} from '../app.json';
import 'react-native-reanimated'

AppRegistry.registerComponent(appName, () => App);

const App = () => {
  return (
    <Navi>
    </Navi>
  );
};

export default App;
