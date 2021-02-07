import 'react-native-gesture-handler'

import React, { Component } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs'

import Ionicons from 'react-native-vector-icons/Ionicons'

import Login from './Component/Login'
import Contact from './Component/contact'
import Home from './Component/home_with_buttons'

const Tab = createBottomTabNavigator();

class App extends Component{
  render(){
    return (
        <NavigationContainer>
            <Tab.Navigator
                screenOptions={({ route }) => ({
                    tabBarIcon: ({ focused, color, size}) => {
                        let iconName;

                        if (route.name === 'Home') {
                            iconName = focused ? 'home' : 'home-outline';
                        } else if (route.name === 'Login') {
                            iconName = focused ? 'person' : 'person-outline';
                        }else if (route.name === 'Contact') {
                            iconName = focused ? 'send' : 'send-outline';
                    }
                    return <Ionicons name={iconName} size={size} color={color} />
                    },
                })}
                tabBarOptions={{
                    activeTintColor: 'tomato',
                    inactiveTintColor: 'grey'

                }}
                >
                <Tab.Screen name="Home" component={Home} />
                <Tab.Screen name="Contact" component={Contact} />
                <Tab.Screen name="Login" component={Login} />
                </Tab.Navigator>
        </NavigationContainer>
    );
    
    }
}

export default App;