/* eslint-disable global-require */
/* eslint-disable no-undef */
// Imports all the packages needed
import React, { Component } from 'react';
import { View, TouchableOpacity, Image, ImageBackground } 
from 'react-native';
import { Container, Form, Input, Text, Item } from 'native-base';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { login, main } from '../css/styles';


class App extends Component {
  constructor(props) {
    super(props);
    // state variables initialised 
    this.state = {
      email: '',
      password: '',
      error: '',
      errorEmail: '',
      errorLength: '',
      isValidEmail: true
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

  // Api call to log the user in, added validation to help the user  
  login = async () => {
    const { email, password } = this.state;

    if (email.length === 0 || password.length === 0) {
      this.setState({ errorLength: 'At least one of the fields are empty, check all fields',
                     isNull: false });
      return false;
    }
    fetch('http://10.0.2.2:3333/api/1.0.0/user/login',
      {
        method: 'post',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email,
          password
        }),
      })
      .then((res) => {
        if (res.status === 200) {
          return res.json();
        } else if (res.status === 400) {
          this.setState({ isNull: false,
                         errorLength: 'Cannot find account, please check your details' });
          throw Error;
        } else {
          throw Error;
        }
      })
      .then(async (responseJson) => {
        const idRequest = responseJson.id;
        const tokenRequest = responseJson.token;

        console.log(`DEBUG: id received: ${idRequest} token received ${tokenRequest}`);

        this.setState({ id: idRequest });
        this.setState({ token: tokenRequest });

        this.storeLogin().then();
        }).catch((message) => { console.log(`error ${message}`); });
}
  // Recievieving string from input box to get current value from user 
  handleEmail = (text) => {
    this.setState({ isNull: true,
                  email: text });
  }

  handlePassword = (text) => {
    this.setState({ isNull: true,
                  password: text });
  }

  checkLoggedIn = async () => {
    const value = await AsyncStorage.getItem('token');
    if (value != null) {
      this.props.navigation.reset({ routes: [{ name: 'Home' }] });
    }
  }
  // storing the login details for async calls for future api calls
  async storeLogin() {
    try {
			const id = this.state.id;
			const token = this.state.token;

			console.log(`DEBUG: Storing ID: ${id} Storing token: ${token}`);

			await AsyncStorage.setItem('id', JSON.stringify(id));
			await AsyncStorage.setItem('token', token);

			console.log('DEBUG: Success');
			this.props.navigation.reset({ routes: [{ name: 'Home' }] });
		} catch (e) {
			console.log(`DEBUG: Failed to store id and token: ${e}`);
		}
	}
  // here is where all the magic happens
  render() {
    const navigation = this.props.navigation;
    return (
      <Container>
      <ImageBackground source={require('../assets/background.jpg')} style={login.backgroundImage}>
      <View style={{ alignItems: 'center', margin: 20 }}>

      <Image 
      source={require('../assets/login.png')}
      style={{ width: 150, height: 170 }}
      />

      </View>
      <Form style={{ paddingLeft: 20, paddingRight: 20 }}>
      <Item rounded style={{ marginTop: 20, backgroundColor: 'white' }}>
      <Input 
      accessibilityLabel='Please insert your Email' placeholder="Enter Email" 
      onChangeText={this.handleEmail} value={this.state.email} 
      />
      </Item>
      <Item rounded style={{ marginTop: 20, backgroundColor: 'white' }}>
      <Input 
      accessibilityLabel='Please insert your Password' placeholder="Enter Password" secureTextEntry 
      onChangeText={this.handlePassword} value={this.state.password} 
      />
      </Item>

      {this.state.isNull ? null :
      <Text 
      style={{ 
        paddingLeft: 20, 
        paddingRight: 20, 
        fontWeight: 'bold', 
        fontSize: 18, 
        color: 'red' }}
      >
      {this.state.errorLength}</Text>
      } 
      <TouchableOpacity 
      accessible style={login.appButtonContainer} onPress={() => this.login()} 
      >
      
      <Text style={main.appButtonText}> Login </Text>
        
      </TouchableOpacity>

      <TouchableOpacity 
      accessible style={login.appButtonContainer} onPress={() => navigation.navigate('Signup')} 
      >
      <Text style={main.appButtonText}> Signup </Text>
      </TouchableOpacity>
      </Form>
      </ImageBackground>
      </Container>
    );
  }
}

export default App;

