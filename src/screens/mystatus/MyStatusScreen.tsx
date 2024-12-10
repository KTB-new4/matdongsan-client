import React , { useState, useEffect }from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import FollowList from './FollowList';
import ChildrenStatus from './ChildrenStatus';
import { getServerTokens } from '../../api/serverTokenManager';
import { getRequest } from '../../api/apiManager';

const Tab = createMaterialTopTabNavigator();

const MyProfileScreen = () => {
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [nickName, setNickName] = useState<string | null>(null);

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
          setNickName(response.nickname);
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
    <SafeAreaView style={styles.container}>
      {/* 사용자 정보 섹션 */}
      <View style={styles.profileContainer}>
        {/* 프로필 이미지 */}
        <Image
          style={styles.profileImage}
          source={
            profileImage
              ? { uri: profileImage }
              : require('../../assets/images/profileimage.png') // 기본 이미지
          }
        />
        <View style={styles.userInfo}>
          <Text style={styles.username}>{nickName}</Text>
          <TouchableOpacity style={styles.changeButton}>
            <Text style={styles.changeButtonText}>변경</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 탭 네비게이션 */}
      <View style={styles.tabContainer}>
        <Tab.Navigator
          screenOptions={{
            tabBarLabelStyle: { fontSize: 14, fontWeight: 'bold' },
            tabBarIndicatorStyle: { backgroundColor: 'red' },
            tabBarActiveTintColor: 'red',
            tabBarInactiveTintColor: 'black',
          }}
        >
          {/* FollowList 화면 */}
          <Tab.Screen
            name="Follow"
            component={FollowList}
            options={{ tabBarLabel: '팔로우' }}
          />
          {/* ChildrenStatus 화면 */}
          <Tab.Screen
            name="ChildInfo"
            component={ChildrenStatus}
            options={{ tabBarLabel: '자녀정보' }}
          />
        </Tab.Navigator>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f8f8f8',
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#ccc',
  },
  userInfo: {
    marginLeft: 15,
  },
  username: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  changeButton: {
    marginTop: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: '#ddd',
    borderRadius: 5,
  },
  changeButtonText: {
    fontSize: 14,
    color: '#333',
  },
  tabContainer: {
    flex: 1,
    marginTop: 10,
  },
});

export default MyProfileScreen;