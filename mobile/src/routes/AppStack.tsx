import React from 'react';

import { NavigationContainer } from "@react-navigation/native";

import { createStackNavigator } from "@react-navigation/stack";

import { Main } from '../pages/Main';
import { Profile } from '../pages/Profile';

const { Navigator, Screen } = createStackNavigator();

export function AppStack() {
  return (
    <NavigationContainer>
      <Navigator 
        screenOptions={{
          headerStyle: {
            backgroundColor: '#7d40e7',
          },
          headerTintColor: '#ffffff',
          headerBackTitleVisible: false,
        }}
      >
        <Screen 
          name="Main" 
          component={Main} 
          options={{
            title: 'DevRadar'
          }} 
        />
        <Screen 
          name="Profile" 
          component={Profile} 
          options={{
            title: 'Perfil no GitHub'
          }} 
        />
      </Navigator>
    </NavigationContainer>
  );
}