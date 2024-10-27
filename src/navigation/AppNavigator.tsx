import React from 'react';
import { CommonActions, NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/create/HomeScreen';
import MyLibraryScreen from '../screens/MyLibraryScreen';
import { createStackNavigator } from '@react-navigation/stack';
import LoadingScreen from '../screens/create/LoadingScreen';
import StoryCreateFinishScreen from '../screens/create/StoryCreateFinishScreen';
import PlayScreen from '../screens/create/PlayScreen';
import MyStatusScreen from '../screens/MyStatusScreen';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import RecommendScreen from '../screens/recommend/RecommendScreen';

const Tab = createBottomTabNavigator();
const HomeStack = createStackNavigator();
const TopTab = createMaterialTopTabNavigator();

const HomeStackScreen = () => (
  <HomeStack.Navigator screenOptions={{headerShown: false}}>
    <HomeStack.Screen name="Home" component={HomeScreen}/>
    <HomeStack.Screen name="Loading" component={LoadingScreen}/>
    <HomeStack.Screen name="Create Finish" component={StoryCreateFinishScreen}/>
    <HomeStack.Screen name="Play" component={PlayScreen}/>
  </HomeStack.Navigator>
)

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator screenOptions={{headerShown : false}}>
        <Tab.Screen name="HomeNav" component={HomeStackScreen} 
          listeners={({ navigation}) => ({
            tabPress: (e) => {
              e.preventDefault();
              navigation.dispatch(
                CommonActions.reset({
                index: 0,
                routes: [{ name : 'HomeNav', params: {screen: 'Home'}}],
              })
            );
          },
        })}/>
        <Tab.Screen name="RecommendNav" component={RecommendScreen} />
        <Tab.Screen name="My LibraryNav" component={MyLibraryScreen} />
        <Tab.Screen name="My Status" component={MyStatusScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
