import React, { Component } from 'react';
import { Text, View, StyleSheet, TextInput, Alert, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';


class updateAccount extends Component {
  constructor(props) {
    super(props);
    this.state = {
        first_name: '',
        last_name: '',
        Newemail: '',
        Newpassword: ''
  }
}

  editAccount = async () => {
    const userId = await AsyncStorage.getItem('id');
    const token = await AsyncStorage.getItem('token');
    try{
      fetch("http://10.0.2.2:3333/api/1.0.0/user/"+userId,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'X-Authorization': token
        },
        body: JSON.stringify({
          first_name: this.state.first_name,
          last_name: this.state.last_name,
          email: this.state.Newemail,
          password: this.state.Newpassword
        })
        })
        .then ((res) => {
            if (res.status === 200)
            {
              this.props.navigation.navigate('Contact', { screen: 'Contact' });
            }else if (res.status === 400){
              throw 'Validation';
            }
            else{
              throw 'failed';
            };
          })
      }
      
    catch (error) {
        console.error(error);
      }
}

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.TitleText}> Edit my acount: </Text>
        <TextInput style={styles.ListText}
          underlineColorAndroid="transparent"
          placeholder="Enter your new given name here"
          autoCapitalize="none"
          onChangeText={text => this.setState({ first_name: text })}
        />

        <TextInput style={styles.ListText}
          underlineColorAndroid="transparent"
          placeholder="Enter your last name here"
          autoCapitalize="none"
          onChangeText={text => this.setState({ last_name: text })}
        />

        <TextInput style={styles.ListText}
          underlineColorAndroid="transparent"
          placeholder="Enter your new email here"
          autoCapitalize="none"
          onChangeText={text => this.setState({ Newemail: text })}
        />

        <TextInput style={styles.ListText}
          underlineColorAndroid="transparent"
          placeholder="Enter your new password here"
          autoCapitalize="none"
          secureTextEntry={true}
          onChangeText={text => this.setState({ Newpassword: text })}
        />

        <TouchableOpacity
          style={styles.Button}
          onPress=
          {
            () => this.editAccount()
          }>
          <Text style={styles.ButtonText}> Edit </Text>

        </TouchableOpacity>
      </View>
    );
  }
}



export default updateAccount

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#FFFFFF'
  },

  ButtonText: {
    color: 'white',
    fontSize: 28,
    fontWeight: 'bold'
  },

  TitleText: {
    color: 'black',
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: "center",
    margin: 15
  },

  ListText: {
    color: 'black',
    borderRadius: 15,
    fontSize: 18,
    textAlign: "center",
    backgroundColor: "#F5F5F5",
    alignItems: 'center',
    margin: 10,
    borderColor: 'black',
    borderWidth: 2,
  },

  Button: {
    backgroundColor: '#233947',
    padding: 5,
    borderRadius: 15,
    alignItems: 'center',
    margin: 15,
    height: 50,
  },
});