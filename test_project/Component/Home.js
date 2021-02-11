import React, { Component } from 'react';
import { View, Text,  TouchableOpacity, ToastAndroid, FlatList, StyleSheet,SafeAreaView, Image, StatusBar, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

class Home extends Component{

  constructor(props){
    super(props);

    // the components state
    this.state = {
      isLoading: true,
      listData: [],
      favouritePlaces: []
    };
  }

  componentDidMount() {
    this.unsubscribe = this.props.navigation.addListener('focus', () => {
      this.checkLoggedIn();
    });
    
    this.getData();
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  checkLoggedIn = async () => {
    const value = await AsyncStorage.getItem('token');
    if (value == null) {
      this.props.navigation.navigate('Login')
    }
  }

  favourite = async (location_id) => {
    const value = await AsyncStorage.getItem('token');
    return fetch("http://10.0.2.2:3333/api/1.0.0/location/"+location_id+"/favourite", 
    {
      method: 'POST',
      headers: {
        'X-Authorization' : value
      },
    })
      .then ((res) => {
        if (res.status === 200)
        {
          var joined = this.state.favouritePlaces.concat(location_id);
          this.setState({ favouritePlaces: joined })
          Alert.alert("favourited!")
          return res.json();
        }else if (res.status === 401){
          this.props.navigation.navigate("Login")
        }
        else{
          throw 'failed';
        }
      })
      .then ((responseJson) => {
          
        })
      .catch((message) => {console})
};

unfavourite = async (location_id) => {
  const value = await AsyncStorage.getItem('token');
  return fetch("http://10.0.2.2:3333/api/1.0.0/location/"+location_id+"/favourite", 
  {
    method: 'DELETE',
    headers: {
      'X-Authorization' : value
    },
  })
    .then ((res) => {
      if (res.status === 200)
      {
        const array = [...this.state.favouritePlaces]; // make a separate copy of the array
        const index = array.indexOf(location_id)
      if (index !== -1) {
        array.splice(index, 1);
        this.setState({favouritePlaces: array});
      }
      console.log(this.state.favouritePlaces)
      Alert.alert("Unfavourited!")
        return res.json();
      }else if (res.status === 401){
        this.props.navigation.navigate("Login")
      }
      else{
        throw 'failed';
      }
    })
    .then ((responseJson) => {
      console.log(responseJson)
        
      })
    .catch((message) => {console})
};

  getData = async () => {
    const value = await AsyncStorage.getItem('token');
    return fetch("http://10.0.2.2:3333/api/1.0.0/find", 
    {
      headers: {
        'X-Authorization' : value
      },
    })
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
            isLoading: false,
            listData: responseJson
          })
        })
      .catch((message) => {console})
};

checkFavourite = async (location_id) => {
  this.getFavourite();
  console.log(location_id)
  console.log('hello' + this.state.favouritePlaces)
  if (this.state.favouritePlaces.includes(location_id)) {
    console.log('unfollow')
    this.unfavourite(location_id);
  } else {
    console.log('follow')
    this.favourite(location_id);
  }
}


getFavourite = async () => {
  const value = await AsyncStorage.getItem('token');
  const userId = await AsyncStorage.getItem('id');
  return fetch("http://10.0.2.2:3333/api/1.0.0/user/"+ userId, 
  {
    method: "GET",
    headers: {
      'X-Authorization' : value
    },
  })
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
      console.log(responseJson)
      const favs = (responseJson.favourite_locations);
      this.setState({
        favouritePlaces: []
      });
      favs.forEach(element => {

        this.setState({
          favouritePlaces: [...this.state.favouritePlaces, element.location_id]
      });
  })
  console.log(this.state.favouritePlaces)
      })
    .catch((message) => {console})
};
    render()  {
        if (this.state.isLoading){
          return (

            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
              <Text>Loading..</Text>  
            </View>
          );
        } else{
          const SeparatorComponent = () => {
            return <View style={styles.separatorLine} />
          }

          return (
            <SafeAreaView style={styles.container}>
              <FlatList
                data={this.state.listData}
                renderItem={({ item }) => (
          
                      <View style={styles.items}>
                     <TouchableOpacity onPress={() => this.props.navigation.navigate('Review', {id: item.location_id})}>
                      <Text>{item.location_name}</Text>
                      </TouchableOpacity>
                      
                      <TouchableOpacity 
                      onPress={() => this.checkFavourite(item.location_id)}>
                        <Text style={styles.appButtonText}>Favourite</Text>
                       </TouchableOpacity>
                  </View>
                  )}
                  ItemSeparatorComponent={SeparatorComponent}
                  keyExtractor={(item,index) => item.location_id.toString()}
        /> 
            </SafeAreaView>
          );
        }
        }
    }
    const styles = StyleSheet.create({
      container: {
        flex: 1,
        marginTop: StatusBar.currentHeight || 0,
      },
      appButtonText: {
        fontSize: 18,
        color: "black",
        fontWeight: "bold",
        alignSelf: "center",
        textTransform: "uppercase"
      },
      separatorLine: {
        height: 1,
        backgroundColor: 'black',
        paddingTop: 2,
      },
      items: {
        padding: 20,
        marginVertical: 8,
        marginHorizontal: 16,
      },
      text: {
        color: 'white',
        fontSize: 25
      },
    
      
    
    });
  

export default Home