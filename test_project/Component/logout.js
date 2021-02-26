/* eslint-disable no-undef */
import React, { Component } from 'react';
import { View, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Text } from 'native-base';
import { logout, main } from '../css/styles';

class Home extends Component {
  async getToken() {
      try {
        const token = await AsyncStorage.getItem('token');
        console.log(`DEBUG: token found: ${token}`);
        return token;
      } catch (e) {
        console.log(`DEBUG: Failed to get id: ${e}`);
      }
    }

  async deleteDetails() {
		try {
			await AsyncStorage.removeItem('token');
			await AsyncStorage.removeItem('id');
		} catch (error) {
			console.log('DEBUG: Deleting token and id');
		}
	}

  logout = async () => {
    const Token = await this.getToken();
    console.log(Token);
    fetch('http://10.0.2.2:3333/api/1.0.0/user/logout',
    {
      method: 'post',
      headers: {
        'X-Authorization': Token
      },
    })
    .then((res) => {
      if (res.status === 200) {
        this.deleteDetails();
        this.props.navigation.navigate('Login');
      } else if (res.status === 400) {
        throw Error;
      } else {
        throw Error;
      }
    }).catch((message) => { console.log(`error ${message}`); });
}

    render() {
        const navigation = this.props.navigation;
        return (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
              <Text>Do you really want to log out?</Text>
            <View style={logout.rowContainer}>
            <TouchableOpacity 
            accessible style={logout.appRedButtonContainer} onPress={() => this.logout()}
            >
              <Text style={main.appButtonText}> Yes </Text>
                
              </TouchableOpacity>

              <TouchableOpacity 
              accessible style={logout.appGreenButtonContainer} 
              onPress={() => navigation.navigate('Home')}
              >
              <Text style={main.appButtonText}> No </Text>
              </TouchableOpacity>
              </View>
            </View>
          );
        }
    }

export default Home;
