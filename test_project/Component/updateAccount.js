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
        Newpassword: '',
        TOKEN: '',
        ID: ''
    };
  }

  componentDidMount() {
    this.getToken()
  }

  getToken = async () => {
    try {
      let token = await AsyncStorage.getItem('token');
      let id = await AsyncStorage.getItem('id');
      console.log("Token is  :", token + "     id is :" + id);
      this.setState({
        TOKEN : token,
        ID : id});   
    } catch (error) {
      console.log("GET TOKEN ERROR : " + error);
    }
  }

  async logout() {
    try {
      fetch("http://10.0.2.2:3333/api/v1.0.0/logout", 
      {
        method: 'POST',
        headers: {
          'X-Authorization': this.state.TOKEN
        },
      });
      navigation.navigate('Login')
    }
    catch (error) {
      console.error(error);
    }
  }

  editAccount = async () => {
    try{
      fetch("http://10.0.2.2:3333/api/v1.0.0/user/"+this.state.ID,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'X-Authorization': this.state.TOKEN
        },
        body: JSON.stringify({
          first_name: this.state.first_name,
          last_name: this.state.last_name,
          email: this.state.Newemail,
          password: this.state.Newpassword
        })
        })
        .then ((res) => {
            console.log(res)
            if (res.status === 200)
            {
              navigation.navigate('Contact', { screen: 'Contact' });
              return res.json();
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
        <TouchableOpacity
          style={styles.Button}
          onPress=
          {
            () => this.logout()
          }>
          <Text style={styles.ButtonText}> Logout </Text>
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