/* eslint-disable no-undef */

import React, { Component } from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity, Image, ToastAndroid } from 'react-native';
import StarRating from 'react-native-star-rating';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Container, Header, Card, CardItem, Text, Button, Icon, Left, 
         Body, Right, Title, Subtitle, Item } from 'native-base';

class Reviews extends Component {
  constructor(props) {
    super(props);
    

    // the components state
    this.state = {
        isLoading: true,
        listData: '',
        likes: [],
        myReviews: [],
        location_ids: [],
        photo: {},
        boolPhoto: true,
        params: props.route.params.id
    };
  }
  async componentDidMount() {
    this.unsubscribe = this.props.navigation.addListener('focus', () => {
      this.checkLoggedIn();
    });
     this.getLikes();
     this.getData();
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  getphoto = async () => {
    const value = await AsyncStorage.getItem('token');
    const array = this.state.location_ids;
    const locId = this.state.params;
    console.log(array);
    const photos = {};
    array.forEach(element => {
    fetch(`http://10.0.2.2:3333/api/1.0.0/location/${locId}/review/${element}/photo`, {
      method: 'GET',
      headers: {
      'X-Authorization': value
    },
  }).then((res) => {
        if (res.status === 200) {
          return res.url;
        } else if (res.status === 401) {
          console.log('error');
        } else if (res.status === 404) {
         console.log('missing');
        } else {
          console.log('forbidden');
        }
      }).then((response) => {
        if (typeof (response) === 'undefined') {
          return false;
        } 
        console.log('success');
        photos[element] = `${response}?time=${new Date()}`;
      });
    });
    this.setState({ photo: photos,
      isLoading: false });
    }

    getData = async () => {
      const id = this.state.params;
      console.log(id);
      return fetch(`http://10.0.2.2:3333/api/1.0.0/location/${id}`)
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
          const arrayId = [];
          const myReviews = (responseJson.location_reviews);
          myReviews.forEach(element => {
            arrayId.push(element.review_id);
      });
            this.setState({
              location_ids: arrayId,
              listData: responseJson,
            });
            if (this.state.boolPhoto) {
            this.getphoto(); 
          }
          });
  };

  getLikes = async () => {
    const userId = await AsyncStorage.getItem('id');
    const value = await AsyncStorage.getItem('token');
    return fetch(`http://10.0.2.2:3333/api/1.0.0/user/${userId}`, {
      method: 'GET',
      headers: {
      'X-Authorization': value
    },
  })
      .then((res) => {
        if (res.status === 200) {
          console.log('getlikes');
          return res.json();
        } else if (res.status === 401) {
          ToastAndroid.show("Your're not logged in", ToastAndroid.SHORT);
          this.props.navigation.navigate('Login');
        } else {
          throw Error;
        }
      }).then((responseJson) => {
        const likes = (responseJson.liked_reviews);
        const arrayLikes = [...this.state.likes];
        const arrayReviews = [...this.state.myReviews];
        const myReviews = (responseJson.reviews);

        likes.forEach(element => {
          arrayLikes.push(element.review.review_id);
    });
        myReviews.forEach(element => {
          arrayReviews.push(element.review.review_id);
    });
        this.setState({
          likes: arrayLikes,
          myReviews: arrayReviews
        });
        });
};

  like = async (locationId, reviewId) => {
    const value = await AsyncStorage.getItem('token');
    return fetch(`http://10.0.2.2:3333/api/1.0.0/location/${locationId}/review/${reviewId}/like`, 
    {
      method: 'POST',
      headers: {
        'X-Authorization': value
      },
    }).then((res) => {
        if (res.status === 200) {
          this.getData();
          const joined = this.state.likes.concat(reviewId);
          this.setState({ boolPhoto: false, likes: joined });
          ToastAndroid.show('Liked!', ToastAndroid.SHORT);
        } else if (res.status === 401) {
          this.props.navigation.navigate('Login');
        } else {
          throw Error;
        }
      });
};

