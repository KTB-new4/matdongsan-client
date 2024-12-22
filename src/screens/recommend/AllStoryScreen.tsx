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

  const handleSortChange = (option: string) => {
    setSortOption(option);
    console.log('Sort Option Changed:', option);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.searchContainer}>
          <Icon name="magnify" size={24} color="#888" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="동화를 검색하세요"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        <View style={styles.sortContainer}>
          <TouchableOpacity onPress={() => handleSortChange('recent')}>
            <Text style={[styles.sortOption, sortOption === 'recent' && styles.activeSort]}>최신순</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleSortChange('popular')}>
            <Text style={[styles.sortOption, sortOption === 'popular' && styles.activeSort]}>인기순</Text>
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
  searchContainer: {
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
  sortContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  sortOption: {
    fontSize: 14,
    color: '#666',
  },
  activeSort: {
    color: '#6366F1',
    fontWeight: 'bold',
  },
});

export default AllStoryScreen;