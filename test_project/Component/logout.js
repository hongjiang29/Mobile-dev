/* eslint-disable no-undef */
import React, { Component } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Text } from 'native-base';

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
            <View style={styles.rowContainer}>
            <TouchableOpacity style={styles.appRedButtonContainer} onPress={() => this.logout()}>
              
              <Text style={styles.appButtonText}> Yes </Text>
                
              </TouchableOpacity>

              <TouchableOpacity 
              style={styles.appGreenButtonContainer} onPress={() => navigation.navigate('Home')}
              >
              <Text style={styles.appButtonText}> No </Text>
              </TouchableOpacity>
              </View>
            </View>
          );
        }
    }

    const styles = StyleSheet.create({

      rowContainer: {
        flexDirection: 'row'
      },

      appGreenButtonContainer: {
        margin: 20,
        elevation: 8,
        backgroundColor: '#009688',
        borderRadius: 10,
        paddingVertical: 10,
        paddingHorizontal: 12
        
      },

      appRedButtonContainer: {
        margin: 20,
        elevation: 8,
        backgroundColor: 'red',
        borderRadius: 10,
        paddingVertical: 10,
        paddingHorizontal: 12
        
      },
      
      appButtonText: {
        fontSize: 18,
        color: 'white',
        fontWeight: 'bold',
        alignSelf: 'center',
        textTransform: 'uppercase'
      },
      
    
    });

export default Home;
