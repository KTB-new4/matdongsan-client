import React, { useState } from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { SafeAreaView, View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import RecentlySeenStory from './RecentlySeenStory';
import LikeStory from './LikeStory';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const TopTab = createMaterialTopTabNavigator();

const MyLibraryScreen: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>(''); 

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.searchRow}>
          <View style={styles.searchContainer}>
            <Icon name="magnify" size={24} color="#888" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="동화를 검색하세요"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </View>
      </View>

      <TopTab.Navigator
        initialRouteName="RecentlySeenStory"
        screenOptions={{
          tabBarStyle: { backgroundColor: '#fff' },
          tabBarIndicatorStyle: { backgroundColor: '#6366F1', height: 3 },
          tabBarLabelStyle: { fontSize: 14, fontWeight: '600' },
        }}
      >
        <TopTab.Screen name="RecentlySeenStory" options={{ tabBarLabel: '최근 읽은' }}>
          {() => <RecentlySeenStory searchQuery={searchQuery} />}
        </TopTab.Screen>
        <TopTab.Screen name="LikeStory" options={{ tabBarLabel: '좋아요' }}>
          {() => <LikeStory searchQuery={searchQuery} />}
        </TopTab.Screen>
      </TopTab.Navigator>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FF',
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    elevation: 2,
    zIndex: 1,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#333',
  },
});

export default MyLibraryScreen;

