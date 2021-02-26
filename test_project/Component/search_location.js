/* eslint-disable no-mixed-operators */
/* eslint-disable no-undef */
import React, { Component } from 'react';
import { View, TouchableOpacity, ToastAndroid, FlatList, StyleSheet, StatusBar, 
         PermissionsAndroid, Image } from 'react-native';
import { Container, Header, Input, Card, CardItem, Item, Text, Button, Icon, 
         Left, Body, Right, Content, Thumbnail } from 'native-base';
import AsyncStorage from '@react-native-async-storage/async-storage';
import StarRating from 'react-native-star-rating';
import Geolocation from '@react-native-community/geolocation';
// import getDistance from 'geolib/es/getDistance';

class searchLocation extends Component {
  constructor(props) {
    super(props);
    // the components state
    this.state = {
      isLoading: true,
      search: '',
      listData: '',
      favouritePlaces: [],
      list: [],
      latitude: '',
      longitude: '',
      locationPermission: false
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
            list: responseJson,
            listData: responseJson
          });
        })
      .catch((message) => { 
        console.log(message);
      });
};

checkLoggedIn = async () => {
  const value = await AsyncStorage.getItem('token');
  if (value == null) {
    this.props.navigation.navigate('Login');
  }
}
    requestLocationPermission = async () => {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          this.setState({ locationPermission: true });
        } else {
          this.setState({ locationPermission: false });
        }
      } catch (err) {
        console.warn(err);
      }
    }

     geolocation = async () => {
      await this.requestLocationPermission();
      const arrayData = this.state.listData;
      const distance = function (lat1, lon1, lat2, lon2) {
        const radlat1 = Math.PI * lat1 / 180;
        const radlat2 = Math.PI * lat2 / 180;
        const theta = lon1 - lon2;
        const radtheta = Math.PI * theta / 180;
        let dist = Math.sin(radlat1) * Math.sin(radlat2) + 
        Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
        dist = Math.acos(dist);
        dist = dist * 180 / Math.PI;
        dist = dist * 60 * 1.1515;
        dist *= 1.609344;
      
        return dist;
      };
      if (this.state.locationPermission) {
      Geolocation.getCurrentPosition(position => {
          this.setState({ latitude: position.coords.latitude,
                         longitude: position.coords.longitude });
        });
        const { latitude, longitude } = this.state;
        // eslint-disable-next-line prefer-arrow-callback
        arrayData.sort(function (a, b) {
          const origLat = latitude;
          const origLong = longitude;
          return distance(origLat, origLong, a.latitude, a.longitude) -
          distance(origLat, origLong, b.latitude, b.longitude);
        });
      console.log(arrayData);
      this.setState({ list: arrayData });
      }
    }


    search = (text) => {
        const arrayData = this.state.listData;
        const arrayholder = this.state.list;
        let array = [];
        console.log(text);

        if (text !== '') {
          console.log('true');
        arrayholder.forEach(element => {
            if (element.location_name.toLowerCase().includes(text) || 
               element.location_town.toLowerCase().includes(text)) {
                array.push(element);
                console.log('true');
            } 
            });
          } else {
              array = arrayData;
            }
            console.log(array);
            this.setState({ list: array });
        }

    render() {
        if (this.state.isLoading) {
          return (
  
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
              <Text>Loading..</Text>  
            </View>
          );
        } 
            return (
                <Container>
                  <Header searchBar rounded>
                    <Item>
                      <Icon name="ios-search" />
                      <Input placeholder="Search" onChangeText={this.search} />
                    </Item>
                    <Button transparent>
                      <Text>Search</Text>
                    </Button>
                  </Header>
                  <CardItem>
                    <Item>
                      <Body>
                    <TouchableOpacity 
                      activeOpacity={0.7} style={styles.appButtonContainer} 
                      onPress={() => this.geolocation()}
                    >
                    <Text style={styles.appButtonText}> Find the nearest</Text>
                      
                    </TouchableOpacity>
                    </Body>
                    </Item>
                  </CardItem>
                  <FlatList
                data={this.state.list}
                renderItem={({ item }) => (
                  <TouchableOpacity
                  onPress={() => this.props.navigation.navigate('Review', { id: item.location_id })}
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
                      <Image source={{ uri: 'https://picsum.photos/seed/picsum/200/300' }} style={{ height: 200, width: null, flex: 1 }} /> 
                    </CardItem>
                    <CardItem>
                      <Body />
                      <Right>
                      <Text>
                        <StarRating
                          containerStyle={styles.review}
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
    const styles = StyleSheet.create({
      container: {
        flex: 1,
        marginTop: StatusBar.currentHeight || 0,
      },
      appButtonText: {
        fontSize: 18,
        color: 'black',
        fontWeight: 'bold',
        alignSelf: 'center',
        textTransform: 'uppercase'
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
    
      appButtonContainer: {
        elevation: 8,
        backgroundColor: '#009688',
        borderRadius: 10,
        paddingVertical: 5,
        paddingHorizontal: 6
      },
    });
  

export default searchLocation;
