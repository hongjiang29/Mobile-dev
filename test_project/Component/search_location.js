/* eslint-disable no-mixed-operators */
/* eslint-disable no-undef */
import React, { Component } from 'react';
import { View, TouchableOpacity, ToastAndroid, FlatList, 
         PermissionsAndroid, Image, Modal } from 'react-native';
import { Container, Header, Input, Card, CardItem, Item, Text, Button, Icon, 
         Left, Body, Right, Content, Thumbnail, Spinner } from 'native-base';
import AsyncStorage from '@react-native-async-storage/async-storage';
import StarRating from 'react-native-star-rating';
import Geolocation from '@react-native-community/geolocation';
import DropDownPicker from 'react-native-dropdown-picker';
import { search, main } from '../css/styles';

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
      locationPermission: false,
      show: false,
      overallRating: '',
      priceRating: '',
      qualityRating: '',
      clenlinessRating: '',
      search_in: ''
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

      getGeoLocation = async () => {
        Geolocation.getCurrentPosition(position => {
          this.setState({ latitude: position.coords.latitude,
                        longitude: position.coords.longitude });
        });
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
        await this.getGeoLocation();
        const { latitude, longitude } = this.state;
        // eslint-disable-next-line prefer-arrow-callback
        arrayData.sort(function (a, b) {
          const origLat = latitude;
          const origLong = longitude;
          return distance(origLat, origLong, b.latitude, b.longitude) -
          distance(origLat, origLong, a.latitude, a.longitude);
        });
      this.setState({ list: arrayData });
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

    handleSearch = (text) => {
      this.setState({ search: text });
    }

    handleOverall = (text) => {
      this.setState({ overallRating: text });
    }

    handlePrice = (text) => {
      this.setState({ priceRating: text });
    }

    handleQuality = (text) => {
      this.setState({ qualityRating: text });
    }

    handleClenliness = (text) => {
      this.setState({ clenlinessRating: text });
    }

    handleSearchIn = (text) => {
      this.setState({ search_in: text });
    }

    checkLoggedIn = async () => {
      const value = await AsyncStorage.getItem('token');
      if (value == null) {
        this.props.navigation.navigate('Login');
      }
    }

    search = async () => {
      const value = await AsyncStorage.getItem('token');
      const searchObject = this.state.search;
      let url = `http://10.0.2.2:3333/api/1.0.0/find?q=${searchObject}`;
      if (this.state.overallRating) {
        url = `${url}&overall_rating=${this.state.overallRating}`;
      } 
      if (this.state.priceRating) {
        url = `${url}&price_rating=${this.state.priceRating}`;
      }
      if (this.state.qualityRating) {
        url = `${url}&quality_rating=${this.state.qualityRating}`;
      }
      if (this.state.clenlinessRating) {
        url = `${url}&clenliness_rating=${this.state.clenlinessRating}`;
      }
      if (this.state.search_in) {
        url = `${url}&search_in=${this.state.search_in}`;
      }
      return fetch(url, 
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
              list: responseJson
            });
          }).catch((message) => { console.log(`error ${message}`); });
      }

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
                  <Header searchBar rounded>
                    <Item>
                      <TouchableOpacity 
                      accessibilityHint='Press to search your string or filter'
                       onPress={() => this.search()}
                      >
                      <Icon name="ios-search" />
                      </TouchableOpacity>
                      <Input 
                      placeholder="Search" onChangeText={this.handleSearch} 
                      value={this.state.search} 
                      />
                    </Item>
                  </Header>
                  <CardItem>
                    <Item>
                      <Body>
                      <View style={search.rowContainer}>
                    <TouchableOpacity 
                      activeOpacity={0.7} style={search.appButtonContainer} 
                      accessibilityHint='Press to find the closest coffee shop' onPress={() => 
                      this.geolocation()}
                    >
                    <Text style={main.appButtonText}> Find the nearest</Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                      accessibilityHint='Click here to pull up the filter options'
                      activeOpacity={0.7} style={search.appButtonContainer} 
                      onPress={() => { this.setState({ show: true }); }}
                    >
                      <Text style={main.appButtonText}>Filter</Text>
                    </TouchableOpacity>
                    </View>
                    <Modal
                    transparent
                    visible={this.state.show} 
                    >
                      <View style={{ backgroundColor: '#000000aa', flex: 1 }}>
                      <View 
                      style={{ 
                      backgroundColor: '#ffffff', 
                      flex: 1, 
                      margin: 50, 
                      padding: 40, 
                      borderRadius: 10 }}
                      >
                      <Item rounded style={{ marginTop: 20, backgroundColor: 'white' }}>
                      <Input
                        accessibilityLabel='Enter Overall Rating of values between 1 and 5'
                        placeholder="Overall Rating 1-5" 
                        onChangeText={this.handleOverall} maxLength={1} 
                        value={this.state.overallRating} 
                      />
                      </Item>
                      <Item rounded style={{ marginTop: 20, backgroundColor: 'white' }}>
                      <Input 
                        accessibilityLabel='Enter Price Rating of values between 1 and 5'
                        placeholder="Price Rating 1-5" 
                        onChangeText={this.handlePrice} maxLength={1} 
                        value={this.state.priceRating} 
                      />
                      </Item>
                      <Item rounded style={{ marginTop: 20, backgroundColor: 'white' }}>
                      <Input 
                        accessibilityLabel='Enter Quality Rating of values between 1 and 5'
                        placeholder="Quality Rating 1-5" 
                        onChangeText={this.handleQuality} maxLength={1} 
                        value={this.state.qualityRating} 
                      />
                      </Item>

                      <Item rounded style={{ marginTop: 20, backgroundColor: 'white' }}>
                      <Input 
                        accessibilityLabel='Enter Clenliness of values between 1 and 5'
                        placeholder="Clenliness Rating 1-5" 
                        onChangeText={this.handleClenliness} maxLength={1} 
                        value={this.state.clenlinessRating} 
                      />
                      </Item>
                
                      <DropDownPicker
                        accessibilityLabel='pick your favourites or reviewed places'
                        items={[
                            { label: 'None', value: '' },
                            { label: 'Favourites', value: 'favourite' },
                            { label: 'Reviewed', value: 'reviewed' },
                        ]}
                        defaultValue={this.state.search_in}
                        containerStyle={{ height: 60 }}
                        style={{ marginTop: 20, backgroundColor: '#fafafa' }}
                        itemStyle={{
                            justifyContent: 'flex-start'
                        }}
                        dropDownStyle={{ backgroundColor: '#fafafa' }}
                        onChangeItem={item => this.setState({
                            search_in: item.value
                        })}
                      />
                      
                      <TouchableOpacity 
                      accessible
                      activeOpacity={0.7} style={search.appButtonCloseContainer} 
                      onPress={() => { this.setState({ show: false }); }}
                      > 
                      <Text style={main.appButtonText}>X</Text>
                    </TouchableOpacity>
                      </View>
                    </View>
                    </Modal>
                    <Text style={main.appButtonText}> Filter</Text>
                    </Body>
                    </Item>
                  </CardItem>
                  <FlatList
                data={this.state.list}
                renderItem={({ item }) => (
                  <TouchableOpacity
                  accessibilityHint='Click here to select a review'
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
                      <Image 
                      source={{ uri: item.photo_path }} 
                      style={{ height: 200, width: null, flex: 1 }} 
                      /> 
                    </CardItem>
                    <CardItem>
                      <Body />
                      <Right>
                      <Text>
                        <StarRating
                          containerStyle={search.review}
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

export default searchLocation;
