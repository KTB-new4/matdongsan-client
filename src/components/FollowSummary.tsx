import React from 'react';
import { View, Text, StyleSheet, Image, ViewStyle, TouchableOpacity } from 'react-native';

// 로컬 이미지 경로 (기본 이미지)
const placeholderImage = require('../assets/images/profileimage.png');

type FollowSummaryProps = {
  nickname: string;
  profileImage?: string; // 프로필 이미지 URL
  followers: number;
  containerStyle?: ViewStyle;
  onPress: () => void;
};

const FollowSummary: React.FC<FollowSummaryProps> = ({
  nickname = 'Unknown',
  profileImage,
  followers = 0,
  containerStyle,
  onPress,
}) => {
  return (
    <TouchableOpacity style={[styles.container, containerStyle]} onPress={onPress}>
      {/* profileImage 값이 있으면 해당 URL 사용, 없으면 기본 이미지 사용 */}
      <Image
        source={profileImage ? { uri: profileImage } : placeholderImage}
        style={styles.image}
        defaultSource={placeholderImage} // 로드 중일 때 기본 이미지 표시
      />
      <Text style={styles.nickname}>{nickname}</Text>
      <View style={styles.likesContainer}>
        <Text style={styles.likeIcon}>❤️</Text>
        <Text style={styles.followers}>{followers.toLocaleString()}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    margin: 10,
    width: 90,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#ccc',
  },
  nickname: {
    marginTop: 5,
    fontSize: 12,
    textAlign: 'center',
  },
  likesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  likeIcon: {
    color: 'red',
    marginRight: 4,
    fontSize: 14,
  },
  followers: {
    fontSize: 12,
    color: '#333',
  },
});

export default FollowSummary;