// AllStoryScreen.tsx
import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { SafeAreaView, Text } from 'react-native';
import AllStory from './allstory/AllStory';
import LevelOneStory from './allstory/LevelOneStory';
import LevelTwoStory from './allstory/LevelTwoStory';
import LevelThreeStory from './allstory/LevelThreeStory';

const TopTab = createMaterialTopTabNavigator();

const AllStoryScreen: React.FC = () => (
  <SafeAreaView style={{ flex: 1 }}>
    <TopTab.Navigator
      initialRouteName="AllStory"
      screenOptions={{
        tabBarStyle: { backgroundColor: '#f0f0f0' },
        tabBarIndicatorStyle: { backgroundColor: '#000', height: 3 },
        tabBarLabelStyle: { fontSize: 16, textTransform: 'none' },
      }}
    >
      <TopTab.Screen
        name="AllStory"
        component={AllStory}
        options={{ tabBarLabel: () => <Text>전체</Text> }}
      />
      <TopTab.Screen
        name="LevelOneStory"
        component={LevelOneStory}
        options={{ tabBarLabel: () => <Text>레벨1</Text> }}
      />
      <TopTab.Screen
        name="LevelTwoStory"
        component={LevelTwoStory}
        options={{ tabBarLabel: () => <Text>레벨2</Text> }}
      />
      <TopTab.Screen
        name="LevelThreeStory"
        component={LevelThreeStory}
        options={{ tabBarLabel: () => <Text>레벨3</Text> }}
      />
    </TopTab.Navigator>
  </SafeAreaView>
);

export default AllStoryScreen;
