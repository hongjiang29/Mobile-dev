/* eslint-disable no-undef */
//Imported my required packages
import React, { Component } from 'react';
import { ToastAndroid, View, TouchableOpacity, Image } from 'react-native';
import StarRating from 'react-native-star-rating';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Container, Form, Header, Title, Input, Text, Button, Icon, 
         Left, Body, Right, Item, Content } from 'native-base';
import * as ImagePicker from 'react-native-image-picker';
import Filter from 'bad-words';
import { editReview, main } from '../css/styles';

class EditReview extends Component {
  constructor(props) {
    super(props);
    //State variables initialised
    this.state = {
      overallRating: props.route.params.review.overall_rating,
      priceRating: props.route.params.review.price_rating,
      qualityRating: props.route.params.review.quality_rating,
      clenlinessRating: props.route.params.review.clenliness_rating,
      reviewBody: props.route.params.review.review_body,
      reviewId: props.route.params.review.review_id,
      locationId: props.route.params.loc_id,
      isNull: true,
      responseUrl: '',
      error: '',
      file: {},
      photo: false,
      isloading: true
    };
  }

  //get the photo before anything is rendered
  componentDidMount() {
    this.getphoto();
  }

  //Sends a request to retieve the photo to the coresponding review
  getphoto = async () => {
    const value = await AsyncStorage.getItem('token');
    const { reviewId, locationId } = this.state;
   
    return fetch(`http://10.0.2.2:3333/api/1.0.0/location/${locationId}/review/${reviewId}/photo`, {
      method: 'GET',
      headers: {
      'X-Authorization': value
    },
  })
      .then((res) => {
        if (res.status === 200) {
          console.log('success');
          //state logs the image for rendering and sets some state variables for later usage
          this.setState({ 
            isloading: false, photo: true, responseUrl: `${res.url}?time=${new Date()}` });
        } else if (res.status === 401) {
          console.log('error');
        } else if (res.status === 404) {
         console.log('missing');
         this.setState({ photo: false, isloading: false });
        } else {
          console.log('forbidden');
        }
      });
    }
  
  //POST request to update the review
  editreview = async () => {
    const navigation = this.props.navigation;
    const { reviewId, locationId, overallRating, priceRating, qualityRating, clenlinessRating, 
         reviewBody, responseUrl, photo } = this.state;
    const Token = await AsyncStorage.getItem('token');
    //checking if any body is null
    if (reviewBody.length === 0) {
      this.setState({ error: 'Review box empty!',
                     isNull: false });
      return false;
    }
    //validates whether the user wants to delete or add a photo to the review
    if (responseUrl === false && photo === true) {
      this.deletePhoto();
    } else if (responseUrl && photo === false) {
      this.addPhoto();
    }
    //Extension task with the filtered out words
    const filter = new Filter();
    filter.addWords('tea', 'cakes', 'pastries');
    return fetch(`http://10.0.2.2:3333/api/1.0.0/location/${locationId}/review/${reviewId}`,
      {
        method: 'patch',
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
        if (res.status === 200) {
          ToastAndroid.show('Review Edited!', ToastAndroid.SHORT);
          navigation.push('Review', { id: locationId });
          return res.json();
        } else if (res.status === 400) {
          throw Error;
        } else {
          throw Error;
        }
      })
      .then((responseJson) => {
        console.log(responseJson);
      })
      .catch((message) => { console.log(`error ${message}`); });
  }

  // POST request to add a photo to the review
  addPhoto = async () => {
    const { locationId, reviewId } = this.state;
    const Token = await AsyncStorage.getItem('token');
    return fetch(`http://10.0.2.2:3333/api/1.0.0/location/${locationId}/review/${reviewId}/photo`,
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
          console.log('Photo Uploaded!');
        } else if (res.status === 400) {
          throw Error;
        } else {
          throw Error;
        }
      })
      .catch((message) => { console.log(`error ${message}`); });
  }

  // This function is called when the user leaves the image box blank
  deletePhoto = async () => {
    const value = await AsyncStorage.getItem('token');
    const { reviewId, locationId } = this.state;
    return fetch(`http://10.0.2.2:3333/api/1.0.0/location/${locationId}/review/${reviewId}/photo`, 
    {
      method: 'DELETE',
      headers: {
        'X-Authorization': value
      },
    })
      .then((res) => {
        if (res.status === 200) {
          console.log(res);
        } else if (res.status === 401) {
          this.props.navigation.navigate('Review');
        } else {
          throw error;
        }
      }).catch((message) => { console.log(`error ${message}`); });
  };

  // Opens the camera if the user wants to take an image
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
          responseUrl: response.uri,
          photo: false
        });
      }
    });
}
  // Recievieving string from input box to get current value from user 
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
    this.setState({ responseUrl: false });
}
  // Template for rendering the star rating system
  starRating(rating) {
    return (<StarRating
              containerStyle={main.review}
              starSize={20}
              disabled
              maxStars={5}
              rating={rating}
              fullStarColor={'gold'}
    />);
  }
  // function to render the image if it exists
  renderFileUri() {
    if (this.state.responseUrl) {
      return (<View><Image
        source={{ uri: this.state.responseUrl }}
        style={main.images}
      />
        <TouchableOpacity accessible style={editReview.close} onPress={() => this.removeImage()}>
        <Icon name="ios-close-circle" size={25} />
        </TouchableOpacity>
      </View>);
    }
  }

  // here is where all the magic happens
  render() {
    if (this.state.isloading) {
      return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text>Loading..</Text>  
        </View>
      );
    }
    return (
      <Container>
        <Content>
      <Header>
        <Left>
            <Button 
            accessibilityHint='Click here to return to the reviews list' 
            transparent onPress={() => this.props.navigation.goBack()}
            >
              <Icon name='arrow-back' />
            </Button>
          </Left>
          <Body>
        <Title style={{ fontWeight: 'bold', fontSize: 20 }}>Edit Review</Title>
        </Body>
        <Right />
        </Header>
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
            </Text>
            </Item>
            <Item>
            <Input
                accessibilityLabel='Edit the existing review body'
                placeholder="Review away..."
                multiline
                onChangeText={(value) => this.handleBody(value)}
                value={this.state.reviewBody}
            /></Item>
            {this.state.isNull ? null :
            <Text style={{ paddingLeft: 20, paddingRight: 20, color: 'red' }}>
              {this.state.errorLength}</Text>}
        

      <TouchableOpacity 
      accessible style={main.appButtonContainer} onPress={() => this.editreview()}
      >
      
      <Text style={main.appButtonText}> Edit </Text>
        
      </TouchableOpacity>

      <TouchableOpacity
      accessible style={main.appButtonContainer} onPress={() => this.cameraLaunch()}
      >
        <Text style={main.appButtonText}> Take a New Photo </Text>
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
export default EditReview;
