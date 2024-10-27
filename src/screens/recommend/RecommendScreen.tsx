import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { SafeAreaView, StyleSheet, Text } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import PopularStoryScreen from './PopularStoryScreen';
import LatestStoryScreen from './LatestStoryScreen';
import AllStoryScreen from './AllStoryScreen';

// 상단 탭 네비게이터 생성
const TopTab = createMaterialTopTabNavigator();

const RecommendScreen: React.FC = () => (
  <GestureHandlerRootView style={{ flex: 1 }}>
    <SafeAreaView style={{ flex: 1 }}>
      <TopTab.Navigator
        initialRouteName="Popular"
        screenOptions={{
          tabBarStyle: styles.tabBar,
          tabBarIndicatorStyle: styles.tabBarIndicator,
          tabBarLabelStyle: styles.tabLabel,
        }}
        tabBarPosition="top"
      >
        <TopTab.Screen
          name="Popular"
          component={PopularStoryScreen}
          options={{ tabBarLabel: () => <Text>인기 동화</Text> }}
        />
        <TopTab.Screen
          name="LatestStory"
          component={LatestStoryScreen}
          options={{ tabBarLabel: () => <Text>최신 동화</Text> }}
        />
        <TopTab.Screen
          name="AllStory"
          component={AllStoryScreen}
          options={{ tabBarLabel: () => <Text>전체 동화</Text> }}
        />
      </TopTab.Navigator>
    </SafeAreaView>
  </GestureHandlerRootView>
);

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#f0f0f0',
  },
  tabBarIndicator: {
    backgroundColor: '#000',
    height: 3,
  },
  tabLabel: {
    fontSize: 16,
    textTransform: 'none',
  },
});

export default RecommendScreen;
