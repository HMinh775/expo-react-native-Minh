import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import BookingScreen from '../(tabs)/BookingScreen';
import HomeScreen from '../(tabs)/HomeScreen';
import MovieDetailScreen from '../(tabs)/MovieDetailScreen';
import ProfileScreen from '../(tabs)/ProfileScreen';

export type RootStackParamList = {
  Home: undefined;
  MovieDetail: { movieId: string };
  Booking: { movieId: string; showtimeId: string };
  Profile: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#FF6B6B',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen 
          name="Home" 
          component={HomeScreen}
          options={{ title: 'Rạp phim Online' }}
        />
        <Stack.Screen 
          name="MovieDetail" 
          component={MovieDetailScreen}
          options={{ title: 'Chi tiết phim' }}
        />
        <Stack.Screen 
          name="Booking" 
          component={BookingScreen}
          options={{ title: 'Đặt vé' }}
        />
        <Stack.Screen 
          name="Profile" 
          component={ProfileScreen}
          options={{ title: 'Tài khoản' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;