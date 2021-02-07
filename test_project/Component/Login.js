import React, { Component } from 'react';
import { Text, TextInput, View, Button, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

class App extends Component {
  constructor(props){
    super(props);

    this.state = {
      username: '',
      password: ''
    };
  }

  login = async () => {
    let email = this.state.username;
    let password = this.state.password;
    const navigation = this.props.navigation;
    fetch("http://10.0.2.2:3333/api/1.0.0/user/login",
      {
        method: 'post',
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: email,
          password: password

        }),

      })
      .then ((res) => {
        if (res.status === 200)
        {
          return res.json();
        }else if (res.status === 400){
          throw 'Validation';
        }
        else{
          throw 'failed';
        };
      })
      .then (async(responseJson) => {
        console.log(responseJson);
        await AsyncStorage.setItem('@session_token', responseJson.token);
        navigation.navigate('Home');
      })
      .catch((message) => {console})
}

  handleUsername = (text) => {
    this.setState({username: text})
  }

  handlePassword = (text) => {
    this.setState({password: text})
  }

  render() {
    const navigation = this.props.navigation;
    return (
      <View style={styles.container}>
      <Text> Username: </Text>
      <TextInput style={styles.inputText} placeholder="Enter Username" onChangeText={this.handleUsername} value={this.state.username} />
      <Text> Password: </Text>
      <TextInput style={styles.inputText} placeholder="Enter Password" secureTextEntry={true} onChangeText={this.handlePassword} value={this.state.password} />

      <TouchableOpacity style={styles.appButtonContainer} onPress={() => this.login()}>
      
      <Text style={styles.appButtonText}> Login </Text>
        
      </TouchableOpacity>
      <Button
                title="Signup"
                onPress={() => navigation.navigate('Signup')}/>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 3,
    padding: 24,
  },
  appButtonContainer: {
    elevation: 8,
    backgroundColor: "#009688",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12
  },
  appButtonText: {
    fontSize: 18,
    color: "white",
    fontWeight: "bold",
    alignSelf: "center",
    textTransform: "uppercase"
  },
  

});

export default App
