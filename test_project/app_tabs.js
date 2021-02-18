import 'react-native-gesture-handler'

import React, { Component, Button } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs'

import Ionicons from 'react-native-vector-icons/Ionicons'

import Login from './Component/Login'
import Contact from './Component/contact'
import Home from './Component/Home'
import Signup from './Component/signup'
import Logout from './Component/logout'
import HomeScreen from './Component/home_with_buttons'
import UpdateAccount from './Component/updateAccount'
import Reviews from './Component/reviews'
import AddReview from './Component/add_review'
import { Alert } from 'react-native';


const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();
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
                    inactiveTintColor: 'grey',
                    showIcon: true
                }}
                >
                <Tab.Screen name="Home" component={HomeLogstack} />
                <Tab.Screen name="Contact" component={LogStack} />
                <Tab.Screen name="Login" component={Logins} />
                </Tab.Navigator>
                </NavigationContainer>
        )
        
    }
}
    function HomeLogstack(){
        return(
        <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Review" component={Reviews}
         />
        <Stack.Screen name="AddReview" component={AddReview} />
        </Stack.Navigator>
        )
    }

    function LogStack(){
        return(
        <Stack.Navigator  initialRouteName="Contact">
        <Stack.Screen name="Contact" component={Contact} />
        <Stack.Screen name="HomeScreen"  component={HomeScreen} />
        <Stack.Screen name="Logout" component={Logout} />
        <Stack.Screen name="Update" component={UpdateAccount} />
        </Stack.Navigator>
        )
    }
    function Logins(){
        return(
        <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Signup" component={Signup} />
        </Stack.Navigator>
        )

    }

export default App;