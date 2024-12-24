import React, { useState } from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { SafeAreaView, View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import AllStory from './allstory/AllStory';
import LevelOneStory from './allstory/LevelOneStory';
import LevelTwoStory from './allstory/LevelTwoStory';
import LevelThreeStory from './allstory/LevelThreeStory';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const TopTab = createMaterialTopTabNavigator();

const AllStoryScreen: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>(''); 
  const [sortOption, setSortOption] = useState<string>('recent'); 

  const handleSortChange = () => {
    setSortOption(sortOption === 'recent' ? 'popular' : 'recent');
  };

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
          <TouchableOpacity 
            style={styles.sortButton}
            onPress={handleSortChange}
          >
            <Text style={styles.sortButtonText}>
              {sortOption === 'recent' ? '최신순' : '인기순'}
            </Text>
            <Icon name="chevron-down" size={20} color="#6366F1" />
          </TouchableOpacity>
        </View>
      </View>

      <TopTab.Navigator
        initialRouteName="AllStory"
        screenOptions={{
          tabBarStyle: { backgroundColor: '#fff' },
          tabBarIndicatorStyle: { backgroundColor: '#6366F1', height: 3 },
          tabBarLabelStyle: { fontSize: 14, fontWeight: '600' },
        }}
      >
        <TopTab.Screen name="AllStory" options={{ tabBarLabel: '전체' }}>
          {() => <AllStory searchQuery={searchQuery} sortOption={sortOption} />}
        </TopTab.Screen>
        <TopTab.Screen name="LevelOneStory" options={{ tabBarLabel: '레벨1' }}>
          {() => <LevelOneStory searchQuery={searchQuery} sortOption={sortOption} />}
        </TopTab.Screen>
        <TopTab.Screen name="LevelTwoStory" options={{ tabBarLabel: '레벨2' }}>
          {() => <LevelTwoStory searchQuery={searchQuery} sortOption={sortOption} />}
        </TopTab.Screen>
        <TopTab.Screen name="LevelThreeStory" options={{ tabBarLabel: '레벨3' }}>
          {() => <LevelThreeStory searchQuery={searchQuery} sortOption={sortOption} />}
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
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#f1f5f9',
    gap: 4,
  },
  sortButtonText: {
    fontSize: 14,
    color: '#6366F1',
    fontWeight: '600',
  },
});

export default AllStoryScreen;

