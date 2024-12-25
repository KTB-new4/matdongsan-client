import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Image } from 'react-native';
import axios from 'axios';
import { setNavigation, getServerTokens } from '../api/serverTokenManager'; // 서버 토큰 관리 유틸리티

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
import { getRequest } from '../api/apiManager';
import MyPageScreen from '../screens/mystatus/MyPageScreen';

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
  StoryDetail: { storyId: string; likedStoryId?: string | null; };
  MyLibrary: undefined;
  MyStatusScreen: undefined;
  PlayScreen: { story: { 
    id: string;
    title: string;
    content: string;
    author?: string;
    coverUrl?: string;
  },
  isFromCreation: boolean,
  ttsLink: string | null,
  timestamps: number[],
};
  FollowStoryList: { nickname: string; followers: number; authorId: number; profileImage: string;};
};

// HomeStack Navigator
const HomeStackScreen = () => (
  <HomeStack.Navigator screenOptions={{ headerShown: false }}>
    <HomeStack.Screen name="Home" component={HomeScreen} />
    <HomeStack.Screen name="Loading" component={LoadingScreen} />
    <HomeStack.Screen name="Create Finish" component={StoryCreateFinishScreen} />
  </HomeStack.Navigator>
);

// RecommendStack Navigator
const RecommendStackNavigator = () => (
  <RecommendStack.Navigator>
    <RecommendStack.Screen name="RecommendScreen" component={RecommendScreen} options={{ headerShown: false }} />
    <RecommendStack.Screen name="AllStoryScreen" component={AllStoryScreen} options={{ headerTitle: '전체 동화' }} />
  </RecommendStack.Navigator>
);

// MyLibraryStack Navigator
const MyLibraryStackScreen = () => (
  <MyLibraryStack.Navigator>
    <MyLibraryStack.Screen name="MyLibraryScreen" component={MyLibraryScreen} options={{ headerTitle: '내 도서관', headerLeft: () => null}} />
  </MyLibraryStack.Navigator>
);

// MyStatusStack Navigator
const MyStatusStackScreen = () => (
  <MyStatusStack.Navigator>
    <MyStatusStack.Screen name="MyPageScreen" component={MyPageScreen} options={{ headerShown: false}} />
    <MyStatusStack.Screen name="MyStatusScreen" component={MyStatusScreen} options={{ headerTitle: '내 정보', headerBackTitle: 'Back' }} />
    <MyStatusStack.Screen name="FollowStoryList" component={FollowStoryList} options={{headerTitle: () => null, headerBackTitle: 'Back' }} />
  </MyStatusStack.Navigator>
);

// MainTabNavigator
const MainTabNavigator = () => {
  const [profileImage, setProfileImage] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfileImage = async () => {
      try {
        const tokens = await getServerTokens(); // 저장된 토큰 가져오기
        console.log('저장된 토큰 : ', tokens);
        if (tokens?.accessToken) {
          const response = await getRequest('api/members', {}, {
            accessToken: tokens.accessToken,
          });
          setProfileImage(response.profileImage); // 프로필 이미지 설정
        } else {
          console.error('토큰이 없습니다. 다시 로그인 필요');
          setProfileImage(null); // 기본 이미지 사용
        }
      } catch (error) {
        console.error('프로필 이미지 가져오기 실패:', error);
        setProfileImage(null); // 실패 시 기본 이미지 사용
      }
    };
  
    fetchProfileImage();
  }, []);

  return (
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
                source={
                  profileImage
                    ? { uri: profileImage }
                    : require('../assets/images/profileimage.png') // 기본 이미지
                }
                style={{ width: size, height: size, borderRadius: size / 2 }}
                defaultSource={require('../assets/images/profileimage.png')} // 기본 이미지 설정
              />
            );
          }
        },
        tabBarActiveTintColor: '#4A90E2',
        tabBarInactiveTintColor: 'gray',
        resetOnBlur: true,
        unmountOnBlur: true,
      })}
    >
      <Tab.Screen
        name="HomeNav"
        component={HomeStackScreen}
        options={{
          tabBarLabel: '홈',
        }}
      />
      <Tab.Screen
        name="RecommendNav"
        component={RecommendStackNavigator}
        options={{
          tabBarLabel: '추천 동화',
        }}
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
};

// AppNavigator
const AppNavigator = () => (
  <NavigationContainer>
    <RootStack.Navigator screenOptions={{ headerShown: false }}>
      <RootStack.Screen name="Splash" component={SplashScreen} />
      <RootStack.Screen name="Start" component={StartScreen} />
      <RootStack.Screen name="MainTabs" component={MainTabNavigator} />
      <RootStack.Screen
        name="StoryDetail"
        component={StoryDetail}
        options={{ headerTitle: '동화 상세', presentation: 'card' }}
      />
      <RootStack.Screen
        name="PlayScreen"
        component={PlayScreen}
        options={{ headerTitle: '재생 화면', presentation: 'card', gestureEnabled: true }}
      />
    </RootStack.Navigator>
  </NavigationContainer>
);

export default AppNavigator;

