// Common imports to allow packages
import 'react-native-gesture-handler';
import React, { Component } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import Ionicons from 'react-native-vector-icons/Ionicons';

// Screen imports
import Login from './Component/Login';
import Home from './Component/Home';
import Signup from './Component/signup';
import Logout from './Component/logout';
import Account from './Component/updateAccount';
import Reviews from './Component/reviews';
import AddReview from './Component/add_review';
import EditReview from './Component/edit_review';
import Search from './Component/search_location';

// initialising navigator
const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

class App extends Component {
  render() {
    return (
        // main pages to initiate
        <NavigationContainer>
            
        <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={HomeLogstack} />
        <Stack.Screen name="Search" component={Search} />
        <Stack.Screen name="Review" component={Reviews} />
        <Stack.Screen name="AddReview" component={AddReview} />
        <Stack.Screen name="EditReview" component={EditReview} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Signup" component={Signup} />
        </Stack.Navigator>
        </NavigationContainer>
        );  
    }
}   
    // tab navigator to allow the user to have easy access from important pages
    function HomeLogstack() {
        return (
            <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;

                    if (route.name === 'Home') {
                        iconName = focused ? 'home' : 'home-outline';
                    } else if (route.name === 'Logout') {
                        iconName = focused ? 'exit' : 'exit-outline';
                    } else if (route.name === 'Account') {
                        iconName = focused ? 'person' : 'person-outline';
                } else if (route.name === 'Search') {
                    iconName = focused ? 'search' : 'search-outline';
                }
                return <Ionicons name={iconName} size={size} color={color} />;
                },
            })}
            tabBarOptions={{
                activeTintColor: 'tomato',
                inactiveTintColor: 'grey',
                showIcon: true
            }}
            >
            <Tab.Screen name="Home" component={Home} />
            <Tab.Screen name="Search" component={Search} />
            <Tab.Screen name="Account" component={Account} />
            <Tab.Screen name="Logout" component={Logout} />
            </Tab.Navigator>
        );
    }

export default App;
