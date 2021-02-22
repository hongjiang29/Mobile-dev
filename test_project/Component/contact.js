
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
      this.getphoto();
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

  getphoto = async () => {
    const value = await AsyncStorage.getItem('token');
    return fetch("http://10.0.2.2:3333/api/1.0.0/location/2/review/52/photo",{
      method: "GET",
      headers: {
      'X-Authorization' : value
    },
  })
      .then ((res) => {
        if (res.status === 200)
        {
          console.log(res);
        }else if (res.status === 401){
          ToastAndroid.show("Your're not logged in", ToastAndroid.SHORT)
          this.props.navigation.navigate("Login")
        }
        else{
          console.log(res);
          throw 'failed';
        }
      })
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