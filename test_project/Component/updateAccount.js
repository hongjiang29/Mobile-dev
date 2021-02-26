/* eslint-disable global-require */
/* eslint-disable no-useless-escape */
/* eslint-disable no-control-regex */
/* eslint-disable no-undef */
import React, { Component } from 'react';
import { View, Image, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Container, Form, Input, Text, Item, Header, Title } from 'native-base';
import { main, update } from '../css/styles';

class updateAccount extends Component {
  constructor(props) {
    super(props);
    this.state = {
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        errorPassword: '',
        errorEmail: '',
        errorLength: '',
        isValidEmail: true,
        isValidPassword: true,
        isNull: true
  };
}

  editAccount = async () => {
    const userId = await AsyncStorage.getItem('id');
    const token = await AsyncStorage.getItem('token');

    const { firstName, lastName, password, email } = this.state;
    if (firstName.length === 0 || lastName.length === 0 || password.length === 0 || 
        email.length === 0) {
      this.setState({ errorLength: 'At least one of the fields are empty, check all fields',
                     isNull: false });
      return false;
    } else if (this.state.isValidPassword === false) {
      this.setState({ errorLength: 'Check password again!',
                     isNull: false });
      return false;
    }
    try {
      fetch(`http://10.0.2.2:3333/api/1.0.0/user/${userId}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'X-Authorization': token
        },
        body: JSON.stringify({
          first_name: firstName,
          last_name: lastName,
          email,
          password
        })
        })
        .then((res) => {
            if (res.status === 200) {
              this.props.navigation.push('Home');
            } else if (res.status === 400) {
              this.setState({ errorLength: 'Some of you information is incorrect!',
                         isNull: false });
              console.log(res);
            } else {
              console.log(res);
            }
          });
        } catch (error) {
          throw error;
}
  }

handleFirstname = (text) => {
  this.setState({ isNull: true,
                 firstName: text });
}
handleLastname = (text) => {
  this.setState({ isNull: true,
                lastName: text });
}

handlePassword = (text) => {
  if (text.length < 5 && text.length > 0) {
    this.setState({ isNull: true,
                    errorPassword: 'Password must be more than 5 charaters long!',
                    isValidPassword: false });
  } else {
    this.setState({ isNull: true,
                    isValidPassword: true });
  }
  this.setState({ isNull: true,
                  password: text });
}

handleEmail = (text) => {
  this.setState({ isNull: true,
                  email: text });
}

  render() {
    const handleEmail = (val) => {
      // eslint-disable-next-line max-len
      const expression = /(?!.*\.{2})^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([\t]*\r\n)?[\t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([\t]*\r\n)?[\t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;
      
      if (expression.test(String(val).toLowerCase()) || val.length === 0) {
        this.setState({ isValidEmail: true });
      } else {
        this.setState({ errorEmail: 'Invalid email input!',
                      isValidEmail: false }); 
              } 
      };

    return (
      <Container>
      <Header>
        <Title style={main.headerText}>ACCOUNT</Title>
      </Header>
      <View style={update.container}>
      <View style={{ alignItems: 'center', margin: 20 }}>

      <Image 
        source={require('../assets/editAccount.png')}
        style={{ width: 170, height: 170 }}
      />

      </View>
      <Form style={{ paddingLeft: 20, paddingRight: 20 }}>
      
      <Item rounded style={{ marginTop: 20 }}>
        <Input
          underlineColorAndroid="transparent"
          placeholder="Enter your new given name here"
          autoCapitalize="none"
          onChangeText={this.handleFirstname} value={this.state.firstName}
        /></Item>
        
        <Item rounded style={{ marginTop: 20 }}>
        <Input
          underlineColorAndroid="transparent"
          placeholder="Enter your last name here"
          autoCapitalize="none"
          onChangeText={this.handleLastname} value={this.state.lastName}
        /></Item>

        <Item rounded style={{ marginTop: 20 }}>
        <Input
          underlineColorAndroid="transparent"
          placeholder="Enter your new email here"
          autoCapitalize="none"
          onChangeText={this.handleEmail} value={this.state.email}
          onEndEditing={(e) => handleEmail(e.nativeEvent.text)}
        /></Item>

        {this.state.isValidEmail ? null :
        <Text style={{ paddingLeft: 20, paddingRight: 20, color: 'red' }}>
                    {this.state.errorEmail}</Text>}

        <Item rounded style={{ marginTop: 20 }}>
        <Input
          underlineColorAndroid="transparent"
          placeholder="Enter your new password here"
          autoCapitalize="none"
          secureTextEntry onChangeText={this.handlePassword} value={this.state.password}
        /></Item>

        {this.state.isValidPassword ? null :
        <Text style={{ paddingLeft: 20, paddingRight: 20, color: 'red' }}>
                    {this.state.errorPassword}</Text>}

        {this.state.isNull ? null :
        <Text style={{ paddingLeft: 20, paddingRight: 20, color: 'red' }}>
                    {this.state.errorLength}</Text>}

        <TouchableOpacity
          style={main.appButtonContainer}
          onPress={() => this.editAccount()}
        >
          <Text style={main.appButtonText}> Edit </Text>
        </TouchableOpacity>
        </Form>
        </View>
      </Container>
    );
  }
}

export default updateAccount;
