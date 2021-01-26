import React, { Component } from 'react';
import { Text, TextInput, View, Button, StyleSheet, Alert, TouchableOpacity } from 'react-native';

class App extends Component {
  constructor(props){
    super(props);

    this.state = {
      username: '',
      password: ''
    };
  }

  login() {
    let username = this.state.username;
    let password = this.state.password;
    Alert.alert("Login details" ,`Username: ${username} \nPassword: ${password}`);
  }

  handleUsername = (text) => {
    this.setState({username: text})
  }

  handlePassword = (text) => {
    this.setState({password: text})
  }

  render() {
    return (
      <View style={styles.container}>
      <Text> Username: </Text>
      <TextInput style={styles.inputText} placeholder="Enter Username" onChangeText={this.handleUsername} value={this.state.username} />
      <Text> Password: </Text>
      <TextInput style={styles.inputText} placeholder="Enter Password" secureTextEntry={true} onChangeText={this.handlePassword} value={this.state.password} />

      <TouchableOpacity style={styles.appButtonContainer} onPress={() => this.login()}>
      
      <Text style={styles.appButtonText}> Login </Text>
        
      </TouchableOpacity>
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
