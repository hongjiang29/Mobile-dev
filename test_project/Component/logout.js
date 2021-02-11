import React, { Component } from 'react';
import { View, Text, Button, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

class Home extends Component{


  async getToken()
	{
		try
		{
			const token = await AsyncStorage.getItem('token');
			console.log("DEBUG: token found: " + token);
			return token;
		}
		catch (e)
		{
			console.log("DEBUG: Failed to get id: " + e);
			this.props.navigation.navigate('Login');
		}
	}

  async deleteDetails()
	{
		try
		{
			await AsyncStorage.removeItem('token');
			await AsyncStorage.removeItem('id');
		}
		catch(error)
		{
			console.log("DEBUG: Deleting token and id");
		}
	}

  logout = async () => {
    let Token = await this.getToken();
    console.log(Token);
    fetch("http://10.0.2.2:3333/api/1.0.0/user/logout",
    {
      method: 'post',
      headers: {
        'X-Authorization' : Token
      },
    })
    .then ((res) => {
      if (res.status === 200)
      {
        this.deleteDetails()
        this.props.navigation.navigate('Home');
        return;
      }else if (res.status === 400){
        throw 'Validation';
      }
      else{
        Alert.alert('You are not logged in yet!')
			  this.props.navigation.navigate('Login');
        throw 'failed';
      };
    })
    .catch((message) => {console.log("error " + message)})
}
    


    render(){
        const navigation = this.props.navigation;
        return (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
              <Text>Do you really want to log out?</Text>
              <Button
                title="Yes"
                onPress={() => this.logout()}/>   

                <Button
                title="No"
                onPress={() => navigation.navigate('Home')}/> 
            </View>
            

          );
        }
    }

export default Home