import React, { Component } from 'react';
import { Text, TextInput, View, Button, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BackHandler } from 'react-native';

class App extends Component {
  constructor(props){
    super(props);

    this.state = {
      username: '',
      password: '',
      error: ''
    };
  }

  componentDidMount() {
    this.unsubscribe = this.props.navigation.addListener('focus', () => {
      this.checkLoggedIn();
    })
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  checkLoggedIn = async () => {
    const value = await AsyncStorage.getItem('token');
    if (value != null) {
      Alert.alert('You are already logged in!')
      this.props.navigation.navigate('Home')
    }
  }

  login = async () => {
    let email = this.state.username;
    let password = this.state.password;
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
        let idRequest = (responseJson)['id'];
        let tokenRequest = (responseJson)['token'];

        console.log("DEBUG: id received: " + idRequest +" token received " + tokenRequest);

        this.setState({id:idRequest});
        this.setState({token:tokenRequest});

        this.storeLogin().then();
        })
      .catch((message) => {console})
}

  handleUsername = (text) => {
    this.setState({username: text})
  }

  handlePassword = (text) => {
    this.setState({password: text})
  }

  async storeLogin()
	{
		try
		{
			let id = "" + this.state.id;
			let token = "" + this.state.token;

			console.log("DEBUG: Storing ID: " + id + " Storing token: " + token);

			await AsyncStorage.setItem('id', id);
			await AsyncStorage.setItem('token', token);

			console.log("DEBUG: Success");
			this.props.navigation.navigate('Home');
		}
		catch (e)
		{
			console.log("DEBUG: Failed to store id and token: " + e);
		}
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

      <TouchableOpacity style={styles.appButtonContainer} onPress={() => navigation.navigate('Signup')}>
      
      <Text style={styles.appButtonText}> Signup </Text>
        
      </TouchableOpacity>

      </View>
    );
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
    padding: 5,
    margin: 10,
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
