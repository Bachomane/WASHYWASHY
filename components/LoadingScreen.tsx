import React, { useEffect } from 'react';
import { View, Image, StyleSheet, Text } from 'react-native';

const LoadingScreen = () => {
  useEffect(() => {
    console.log('LoadingScreen mounted');
  }, []);

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/images/favicon.png')}
        style={styles.logo}
        onLoad={() => console.log('Image loaded successfully')}
        onError={(error) => console.log('Image load error:', error)}
      />
      <Text style={styles.debugText}>Loading...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 9999,
  },
  logo: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
  },
  debugText: {
    color: '#FFFFFF',
    marginTop: 20,
    fontSize: 16,
  },
});

export default LoadingScreen; 