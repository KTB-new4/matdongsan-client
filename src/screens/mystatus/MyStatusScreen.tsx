import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, SafeAreaView } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import FollowList from './FollowList';
import ChildrenStatus from './ChildrenStatus';

const profileImage = require('../../assets/images/profileimage.png');

const Tab = createMaterialTopTabNavigator();

const MyProfileScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      {/* 사용자 정보 섹션 */}
      <View style={styles.profileContainer}>
        <Image style={styles.profileImage} source={profileImage} />
        <View style={styles.userInfo}>
          <Text style={styles.username}>저쪽이</Text>
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
          <Tab.Screen name="Follow" component={FollowList} options={{ tabBarLabel: '팔로우' }} />
          <Tab.Screen name="ChildInfo" component={ChildrenStatus} options={{ tabBarLabel: '자녀정보' }} />
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
