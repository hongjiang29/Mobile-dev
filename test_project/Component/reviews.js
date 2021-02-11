
import React, { Component } from 'react';
import { View, FlatList, Text, Button, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BackHandler } from 'react-native';

class Reviews extends Component{
  constructor(props){
    super(props);
    console.log('hello' + JSON.stringify(props))

    // the components state
    this.state = {
        isLoading: true,
        listData: '',
        params: props.route.params.id
    };
  }

  componentDidMount() {
    this.getData()
  }

  getData = async () => {
    let id = this.state.params;
    console.log(id)
    return fetch("http://10.0.2.2:3333/api/1.0.0/location/"+id)
      .then ((res) => {
        if (res.status === 200)
        {
          return res.json();
        }else if (res.status === 401){
          ToastAndroid.show("Your're not logged in", ToastAndroid.SHORT)
          this.props.navigation.navigate("Login")
        }
        else{
          throw 'failed';
        }
      })
      .then ((responseJson) => {
          this.setState({
            listData: responseJson,
            isLoading: false
          })
        })
      .catch((message) => {console})
};

    render(){
        
        if (this.state.isLoading){
            return (
  
              <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <Text>Loading..</Text>  
              </View>
            );
          } else{
            const item = this.state.listData
            console.log(item.location_reviews)
        return (
            <View>

                    <Text>Location Name: {item.location_name}</Text>
                    <Text>Location Town: {item.location_town}</Text>
                    <Text>Overall Rating: {item.avg_overall_rating}</Text>
                    <Text>Price Rating: {item.avg_price_rating}</Text>
                    <Text>Quality Rating: {item.avg_quality_rating}</Text>
                    <Text>Clenliness Rating: {item.avg_clenliness_rating}</Text>

            </View>
          );
        }
      }
    }

export default Reviews