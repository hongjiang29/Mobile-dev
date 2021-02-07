import React, { Component } from 'react';
import {View, Text, StyleSheet, Button} from 'react-native';

class Home extends Component{

    render(){
    
        const navigation = this.props.navigation;

        return(
            <View style={styles.container}>
                <Text style={styles.text}>Home</Text>
                <Button
                title="Login"
                onPress={() => navigation.navigate('Login')}/>

                <Button
                title="Contact"
                onPress={() => navigation.navigate('Contact')}/>   

                <Button
                title="Logout"
                onPress={() => navigation.navigate('Logout')}/>   
            </View>

        );

    }

}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'forestgreen'
    },
    text: {
      color: 'white',
      fontSize: 25
    },
  
    
  
  });

export default Home