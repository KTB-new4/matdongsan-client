// RecommendScreen.tsx
import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { SafeAreaView, StyleSheet, Text } from 'react-native';
import PopularStoryScreen from './PopularStoryScreen';
import LatestStoryScreen from './LatestStoryScreen';
import AllStoryScreen from './AllStoryScreen';

type RecommendStackParamList = {
  RecommendScreen: undefined;
  AllStoryScreen: undefined;
};

const TopTab = createMaterialTopTabNavigator();

const RecommendScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp<RecommendStackParamList>>();

  return (
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
          name="PopularStory"
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
          component={AllStoryScreen} // 빈 컴포넌트를 설정하거나 원하는 초기 화면을 넣을 수 있습니다.
          options={{ tabBarLabel: () => <Text>전체 동화</Text> }}
          listeners={{
            tabPress: e => {
              e.preventDefault(); // 기본 탭 이동을 방지
              navigation.navigate('AllStoryScreen'); // AllStoryScreen으로 이동
            },
          }}
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

export default RecommendScreen;
