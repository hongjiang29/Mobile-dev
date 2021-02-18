import React, { Component } from 'react';
import { View, TouchableOpacity, ToastAndroid, FlatList, StyleSheet,SafeAreaView, StatusBar, Alert, Image } from 'react-native';
import { Container, Header, Content, Card, CardItem, Thumbnail, Text, Button, Icon, Left, Body, Right } from 'native-base';
import AsyncStorage from '@react-native-async-storage/async-storage';
import StarRating from 'react-native-star-rating';

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
    this.getFavourite();
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

checkFavourite(location_id){
  console.log(location_id)
  if (this.state.favouritePlaces.includes(location_id)) {
    return true
  } else {
    return false
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
}

  renderAuthButton = (location_id) => {
    let bool = this.checkFavourite(location_id)
    console.log(bool)
    if (bool == true) {
    return <Button transparent onPress={() => this.unfavourite(location_id)}>
            <Icon active name="heart" />
            <Text>UnFavourite</Text>
          </Button>
  } else {
    return <Button transparent onPress={() => this.favourite(location_id)}>
            <Icon active name="heart-outline" />
            <Text>Favourite</Text>
          </Button>
  }
}

    render()  {
        if (this.state.isLoading){
          return (
  
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
              <Text>Loading..</Text>  
            </View>
          );
        } else{
        
          return (
            <Container>
              <Header />
              <FlatList
                data={this.state.listData}
                renderItem={({ item }) => (
                  <TouchableOpacity onPress={() => this.props.navigation.navigate('Review', {id: item.location_id})}>
                  <Content>
                  <Card>
                    <CardItem>
                      <Left>
                        <Thumbnail source={{uri: 'https://picsum.photos/id/237/200/300'}} />
                        <Body>
                          <Text>{item.location_name}</Text>
                          <Text note>{item.location_town}</Text>
                        </Body>
                      </Left>
                    </CardItem>
                    <CardItem cardBody>
                      <Image source={{uri: 'https://picsum.photos/seed/picsum/200/300'}} style={{height: 200, width: null, flex: 1}}/>
                    </CardItem>
                    <CardItem>
                      <Left>
                      {this.renderAuthButton(item.location_id)}
                      </Left>
                      <Body>
                      </Body>
                      <Right>
                      <Text>
                        <StarRating
                          containerStyle={styles.review}
                          starSize={25}
                          disabled={true}
                          maxStars={5}
                          rating={item.avg_overall_rating}
                          fullStarColor={'gold'}/>
                        </Text>
                      </Right>
                    </CardItem>
                    </Card>
            </Content>
                  </TouchableOpacity>
                  )}
                  
                  keyExtractor={(item,index) => item.location_id.toString()}
        /> 

            </Container>
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