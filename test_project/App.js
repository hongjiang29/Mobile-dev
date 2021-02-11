import React, { Component } from 'react';

import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import {createDrawerNavigator} from '@react-navigation/drawer';

import Login from './Component/Login'
import Contact from './Component/contact'
import Home from './Component/home_with_buttons'
import Signup from './Component/signup'
import Logout from './Component/logout'


const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

export default function Root()
  {
  return (
    <NavigationContainer>
      <Drawer.Navigator initialRouteName="Home">
      <Drawer.Screen name="Home" component={Home} />
      <Drawer.Screen name="Contact" component={Contact} />
      <Drawer.Screen name="Login" component={Login} />
      <Drawer.Screen name="Signup" component={Signup} />
      <Drawer.Screen name="Logout" component={LogStack} options={{gestureEnabled: false}} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
  
}

function SearchUserStack()
{
	return(
		<Stack.Navigator initialRouteName="UserSearchPage">
			<Stack.Screen
				name = "UserSearchPage"
				options={{title: "Search Users Page"}}
				component={UserSearchPage}/>
			<Stack.Screen
				name = "UsersPage"
				options={{title: "UsersPage"}}
				component={UsersPage}/>
			<Stack.Screen
				name = "Followers"
				options={{title: "FollowersPage"}}
				component={FollowersPage}/>
			<Stack.Screen
				name = "Following"
				options={{title: "Following Page"}}
				component={FollowingPage}/>
		</Stack.Navigator>
	);
}

function AccountStack()
{
	return(
		<Stack.Navigator initialRouteName="AccountPage">
			<Stack.Screen
				name = "AccountPage"
				options={{title: "Account Page"}}
				component={AccountPage}/>
			<Stack.Screen
				name = "UpdateDetailsPage"
				options={{title: "Update Details Page"}}
				component={UpdateDetailsPage}/>
		</Stack.Navigator>
	);
}


function FollowersStack()
{
	return(
		<Stack.Navigator initialRouteName="Followers">
			<Stack.Screen
				name = "UsersPage"
				options={{title: "UsersPage"}}
				component={UsersPage}/>
			<Stack.Screen
				name = "Followers"
				options={{title: "FollowersPage"}}
				component={FollowersPage}/>
		</Stack.Navigator>
	);
}

function FollowingStack()
{
	return(
		<Stack.Navigator initialRouteName="Following">
			<Stack.Screen
				name = "UsersPage"
				options={{title: "UsersPage"}}
				component={UsersPage}/>
			<Stack.Screen
				name = "Following"
				options={{title: "Following Page"}}
				component={FollowingPage}/>
		</Stack.Navigator>
	);
}

function ChitStack()
{
	return(
		<Stack.Navigator initialRouteName="ChitsPage">
			<Stack.Screen
				name = "ChitsPage"
				options={{title: "Chits Page"}}
				component={ChitsPage}/>
			<Stack.Screen
				name = "PostChitPage"
				options={{title: "Post Chit Page"}}
				component={PostChitPage}/>
			<Stack.Screen
				name = "CameraPage"
				options={{title: "Camera Page"}}
				component={CameraPage}/>
		</Stack.Navigator>
	);
}

function LogStack()
{
	return(
		<Stack.Navigator initialRouteName="Logout">
			<Stack.Screen
				name = "LoginPage"
				options={{title: "Login Page"}}
				component={Login}/>
			<Stack.Screen
				name = "Logout"
				options={{title: "Logout"}}
				component={Logout}/>
			<Stack.Screen
				name = "RegisterPage"
				options={{title: "Registration Page"}}
				component={Signup}/>
		</Stack.Navigator>
	);

}
