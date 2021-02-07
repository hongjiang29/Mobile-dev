import React, { Component } from 'react';
import { Text, TextInput, View, Button, StyleSheet, Alert, TouchableOpacity } from 'react-native';


class App extends Component {
  constructor(props){
    super(props);

    this.state = {
      email: '',
      first_name: '',
      last_name: '',
      password: ''
    };
  }

  signup = async () => {
    const navigation = this.props.navigation;
    let first_name = this.state.first_name;
    let last_name = this.state.last_name;
    let password = this.state.password;
    let email = this.state.email;
    fetch("http://10.0.2.2:3333/api/1.0.0/user",
      {
        method: 'post',
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          first_name: first_name,
          last_name: last_name,
          password: password,
          email: email,

        }),

      })
      .then ((res) => {
        if (res.status === 201)
        {
          return res.json();
        }else if (res.status === 400){
          throw 'Validation';
        }
        else{
          throw 'failed';
        };
      })
      .then ((responseJson) => {
        console.log(responseJson);
        navigation.navigate('Login');
      })
      .catch((message) => {console.log("error" + message)})
  }

  handleFirstname = (text) => {
    this.setState({first_name: text})
  }
  handleLastname = (text) => {
    this.setState({last_name: text})
  }

  handlePassword = (text) => {
    this.setState({password: text})
  }

  handleEmail = (text) => {
    this.setState({email: text})
  }

  render() {
    return (
      <View style={styles.container}>
      <Text> First Name: </Text>
      <TextInput style={styles.inputText} placeholder="Enter First Name" onChangeText={this.handleFirstname} value={this.state.first_name} />
      <Text> Last Name: </Text>
      <TextInput style={styles.inputText} placeholder="Enter Last Name" onChangeText={this.handleLastname} value={this.state.last_name} />
      <Text> Email: </Text>
      <TextInput style={styles.inputText} placeholder="Enter Email" onChangeText={this.handleEmail} value={this.state.email} />
      <Text> Password: </Text>
      <TextInput style={styles.inputText} placeholder="Enter Password" secureTextEntry={true} onChangeText={this.handlePassword} value={this.state.password} />
      

      <TouchableOpacity style={styles.appButtonContainer} onPress={() => this.signup()}>
      
      <Text style={styles.appButtonText}> Signup </Text>
        
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
