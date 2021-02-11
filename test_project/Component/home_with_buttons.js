import React, { Component } from 'react';
import {View, Text, StyleSheet, Button} from 'react-native';

class Home extends Component{

    render(){
    
        const navigation = this.props.navigation;

        return(
            <View style={styles.container}>
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