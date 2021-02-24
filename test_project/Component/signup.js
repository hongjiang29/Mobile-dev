import React, { Component } from 'react';
import { TextInput, View, StyleSheet, Alert, TouchableOpacity, Image } from 'react-native';
import { Container, Form, Header, Title, CardItem, Input, Text, Button, Icon, Left, Body, Right, Item } from 'native-base';


class App extends Component {
  constructor(props){
    super(props);

    this.state = {
      email: '',
      first_name: '',
      last_name: '',
      password: '',
      errorPassword: '',
      errorEmail: '',
      errorLength: '',
      isValidEmail: true,
      isValidPassword: true,
      isNull: true

    };
  }

  signup = async () => {
    const navigation = this.props.navigation;
    let {first_name, last_name, password, email} = this.state;
    if (first_name.length == 0 || last_name.length == 0 || password.length == 0 || email.length == 0){
      this.setState({errorLength: 'At least one of the fields are empty, check all fields',
                     isNull: false})
      return false
    }
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
          this.setState({errorLength:'User already exists!',
                         isNull: false})
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
    this.setState({isNull: true,
                   first_name: text})
  }
  handleLastname = (text) => {
    this.setState({isNull: true,
                  last_name: text})
  }

  handlePassword = (text) => {
    if (text.length <  5 && text.length >  0){
      this.setState({isNull: true,
                    errorPassword: 'Password must be more than 5 charaters long!',
                    isValidPassword: false})
    }
     else{
      this.setState({isNull: true,
                    isValidPassword: true})
    }
    this.setState({isNull: true,
                   password: text})
  }

  handleEmail = (text) => {
    this.setState({isNull: true,
                  email: text})
  }


  render() {
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
        <Left>
            <Button transparent onPress={() => this.props.navigation.goBack()}>
              <Icon name='arrow-back' />
            </Button>
          </Left>
          <Body>
        <Title style={{fontWeight:'bold', fontSize:20}}>Signup</Title>
        </Body>
        <Right></Right>
        </Header>
      
      <View  style={{alignItems: 'center', margin:20}}>

      <Image source={require('../assets/sign-up.png')}
      style={{width:150, height:170}}/>

      </View>

      <View style={styles.container}>

      <Form style={{paddingLeft: 20, paddingRight:20}}>
      <Item rounded style={{marginTop:20}}>
      
      <Input style={styles.inputText} placeholder="Enter First Name" onChangeText={this.handleFirstname} value={this.state.first_name} />
      </Item>
      <Item rounded style={{marginTop:20}}>

      <Input style={styles.inputText} placeholder="Enter Last Name" onChangeText={this.handleLastname} value={this.state.last_name} />
      </Item>
      <Item rounded style={{marginTop:20}}>

      <Input style={styles.inputText} placeholder="Enter Email" onChangeText={this.handleEmail} value={this.state.email} onEndEditing={(e)=>handleEmail(e.nativeEvent.text)} />
      </Item>
      {this.state.isValidEmail ? null :
      <Text style={{paddingLeft: 20, paddingRight:20, color:'red'}}>{this.state.errorEmail}</Text>}
      <Item rounded style={{marginTop:20}}>
      <Input style={styles.inputText} placeholder="Enter Password" secureTextEntry={true} onChangeText={this.handlePassword} value={this.state.password} />
      </Item>
      {this.state.isValidPassword ? null :
      <Text style={{paddingLeft: 20, paddingRight:20, color:'red'}}>{this.state.errorPassword}</Text>}
      {this.state.isNull ? null :
      <Text style={{paddingLeft: 20, paddingRight:20, color:'red'}}>{this.state.errorLength}</Text>}

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
