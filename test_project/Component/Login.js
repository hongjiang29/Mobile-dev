import React, { Component } from 'react';
import { TextInput, View, StyleSheet, Dimensions, TouchableOpacity, Image, ImageBackground} from 'react-native';
import { Container, Form, Content, Card, CardItem, Input, Text, Header, Title, Left, Body, Right, Item} from 'native-base';
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
          this.setState({isNull:false,
                         errorLength:'Cannot find account, please check your details'})
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
    this.setState({isNull:true,
                  email: text})
  }

  handlePassword = (text) => {
    this.setState({isNull:true,
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

    color= () =>{
      if (isNull == false){
        return 'black'
      }

    }

  render() {
    const navigation = this.props.navigation;
    return (
      <Container>

      <ImageBackground source={require('../assets/background.jpg')} style={styles.backgroundImage}>
      <View  style={{alignItems: 'center', margin:20}}>

      <Image source={require('../assets/login.png')}
      style={{width:150, height:170}}/>

      </View>
      <Form style={{paddingLeft: 20, paddingRight:20}}>
      <Item rounded style={{marginTop:20, backgroundColor: 'white'}}>
      <Input placeholder="Enter Email" onChangeText={this.handleEmail} value={this.state.email}/>
      </Item>
      <Item rounded style={{marginTop:20, backgroundColor: 'white'}}>
      <Input placeholder="Enter Password" secureTextEntry={true} onChangeText={this.handlePassword} value={this.state.password} />
      </Item>

      {this.state.isNull ? null :
      <Text style={{paddingLeft: 20, paddingRight:20, color:'red'}}>{this.state.errorLength}</Text>
      }
      
      <TouchableOpacity style={styles.appButtonContainer} onPress={() => this.login()}>
      
      <Text style={styles.appButtonText}> Login </Text>
        
      </TouchableOpacity>

      <TouchableOpacity style={styles.appButtonContainer} onPress={() => navigation.navigate('Signup')}>
      
      <Text style={styles.appButtonText}> Signup </Text>
        
      </TouchableOpacity>
  
      </Form>
      </ImageBackground>
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
  container: {
    flex: 1,
},
backgroundImage: {
    flex: 1,
    resizeMode: 'cover', // or 'stretch'
    position: 'absolute',
    left: 0,
    top: 0,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
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