unLike = async (locationId, reviewId) => {
  const value = await AsyncStorage.getItem('token');
  return fetch(`http://10.0.2.2:3333/api/1.0.0/location/${locationId}/review/${reviewId}/like`, 
  {
    method: 'DELETE',
    headers: {
      'X-Authorization': value
    },
  })
    .then((res) => {
      if (res.status === 200) {
        this.getData();
        const array = [...this.state.likes]; // make a separate copy of the array
        const index = array.indexOf(reviewId);
        if (index !== -1) {
          array.splice(index, 1);
          this.setState({ boolPhoto: false, likes: array });
      }
      ToastAndroid.show('Unliked!', ToastAndroid.SHORT);
      } else if (res.status === 401) {
        this.props.navigation.navigate('Login');
      } else {
        throw Error;
      }
    });
};

checkLoggedIn = async () => {
  const value = await AsyncStorage.getItem('token');
  if (value == null) {
    this.props.navigation.navigate('Login');
  }
}

deleteReview = async (locationId, reviewId) => {
  const value = await AsyncStorage.getItem('token');
  return fetch(`http://10.0.2.2:3333/api/1.0.0/location/${locationId}/review/${reviewId}`, 
  {
    method: 'DELETE',
    headers: {
      'X-Authorization': value
    },
  }).then((res) => {
      if (res.status === 200) {
        this.setState({ boolPhoto: false });
        this.getData();
        ToastAndroid.show('Review Deleted!', ToastAndroid.SHORT);
      } else if (res.status === 401) {
        this.props.navigation.navigate('Review');
      } else {
        throw Error;
      }
    });
};

  checkLikes(reviewId) {
    if (this.state.likes.includes(reviewId)) {
      return true;
    } 
      return false;
  }

  checkReviews(reviewId) {
    if (this.state.myReviews.includes(reviewId)) {
      return true;
    } 
      return false;
  }

  starRating(rating) {
    return (<StarRating
              containerStyle={styles.review}
              starSize={20}
              disabled
              maxStars={5}
              rating={rating}
              fullStarColor={'gold'}
    />);
  }

  renderFileUri(reviewId) {
    console.log(this.state.photo);
    if (this.state.photo[reviewId]) {
      return (<Image 
      source={{ uri: this.state.photo[reviewId] }} 
      style={{ height: 200, width: null, flex: 1 }}
      />);
    } 
    }

  renderLikeButton = (item) => {
    const bool = this.checkLikes(item.review_id);
    const id = this.state.params;
    if (bool === true) {
    return (<Button transparent onPress={() => this.unLike(id, item.review_id)}>
            <Icon active name="thumbs-up" />
            <Text>{item.likes}</Text>
          </Button>);
  } 
    return (<Button transparent onPress={() => this.like(id, item.review_id)}>
            <Icon active name="thumbs-up-outline" />
            <Text>{item.likes}</Text>
          </Button>);
}

  renderEditButton = (item, locId) => {
    const bool = this.checkReviews(item.review_id);
    if (bool === true) {
    return (<Button 
            transparent onPress={() => this.props.navigation.push('EditReview', 
            { review: item, loc_id: locId })}
    >
            <Icon active name="md-hammer" /> 
            <Text>Edit</Text>
          </Button>);
  }
}

  renderDeleteButton = (reviewId) => {
    const bool = this.checkReviews(reviewId);
    const id = this.state.params;
    if (bool === true) {
    return (<Button rounded danger onPress={() => this.deleteReview(id, reviewId)}>
            <Text>Delete</Text>
          </Button>);
  }
  }
    render() {
        if (this.state.isLoading) {
            return (
              <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <Text>Loading..</Text>  
              </View>
            );
          } 
            const itemFirst = this.state.listData;
            const locId = itemFirst.location_id;
        return (
          
          <Container>
            <Header>
            <Left>
            <Button transparent onPress={() => this.props.navigation.navigate('Home')}>
              <Icon name='arrow-back' />
            </Button>
              </Left>
              <Body>
              <Title style={{ fontWeight: 'bold', fontSize: 20 }}>{itemFirst.location_name}</Title>
              <Subtitle>{itemFirst.location_town}</Subtitle>
              </Body>
              <Right>
              <TouchableOpacity 
              activeOpacity={0.7} style={styles.appButtonContainer} onPress={() => 
              this.props.navigation.push('AddReview', { id: this.state.params })}
              >
                    
              <Text style={styles.appButtonText}> + </Text>
              </TouchableOpacity>
              </Right>
           </Header>
                <Card>
                  <CardItem>
                    <Item>
                    <Left>
                      <Text>
                      Price Rating:
                      {this.starRating(itemFirst.avg_price_rating)}  
                    </Text>
                    </Left>
                    <Body>
                      <Text>
                        Quality Rating:     
                        {this.starRating(itemFirst.avg_quality_rating)}
                      </Text>
                    </Body>
                    <Right>
                        <Text>Hygiene Rating:
                        {this.starRating(itemFirst.avg_clenliness_rating)}
                    </Text>
                    </Right>
                    </Item>
                  </CardItem>
                    </Card>
                    <Text style={{ left: 30, top: 5, fontWeight: 'bold', paddingBottom: 10 }}>
                     Reviews: </Text>
                    <FlatList
                    data={itemFirst.location_reviews}
                    renderItem={({ item }) => (
                      <Card>
                      <CardItem>
                        <Left />
                        <Body>
                        <Text style={{ fontWeight: 'bold' }}>
                          Overall Rating: {'\n'}
                          {this.starRating(item.overall_rating)}
                          </Text>
                        </Body>
                        <Right />
                        </CardItem>  
                    <CardItem>
                      <Left>
                    <Text style={styles.textrating}>
                      Price Rating: {'\n'}
                      {this.starRating(item.price_rating)}
                      </Text>
                      </Left>
                      <Body>
                      <Text style={styles.textrating}>
                      Quality Rating: {'\n'}
                      {this.starRating(item.quality_rating)}
                      </Text>
                      </Body>
                      <Right>
                      <Text style={styles.textrating}>
                      Clenliness Rating: {'\n'}
                      {this.starRating(item.clenliness_rating)}
                      </Text>
                      </Right>
                    </CardItem>
                    <CardItem cardBody>
                      {this.renderFileUri(item.review_id)}
                    </CardItem>
                    <CardItem>
                    <Text style={styles.text}>
                      Comment: {item.review_body}{'\n'}</Text>
                    </CardItem>
                    <CardItem>
                      <Left>
                        {this.renderLikeButton(item)}
                      </Left>
                      <Body>
                      {this.renderDeleteButton(item.review_id)}
                      </Body>
                      <Right>
                      {this.renderEditButton(item, locId)}
                      </Right>
                    </CardItem>
                    </Card>
                    )}
                    keyExtractor={(item) => item.review_id.toString()}
                    /> 
                </Container>
          );
        }
      }
    

    const styles = StyleSheet.create({
      review: {
        alignItems: 'stretch'
      },
      separatorLine: {
        height: 1,
        backgroundColor: 'black',
        paddingTop: 2,
      },
      textrating: {
          fontSize: 12,
          fontWeight: 'bold'
      },

      container: {
        flex: 1,
        padding: 10,
      },  
      appButtonContainer: {
        width: 50,
        marginTop: 10,
        padding: 5,
        margin: 10,
        borderColor: 'black',
        elevation: 8,
        borderRadius: 10,
        backgroundColor: 'green'
      },
      
      appButtonText: {
        fontSize: 20,
        color: 'white',
        fontWeight: 'bold',
        alignSelf: 'center',
        textTransform: 'uppercase',
      },
    });

export default Reviews;
