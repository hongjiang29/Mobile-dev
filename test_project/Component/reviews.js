/* eslint-disable no-undef */
// Import loaded in
import React, { Component } from 'react';
import { View, FlatList, TouchableOpacity, Image, ToastAndroid } from 'react-native';
import StarRating from 'react-native-star-rating';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Container, Header, Card, CardItem, Text, Button, Icon, Left, 
         Body, Right, Title, Subtitle, Item, Spinner } from 'native-base';
import Tts from 'react-native-tts';
import { review, main } from '../css/styles';

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
  // get's the required information first, before anything is executed
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
  // this is executed when the getdata function finishes its function. 
  // returns a list of photos corresponding to the reviews
  getphoto = async () => {
    const value = await AsyncStorage.getItem('token');
    const array = this.state.location_ids;
    const locId = this.state.params;
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
         console.log('No Image');
        } else {
          console.log('forbidden');
        }
      }).then((response) => {
        // checks if the photo isn't undefined so thati t can be rendered properly
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
    // getting all the reviews relating to the location. Also stores the review_ids 
    getData = async () => {
      const id = this.state.params;
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

  // gets the likes status and pulls the reviews that the user has added themselves
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
  // User is directed here if they hit the like button, corresponding to the review
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
          //when successful, get the current state of the database and render
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
// User is directed here if they hit the unlike button, corresponding to the review
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
        //when successful, get the current state of the database and render
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

// Deletes the review when the user presses the button
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
        // when successful, re-render
        this.getData();
        ToastAndroid.show('Review Deleted!', ToastAndroid.SHORT);
      } else if (res.status === 401) {
        this.props.navigation.navigate('Review');
      } else {
        throw Error;
      }
    });
};
  // checks if the user has liked a review to render like icon
  checkLikes(reviewId) {
    if (this.state.likes.includes(reviewId)) {
      return true;
    } 
      return false;
  }

  // checks if the user owns the review to render edit button
  checkReviews(reviewId) {
    if (this.state.myReviews.includes(reviewId)) {
      return true;
    } 
      return false;
  }
  // star rating template
  starRating(rating) {
    return (<StarRating
              containerStyle={review.review}
              starSize={20}
              disabled
              maxStars={5}
              rating={rating}
              fullStarColor={'gold'}
    />);
  }
  // extra feature that allows text to speech
  speechToText = (text) => {
    Tts.speak(text);
  }
  // renders image if review has one
  renderFileUri(reviewId) {
    if (this.state.photo[reviewId]) {
      return (<Image 
      source={{ uri: this.state.photo[reviewId] }} 
      style={{ height: 400, width: null, flex: 1, marginHorizontal: 3 }}
      />);
    } 
    }
    // renders the like button accordingly if it is highlighted or not
  renderLikeButton = (item) => {
    const bool = this.checkLikes(item.review_id);
    const id = this.state.params;
    if (bool === true) {
    return (<Button 
             accessibilityHint='Press to unike' transparent onPress={() => 
             this.unLike(id, item.review_id)}
    >
            <Icon active name="thumbs-up" />
            <Text>{item.likes}</Text>
          </Button>);
  } 
    return (<Button 
             accessibilityHint='Press to like' transparent onPress={() => 
             this.like(id, item.review_id)}
    >
            <Icon active name="thumbs-up-outline" />
            <Text>{item.likes}</Text>
          </Button>);
}
// renders the edit button accordingly if it belongs to the user
  renderEditButton = (item, locId) => {
    const bool = this.checkReviews(item.review_id);
    if (bool === true) {
    return (<Button 
            accessibilityHint='Press to edit this review' transparent onPress={() => 
            this.props.navigation.push('EditReview', 
            { review: item, loc_id: locId })}
    >
            <Icon active name="md-hammer" /> 
            <Text>Edit</Text>
          </Button>);
  }
}
// renders the delete button accordingly if it belongs to the user
  renderDeleteButton = (reviewId) => {
    const bool = this.checkReviews(reviewId);
    const id = this.state.params;
    if (bool === true) {
    return (<Button 
            accessibilityHint='Press to delete this review' rounded danger 
            onPress={() => this.deleteReview(id, reviewId)}
    >
            <Text>Delete</Text>
          </Button>);
  }
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
            const itemFirst = this.state.listData;
            const locId = itemFirst.location_id;
        return (
          <Container>
            <Header>
            <Left>
            <Button 
            accessibilityHint='Press to return to the home page' transparent onPress={() => 
            this.props.navigation.navigate('Home')}
            >
              <Icon name='arrow-back' />
            </Button>
              </Left>
              <Body>
              <Title style={{ fontWeight: 'bold', fontSize: 20 }}>{itemFirst.location_name}</Title>
              <Subtitle>{itemFirst.location_town}</Subtitle>
              </Body>
              <Right>
              <TouchableOpacity 
              accessible activeOpacity={0.7} style={main.appButtonContainer} onPress={() => 
              this.props.navigation.push('AddReview', { id: this.state.params })}
              >    
              <Icon active name="pencil-outline" />
              </TouchableOpacity>
              </Right>
           </Header>
                <Card>
                  <CardItem>
                    <Item>
                    <Left>
                      <View>
                      <View style={{ justiftyContent: 'center', alignItems: 'center' }}>
                      <Icon active name="ios-cash-outline" />
                      </View>
                      <Text style={review.textrating}>
                      {this.starRating(itemFirst.avg_price_rating)}  
                    </Text>
                    </View>
                    </Left>
                    <Body>
                    <View>
                      <View style={{ justiftyContent: 'center', alignItems: 'center' }}>
                      <Icon active name="cellular" />
                      </View>
                      <Text style={review.textratingIcon}>  
                        {this.starRating(itemFirst.avg_quality_rating)}
                      </Text>
                      </View>
                    </Body>
                    <Right>
                      <View>
                      <View style={{ justiftyContent: 'center', alignItems: 'center' }}>
                        <Icon active name="md-water" />
                      </View>
                      <Text style={review.textratingIcon}>
                      {this.starRating(itemFirst.avg_clenliness_rating)}
                    </Text>
                    </View>
                    </Right>
                    </Item>
                  </CardItem>
                    </Card>
                    
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
                    <Text style={review.textrating}>
                      Price Rating: {'\n'}
                      {this.starRating(item.price_rating)}
                      </Text>
                      </Left>
                      <Body>
                      <Text style={review.textrating}>
                      Quality Rating: {'\n'}
                      {this.starRating(item.quality_rating)}
                      </Text>
                      </Body>
                      <Right>
                      <Text style={review.textrating}>
                      Clenliness Rating: {'\n'}
                      {this.starRating(item.clenliness_rating)}
                      </Text>
                      </Right>
                    </CardItem>
                    <CardItem cardBody>
                      {this.renderFileUri(item.review_id)}
                    </CardItem>
                    <CardItem>
                      <View>
                    <Text style={review.text}>
                      Comment: {item.review_body}{'\n'}</Text>
                      <TouchableOpacity 
                      accessibilityHint='Press this to listen to the review body' 
                      onPress={() => this.speechToText(item.review_body)}
                      >
                      <Icon active name="volume-high-outline" />
                      </TouchableOpacity>
                      </View>
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

export default Reviews;
