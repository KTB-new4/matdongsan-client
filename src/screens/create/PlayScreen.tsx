import React, {useEffect} from 'react';
import { View, Text, StyleSheet, BackHandler } from 'react-native';

const PlayScreen = ({navigation} : any) => {

    useEffect(() => {
        const backAction =() => {
          navigation.navigate('Create Finish');
          return true;
        };
        const backHandler = BackHandler.addEventListener(
          'hardwareBackPress',
          backAction
        );
        return () => backHandler.remove();
      },[navigation])

  return (
    <View style={styles.container}>
      <Text style={styles.text}>This is Play Screen!</Text>
      {/* 도서관에 관한 정보를 여기에 표시할 수 있습니다 */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default PlayScreen;
