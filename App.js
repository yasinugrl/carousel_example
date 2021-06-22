import React from 'react';
import { View, StatusBar } from 'react-native';
import Carousel from './src/components/Carousel'

const App = () => {
  return (
    <View style={{ flex: 1 }}>
      <StatusBar hidden />
      <Carousel />
    </View>
  );
};

export default App;

