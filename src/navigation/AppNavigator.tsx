import React from 'react';
import { NavigationContainer, CommonActions } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Image } from 'react-native';

import HomeScreen from '../screens/create/HomeScreen';
import LoadingScreen from '../screens/create/LoadingScreen';
import StoryCreateFinishScreen from '../screens/create/StoryCreateFinishScreen';
import PlayScreen from '../screens/PlayScreen';
import RecommendScreen from '../screens/recommend/RecommendScreen';
import AllStoryScreen from '../screens/recommend/AllStoryScreen';
import StoryDetail from '../components/StoryDetail';
import MyLibraryScreen from '../screens/mylibrary/MyLibraryScreen';
import MyStatusScreen from '../screens/mystatus/MyStatusScreen';
import FollowStoryList from '../screens/mystatus/FollowStoryList';
import SplashScreen from '../screens/SplashScreen';
import StartScreen from '../screens/StartScreen';

const Tab = createBottomTabNavigator();
const HomeStack = createStackNavigator();
const RecommendStack = createStackNavigator();
const MyLibraryStack = createStackNavigator();
const MyStatusStack = createStackNavigator();
const RootStack = createStackNavigator();

export type RootStackParamList = {
  Home: undefined;
  RecommendScreen: undefined;
  AllStoryScreen: undefined;
  StoryDetail: { storyId: string };
  MyLibrary: undefined;
  MyInfo: undefined;
  PlayScreen: { story: { id: string; title: string; content: string }, isFromCreation: boolean };
  FollowStoryList: { nickname: string; followers: number };
};

const HomeStackScreen = () => (
  <HomeStack.Navigator screenOptions={{ headerShown: false }}>
    <HomeStack.Screen name="Home" component={HomeScreen} />
    <HomeStack.Screen name="Loading" component={LoadingScreen} />
    <HomeStack.Screen name="Create Finish" component={StoryCreateFinishScreen} />
  </HomeStack.Navigator>
);

const RecommendStackNavigator = () => (
  <RecommendStack.Navigator>
    <RecommendStack.Screen name="RecommendScreen" component={RecommendScreen} options={{ headerShown: false }} />
    <RecommendStack.Screen name="AllStoryScreen" component={AllStoryScreen} options={{ headerTitle: '전체 동화' }} />
  </RecommendStack.Navigator>
);

const MyLibraryStackScreen = () => (
  <MyLibraryStack.Navigator>
    <MyLibraryStack.Screen name="MyLibraryScreen" component={MyLibraryScreen} options={{ headerTitle: '내 도서관' }} />
  </MyLibraryStack.Navigator>
);

const MyStatusStackScreen = () => (
  <MyStatusStack.Navigator>
    <MyStatusStack.Screen name="MyStatusScreen" component={MyStatusScreen} options={{ headerTitle: '마이 페이지' }} />
    <MyStatusStack.Screen name="FollowStoryList" component={FollowStoryList} options={{ headerShown: false }} />
  </MyStatusStack.Navigator>
);

const MainTabNavigator = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      headerShown: false,
      tabBarIcon: ({ color, size }) => {
        if (route.name === 'HomeNav') {
          return <Ionicons name="home-outline" size={size} color={color} />;
        } else if (route.name === 'RecommendNav') {
          return <Ionicons name="book-outline" size={size} color={color} />;
        } else if (route.name === 'MyLibraryNav') {
          return <Ionicons name="star-outline" size={size} color={color} />;
        } else if (route.name === 'MyStatusNav') {
          return (
            <Image
              source={require('../assets/images/profileimage.png')}
              style={{ width: size, height: size, borderRadius: size / 2 }}
            />
          );
        }
      },
      tabBarActiveTintColor: '#4A90E2',
      tabBarInactiveTintColor: 'gray',
    })}
  >
    <Tab.Screen
      name="HomeNav"
      component={HomeStackScreen}
      options={{
        tabBarLabel: '홈',
      }}
      listeners={({ navigation }) => ({
        tabPress: (e) => {
          e.preventDefault();
          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{ name: 'HomeNav', params: { screen: 'Home' } }],
            })
          );
        },
      })}
    />
    <Tab.Screen
      name="RecommendNav"
      component={RecommendStackNavigator}
      options={{
        tabBarLabel: '추천 동화',
      }}
      listeners={({navigation}) => ({
        tabPress: (e) => {
          e.preventDefault();
          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{name: 'RecommendNav', params: {screen: 'RecommendScreen'}}],
            })
          )
        }
      })}
    />
    <Tab.Screen
      name="MyLibraryNav"
      component={MyLibraryStackScreen}
      options={{
        tabBarLabel: '내 도서관',
      }}
    />
    <Tab.Screen
      name="MyStatusNav"
      component={MyStatusStackScreen}
      options={{
        tabBarLabel: '내 정보',
      }}
    />
  </Tab.Navigator>
);

const AppNavigator = () => (
  <NavigationContainer>
    <RootStack.Navigator screenOptions={{ headerShown: false }}>
      <RootStack.Screen name="Splash" component={SplashScreen}/>
      <RootStack.Screen name="Start" component={StartScreen}/>
      <RootStack.Screen name="MainTabs" component={MainTabNavigator}/>
      <RootStack.Screen
        name="StoryDetail"
        component={StoryDetail}
        options={{ headerTitle: '동화 상세', presentation: 'card', }}
      />
      <RootStack.Screen
        name="PlayScreen"
        component={PlayScreen}
        options={{ headerTitle: '재생 화면', presentation: 'card', gestureEnabled: true}}
      />
    </RootStack.Navigator>
  </NavigationContainer>
);

export default AppNavigator;
