import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView, StyleSheet, Text } from 'react-native';
import RecentlySeenStory from './RecentlySeenStory';
import LikeStory from './LikeStory';
import MyCreateStory from './MyCreateStory';

const TopTab = createMaterialTopTabNavigator();

const MyLibraryScreen: React.FC = () => {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <TopTab.Navigator
        initialRouteName="RecentlySeen"
        screenOptions={{
          tabBarStyle: styles.tabBar,
          tabBarIndicatorStyle: styles.tabBarIndicator,
          tabBarLabelStyle: styles.tabLabel,
        }}
        tabBarPosition="top"
      >
        <TopTab.Screen
          name="RecentlySeen"
          component={RecentlySeenStory}
          options={{ tabBarLabel: () => <Text>최근에 본 동화</Text> }}
        />
        <TopTab.Screen
          name="Like"
          component={LikeStory}
          options={{ tabBarLabel: () => <Text>찜한 동화</Text> }}
        />
        <TopTab.Screen
          name="MyCreate"
          component={MyCreateStory} // 빈 컴포넌트를 설정하거나 원하는 초기 화면을 넣을 수 있습니다.
          options={{ tabBarLabel: () => <Text>내 동화</Text> }}
        />
      </TopTab.Navigator>
    </SafeAreaView>
  );
};

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

export default MyLibraryScreen;
