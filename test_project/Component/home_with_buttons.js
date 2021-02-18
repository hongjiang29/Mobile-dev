import React, { Component } from 'react';
import {View, Text, StyleSheet, Button} from 'native-base';

class Home extends React.Component{

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



export default Home