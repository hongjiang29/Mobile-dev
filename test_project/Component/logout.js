import React, { Component } from 'react';
import { View, Text, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

class Home extends Component{

  logout = async () => {
    let Token = await AsyncStorage.getItem('@session_token');
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
        return;
      }else if (res.status === 400){
        throw 'Validation';
      }
      else{
        throw 'failed';
      };
    })
    .then (async(responseJson) => {
      await AsyncStorage.removeItem('@session_token')
      console.log(responseJson);
      this.props.navigation.navigate('Home');
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