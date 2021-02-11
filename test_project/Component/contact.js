
import React, { Component } from 'react';
import { View, Text, Button, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BackHandler } from 'react-native';

class Home extends Component{
  constructor(props){
    super(props);

    // the components state
    this.state = {
      token: '',
      id: '',
      error: ''
    };
  }

  componentDidMount() {
    this.unsubscribe = this.props.navigation.addListener('focus', () => {
      this.checkLoggedIn();
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  checkLoggedIn = async () => {
    const value = await AsyncStorage.getItem('token');
    if (value == null) {
      this.props.navigation.navigate('Login')
    }
  }

  async getId()
	{
		try
		{
			const id = await AsyncStorage.getItem('id');
			console.log("DEBUG: userId found: " + id);
			return id + "" ;
		}
		catch (e)
		{
			console.log("DEBUG: Failed to get userId: " + e);
			this.props.navigation.navigate('Logout');
		}
	}

    render(){
        return (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
              <Text>Accounts </Text>
              <Button
                title="Update"
                onPress={() => this.props.navigation.navigate('Update')}/>   
              <Button
                title="Logout"
                onPress={() => this.props.navigation.navigate('Logout')}/>   
            </View>
          );
        }
      }

export default Home