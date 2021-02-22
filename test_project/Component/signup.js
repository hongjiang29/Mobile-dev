import React, { Component } from 'react';
import { TextInput, View, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { Container, Form, Content, Card, CardItem, Input, Text, Button, Icon, Left, Body, Right, Item } from 'native-base';


class App extends Component {
  constructor(props){
    super(props);

    this.state = {
      email: '',
      first_name: '',
      last_name: '',
      password: '',
      isValidEmail: true,
      isValidPassword: true,

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
    if (text.length <  5 && text.length >  0){
      this.setState({isValidEmail: false})
    }
     else{
      this.setState({isValidEmail: true})
    }
    this.setState({password: text})
  }

  handleEmail = (text) => {
    this.setState({email: text})
  }


  render() {
    const handleEmail = (val) => {
      
    
  }
    return (
      <Container>
      <View style={styles.container}>

      <Form style={{paddingLeft: 20, paddingRight:20}}>
      <Item style={{marginTop:20}}>
      
      <Input style={styles.inputText} placeholder="Enter First Name" onChangeText={this.handleFirstname} value={this.state.first_name} />
      </Item>
      <Item style={{marginTop:20}}>

      <Input style={styles.inputText} placeholder="Enter Last Name" onChangeText={this.handleLastname} value={this.state.last_name} />
      </Item>
      <Item style={{marginTop:20}}>

      <Input style={styles.inputText} placeholder="Enter Email" onChangeText={this.handleEmail} value={this.state.email} onEndEditing={(e)=>handleEmail(e.nativeEvent.text)} />
      </Item>
      <Item style={{marginTop:20}}>

      <Input style={styles.inputText} placeholder="Enter Password" secureTextEntry={true} onChangeText={this.handlePassword} value={this.state.password} />
      </Item>
      {this.state.isValidEmail ? null :
      <Text style={{paddingLeft: 20, paddingRight:20, color:'red'}}>Password must be more than 5 charaters long!</Text>}
      

      <TouchableOpacity style={styles.appButtonContainer} onPress={() => this.signup()}>
      
      <Text style={styles.appButtonText}> Signup </Text>
        
      </TouchableOpacity>
      </Form>
      </View>
      </Container>
    );
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
