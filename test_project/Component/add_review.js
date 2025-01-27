/* eslint-disable no-undef */
// Package imports
import React, { Component } from 'react';
import { View, Image, TouchableOpacity, ToastAndroid } from 'react-native';
import { Container, Form, Header, Title, Item, Input, Text, Button, Icon, Left, Body,
         Right, Content } from 'native-base';
import StarRating from 'react-native-star-rating';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'react-native-image-picker';
import Filter from 'bad-words';
import { main } from '../css/styles';


class AddReview extends Component {
  constructor(props) {
    super(props);
    // declaring state variables
    this.state = {
      overallRating: 0,
      priceRating: 0,
      qualityRating: 0,
      clenlinessRating: 0,
      reviewBody: '',
      params: props.route.params.id,
      image: false,
      listData: [],
      file: {},
      isNull: true,
      fileUri: '',
      errorLength: '',
    };
  }

//Getting the last review that was just been logged
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
        //look at the last object of the list and log it
        this.setState({
          listData: responseJson.location_reviews[responseJson.location_reviews.length - 1]
        });
        this.addPhoto();
      });
};

//Opens the camera for user
cameraLaunch = () => {
  const options = {
    storageOptions: {
      skipBackup: true,
      path: 'images',
    },
  };
  ImagePicker.launchCamera(options, (response) => {
    console.log('Response = ', response);

    if (response.didCancel) {
      console.log('User cancelled image picker');
    } else if (response.error) {
      console.log('ImagePicker Error: ', response.error);
    } else if (response.customButton) {
      console.log('User tapped custom button: ', response.customButton);
      alert(response.customButton);
    } else {
      console.log('response', JSON.stringify(response.uri));
      this.setState({
        file: response,
        fileUri: response.uri
      });
    }
  });
}

  //fetch to add a review
  addreview = async () => {
    const navigation = this.props.navigation;
    const id = this.state.params;
    const { overallRating, priceRating, qualityRating, clenlinessRating, reviewBody } = this.state;
    //checking if any values are null
    if (overallRating === 0 || priceRating === 0 || qualityRating === 0 || 
        clenlinessRating === 0 || reviewBody.length === 0) {
      this.setState({ errorLength: 'One of the ratings or review box is empty!',
                     isNull: false });
      return false;
    }
    //Extension task with the filtered out words
    const filter = new Filter();
    filter.addWords('tea', 'cakes', 'pastries');
    const Token = await AsyncStorage.getItem('token');
    console.log(overallRating);
    fetch(`http://10.0.2.2:3333/api/1.0.0/location/${id}/review`,
      {
        method: 'post',
        headers: {
          'X-Authorization': Token,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          overall_rating: overallRating,
          price_rating: priceRating,
          quality_rating: qualityRating,
          clenliness_rating: clenlinessRating,
          review_body: filter.clean(reviewBody)
        }),

      })
      .then((res) => {
        if (res.status === 201) {
          //if photo has been added, get the latest review data
          if (this.state.fileUri) {
            this.getData();
          } else {
            ToastAndroid.show('Review Added!', ToastAndroid.SHORT);
            navigation.push('Review', { id }); 
          }
         } else if (res.status === 400) {
          throw Error;
        } else {
          throw Error;
        }
      })
      .catch((message) => { console.log(`error ${message}`); });
  }

  //if added, system sends a fetch to add image to review
  addPhoto = async () => {
    const navigation = this.props.navigation;
    const id = this.state.params;
    const reviewId = this.state.listData.review_id;
    const Token = await AsyncStorage.getItem('token');
    fetch(`http://10.0.2.2:3333/api/1.0.0/location/${id}/review/${reviewId}/photo`,
      {
        method: 'post',
        headers: {
          'X-Authorization': Token,
          'Content-Type': 'image/jpeg'
        },
        body: this.state.file
        })
      .then((res) => {
        if (res.status === 200) {
          ToastAndroid.show('Photo uploaded!', ToastAndroid.SHORT);
          navigation.push('Review', { id });
        } else if (res.status === 400) {
          throw Error;
        } else {
          throw Error;
        }
      })
      .catch((message) => { console.log(`error ${message}`); });
  }

  //Recievieving string from input box to get current value from user 
  handleOverall = (rating) => {
    this.setState({ isNull: true,
                   overallRating: rating });
  }
  handlePrice = (rating) => {
    this.setState({ isNull: true,
                   priceRating: rating });
  }

  handleQuality = (rating) => {
    this.setState({ isNull: true,
                   qualityRating: rating });
  }

  handleCleniness = (rating) => {
    this.setState({ isNull: true,
                   clenlinessRating: rating });
  }

  handleBody = (text) => {
    this.setState({ isNull: true,
                   reviewBody: text });
  }
  
  removeImage = () => {
      this.setState({ fileUri: false });
  }

  //this renders the image if the review has one
  renderFileUri() {
    if (this.state.fileUri) {
      return (<View><Image
        source={{ uri: this.state.fileUri }}
        style={main.images}
      />
      <TouchableOpacity accessible style={main.close} onPress={() => this.removeImage()}>
        <Icon name="ios-close-circle" size={25} />
        </TouchableOpacity>
      </View>);
    } 
      return (<Image
        // eslint-disable-next-line global-require
        source={require('../assets/dummy.png')}
        style={main.images}
      />);
  }
  //here is where all the magic happens
  render() {
    return (
      <Container>
        <Header>
            <Left>
            <Button 
            accessibilityHint='Click here to back to reviews' transparent onPress={() => 
              this.props.navigation.goBack()}
            >
              <Icon name='arrow-back' />
            </Button>
              </Left>
              <Body>
              <Title style={{ fontWeight: 'bold', fontSize: 20 }}>Add Review</Title>
              </Body>
              <Right />
           </Header>
        <Content>
      <View style={main.container}>
      <Form style={{ paddingLeft: 20, paddingRight: 20 }}>
      <Item style={{ marginTop: 20 }}>
          <Text>
          Overall Rating: {'\n'}
            <StarRating
                containerStyle={main.review}
                starSize={25}
                disabled={false}
                maxStars={5}
                rating={this.state.overallRating}
                fullStarColor={'gold'}
                selectedStar={(rating) => this.handleOverall(rating)}
            />{'\n'}

            Price Rating: {'\n'}
              <StarRating
                containerStyle={main.review}
                starSize={25}
                disabled={false}
                maxStars={5}
                rating={this.state.priceRating}
                fullStarColor={'gold'}
                selectedStar={(rating) => this.handlePrice(rating)}
              />{'\n'}

            Quality Rating: {'\n'}
              <StarRating
                containerStyle={main.review}
                starSize={25}
                disabled={false}
                maxStars={5}
                rating={this.state.qualityRating}
                fullStarColor={'gold'}
                selectedStar={(rating) => this.handleQuality(rating)}
              />{'\n'}

            Clenliness Rating: {'\n'}
              <StarRating
                containerStyle={main.review}
                starSize={25}
                disabled={false}
                maxStars={5}
                rating={this.state.clenlinessRating}
                fullStarColor={'gold'}
                selectedStar={(rating) => this.handleCleniness(rating)}
              />{'\n'}
            </Text>
            </Item>
            <Item style={{ marginTop: 20 }}>
            <Text>
            Review/Comment: {'\n'}
            </Text></Item>
            <Item>
            <Input
                accessibilityLabel='Write a review here'
                placeholder="Review away..."
                multiline
                value={this.state.reviewBody}
                onChangeText={(value) => this.handleBody(value)}
            /></Item>
            {this.state.isNull ? null :
            <Text style={{ paddingLeft: 20, paddingRight: 20, color: 'red' }}>
            {this.state.errorLength}</Text>}
                
      <TouchableOpacity accessible style={main.appButtonContainer} onPress={() => this.addreview()}>
      
      <Text style={main.appButtonText}> Add </Text>
        
      </TouchableOpacity>

      <TouchableOpacity 
      accessible style={main.appButtonContainer} onPress={() => this.cameraLaunch()}
      >
      <Text style={main.appButtonText}> Take a Photo </Text>
        
      </TouchableOpacity>
      <View>
      <View style={main.body}>
      {this.renderFileUri()}
        </View>
      </View>
      </Form>
      </View>
      </Content>
      </Container>
      
    );
  }
}
export default AddReview;
