/* eslint-disable no-undef */
// Important imports loading like so 
import React, { Component } from 'react';
import { View, TouchableOpacity, ToastAndroid, FlatList, Image }
from 'react-native';
import { Container, Header, Content, Card, CardItem, Thumbnail, Text, Button, Icon, Left,
         Body, Right, Title, Spinner } from 'native-base';
import AsyncStorage from '@react-native-async-storage/async-storage';
import StarRating from 'react-native-star-rating';
import { main } from '../css/styles';

class Home extends Component {
  constructor(props) {
    super(props);
    // the components state
    this.state = {
      isLoading: true,
      listData: [],
      favouritePlaces: []
    };
  }

  // Home page requies us to see more data on its face
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
  // Checks whether the user has favourited any location
  getFavourite = async () => {
    const value = await AsyncStorage.getItem('token');
    const userId = await AsyncStorage.getItem('id');
    return fetch(`http://10.0.2.2:3333/api/1.0.0/user/${userId}`, 
    {
      method: 'GET',
      headers: {
        'X-Authorization': value
      },
    })
      .then((res) => {
        if (res.status === 200) {
          return res.json();
        } else if (res.status === 401) {
          ToastAndroid.show("Your're not logged in", ToastAndroid.SHORT);
          this.props.navigation.navigate('Login');
        } else {
          throw Error;
        }
      })
      .then((responseJson) => {
        // Stores the information here into a state for later use 
        const favs = (responseJson.favourite_locations);
        this.setState({
          favouritePlaces: []
        });
        favs.forEach(element => {
          this.setState({
            favouritePlaces: [...this.state.favouritePlaces, element.location_id]
        });
    });
        }).catch((message) => { console.log(`error ${message}`); });
      }

  // Get's all of the location information to render
  getData = async () => {
    const value = await AsyncStorage.getItem('token');
    return fetch('http://10.0.2.2:3333/api/1.0.0/find', 
    {
      headers: {
        'X-Authorization': value
      },
    })
      .then((res) => {
        if (res.status === 200) {
          return res.json();
        } else if (res.status === 401) {
          ToastAndroid.show("Your're not logged in", ToastAndroid.SHORT);
          this.props.navigation.navigate('Login');
        } else {
          throw Error;
        }
      })
      .then((responseJson) => {
          this.setState({
            isLoading: false,
            listData: responseJson
          });
        }).catch((message) => { console.log(`error ${message}`); });
};
  // This will send an api fetch to favourite the review 
  favourite = async (locationId) => {
    const value = await AsyncStorage.getItem('token');
    return fetch(`http://10.0.2.2:3333/api/1.0.0/location/${locationId}/favourite`, 
    {
      method: 'POST',
      headers: {
        'X-Authorization': value
      },
    })
      .then((res) => {
        if (res.status === 200) {
          const joined = this.state.favouritePlaces.concat(locationId);
          this.setState({ favouritePlaces: joined });
          ToastAndroid.show('Favourited!', ToastAndroid.SHORT);
        } else if (res.status === 401) {
          this.props.navigation.navigate('Login');
        } else {
          throw Error;
        }
      }).catch((message) => { console.log(`error ${message}`); });
};

// this will unfavourite the review
unfavourite = async (locationId) => {
  const value = await AsyncStorage.getItem('token');
  return fetch(`http://10.0.2.2:3333/api/1.0.0/location/${locationId}/favourite`, 
  {
    method: 'DELETE',
    headers: {
      'X-Authorization': value
    },
  })
    .then((res) => {
      if (res.status === 200) {
        const array = [...this.state.favouritePlaces]; // make a separate copy of the array
        const index = array.indexOf(locationId);
      if (index !== -1) {
        array.splice(index, 1);
        this.setState({ favouritePlaces: array });
      }
      ToastAndroid.show('Unfavourited!', ToastAndroid.SHORT);
      } else if (res.status === 401) {
        this.props.navigation.navigate('Login');
      } else {
        throw Error;
      }
    }).catch((message) => { console.log(`error ${message}`); });
};


checkLoggedIn = async () => {
  const value = await AsyncStorage.getItem('token');
  if (value == null) {
    this.props.navigation.navigate('Login');
  }
}
// validates whether it's a un/favourite
checkFavourite(locationId) {
  if (this.state.favouritePlaces.includes(locationId)) {
    return true;
  } 
    return false;
}

  // renders the favourites button as accordingly to differientiate 
  renderAuthButton = (locationId) => {
    const bool = this.checkFavourite(locationId);
    if (bool === true) {
    return (<Button 
      accessibilityHint='Click here to Unfavourite' transparent onPress={() => 
      this.unfavourite(locationId)}
    >
            <Icon active name="heart" />
            <Text>UnFavourite</Text>
          </Button>);
  } 
    return (<Button 
            accessibilityHint='Click here to Favourite' transparent onPress={() => 
            this.favourite(locationId)}
    >
            <Icon active name="heart-outline" />
            <Text>Favourite</Text>
          </Button>);
}
     // here is where all the magic happens
    render() {
        if (this.state.isLoading) {
          return (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
              <Spinner color='black' />   
            </View>
          );
        }
          return (
            <Container>
              <Header>
              <Title style={main.headerText}>HOME</Title>
              </Header>
              <FlatList
                data={this.state.listData}
                renderItem={({ item }) => (
                  <TouchableOpacity 
                  accessible onPress={() => this.props.navigation.navigate('Review', 
                                    { id: item.location_id })}
                  >
                  <Content>
                  <Card>
                    <CardItem>
                      <Left>
                        <Thumbnail source={{ uri: 'https://picsum.photos/id/237/200/300' }} />
                        <Body>
                          <Text>{item.location_name}</Text>
                          <Text note>{item.location_town}</Text>
                        </Body>
                      </Left>
                    </CardItem>
                    <CardItem cardBody>
                      <Image 
                      source={{ uri: item.photo_path }} 
                      style={{ height: 200, width: null, flex: 1 }} 
                      />
                    </CardItem>
                    <CardItem>
                      <Left>
                      {this.renderAuthButton(item.location_id)}
                      </Left>
                      <Body />
                      <Right>
                      <Text>
                        <StarRating
                          starSize={25}
                          disabled
                          maxStars={5}
                          rating={item.avg_overall_rating}
                          fullStarColor={'gold'} 
                        />
                        </Text>
                      </Right>
                    </CardItem>
                    </Card>
            </Content>
                  </TouchableOpacity>
                  )}
                  
                  keyExtractor={(item) => item.location_id.toString()}
              /> 

            </Container>
          );
        }
        }

export default Home;
