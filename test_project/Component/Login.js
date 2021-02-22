import React, { Component } from 'react';
import { TextInput, View, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { Container, Form, Content, Card, CardItem, Input, Text, Header, Title, Left, Body, Right, Item } from 'native-base';
import AsyncStorage from '@react-native-async-storage/async-storage';


class App extends Component {
  constructor(props){
    super(props);

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
    })
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  checkLoggedIn = async () => {
    const value = await AsyncStorage.getItem('token');
    if (value != null) {
      this.props.navigation.reset({routes: [{name : 'Home'}]});
    }
  }

  login = async () => {
    let email = this.state.email;
    let password = this.state.password;

    if (email.length == 0 || password.length == 0){
      this.setState({errorLength: 'At least one of the fields are empty, check all fields',
                     isNull: false})
      return false
    }
  
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
          this.setState({errorLength:'Cannot find account, please check your details'})
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

  handleEmail = (text) => {
    this.setState({isNull:false,
                  email: text})
  }

  handlePassword = (text) => {
    this.setState({isNull:false,
                  password: text})
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
			this.props.navigation.reset({routes: [{name : 'Home'}]});
		}
		catch (e)
		{
			console.log("DEBUG: Failed to store id and token: " + e);
		}
	}

  render() {
    const navigation = this.props.navigation;
    const handleEmail = (val) => {
      const expression = /(?!.*\.{2})^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([\t]*\r\n)?[\t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([\t]*\r\n)?[\t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;
      
      if(expression.test(String(val).toLowerCase()) || val.length == 0){
        this.setState({isValidEmail: true})
      }else {
        this.setState({errorEmail: 'Invalid email input!',
                      isValidEmail: false})
        
      }
  }
    return (
      <Container>
      <Header>
      <Title style={{fontWeight:'bold', fontSize:20, alignSelf: 'center'}}>LOGIN</Title>
      </Header>
   
      <View style={styles.container}>
      
      <Form style={{paddingLeft: 20, paddingRight:20}}>
      <Item style={{marginTop:20}}>
      <Input style={styles.inputText} placeholder="Enter email" onChangeText={this.handleEmail} value={this.state.email} onEndEditing={(e)=>handleEmail(e.nativeEvent.text)}/>
      </Item>
      {this.state.isValidEmail ? null :
      <Text style={{paddingLeft: 20, paddingRight:20, color:'red'}}>{this.state.errorEmail}</Text>}
      <Text>
      {this.state.error}
      </Text>
      <Item style={{marginTop:20}}>
      <Input style={styles.inputText} placeholder="Enter Password" secureTextEntry={true} onChangeText={this.handlePassword} value={this.state.password} />
      </Item>
      {this.state.isNull ? null :
      <Text style={{paddingLeft: 20, paddingRight:20, color:'red'}}>{this.state.errorLength}</Text>}
      <TouchableOpacity style={styles.appButtonContainer} onPress={() => this.login()}>
      
      <Text style={styles.appButtonText}> Login </Text>
        
      </TouchableOpacity>

      <TouchableOpacity style={styles.appButtonContainer} onPress={() => navigation.navigate('Signup')}>
      
      <Text style={styles.appButtonText}> Signup </Text>
        
      </TouchableOpacity>
  
      </Form>

      </View>

      </Container>
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
    marginTop:20,
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
