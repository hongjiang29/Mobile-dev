/* eslint-disable no-undef */
import React, { Component } from 'react';
import { ToastAndroid, View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import StarRating from 'react-native-star-rating';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Container, Form, Header, Title, Input, Text, Button, Icon, 
         Left, Body, Right, Item, Content } from 'native-base';
import * as ImagePicker from 'react-native-image-picker';
import Filter from 'bad-words';

class EditReview extends Component {
  constructor(props) {
    super(props);
    console.log(props);
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

  componentDidMount() {
    this.getphoto();
  }

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

  editreview = async () => {
    const navigation = this.props.navigation;
    const { reviewId, locationId, overallRating, priceRating, qualityRating, clenlinessRating, 
         reviewBody, responseUrl, photo } = this.state;
    const Token = await AsyncStorage.getItem('token');
    if (reviewBody.length === 0) {
      this.setState({ error: 'Review box empty!',
                     isNull: false });
      return false;
    }

    if (responseUrl === false && photo === true) {
      this.deletePhoto();
    } else if (responseUrl && photo === false) {
      console.log(this.state.file);
      this.addPhoto();
    }
    const filter = new Filter();
    filter.addWords('tea', 'cakes', 'pastries');
    console.log(overallRating);
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


  addPhoto = async () => {
    const { locationId, reviewId } = this.state;
    console.log(reviewId);
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
          ToastAndroid.show('Photo Uploaded!', ToastAndroid.SHORT);
        } else if (res.status === 400) {
          throw Error;
        } else {
          throw Error;
        }
      })
      .catch((message) => { console.log(`error ${message}`); });
  }

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

  renderFileUri() {
    if (this.state.responseUrl) {
      return (<View><Image
        source={{ uri: this.state.responseUrl }}
        style={styles.images}
      />
        <TouchableOpacity style={styles.close} onPress={() => this.removeImage()}>
        <Icon name="ios-close-circle" size={25} />
        </TouchableOpacity>
      </View>);
    }
  }


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
            <Button transparent onPress={() => this.props.navigation.goBack()}>
              <Icon name='arrow-back' />
            </Button>
          </Left>
          <Body>
        <Title style={{ fontWeight: 'bold', fontSize: 20 }}>Edit Review</Title>
        </Body>
        <Right />
        </Header>
      <View style={styles.container}>
      <Form style={{ paddingLeft: 20, paddingRight: 20 }}>
      <Item style={{ marginTop: 20 }}>
          <Text>
          Overall Rating: {'\n'}
            <StarRating
                containerStyle={styles.review}
                starSize={25}
                disabled={false}
                maxStars={5}
                rating={this.state.overallRating}
                fullStarColor={'gold'}
                selectedStar={(rating) => this.handleOverall(rating)}
            />{'\n'}

            Price Rating: {'\n'}
              <StarRating
                containerStyle={styles.review}
                starSize={25}
                disabled={false}
                maxStars={5}
                rating={this.state.priceRating}
                fullStarColor={'gold'}
                selectedStar={(rating) => this.handlePrice(rating)}
              />{'\n'}

            Quality Rating: {'\n'}
              <StarRating
                containerStyle={styles.review}
                starSize={25}
                disabled={false}
                maxStars={5}
                rating={this.state.qualityRating}
                fullStarColor={'gold'}
                selectedStar={(rating) => this.handleQuality(rating)}
              />{'\n'}

            Clenliness Rating: {'\n'}
              <StarRating
                containerStyle={styles.review}
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
                placeholder="Review away..."
                multiline
                onChangeText={(value) => this.handleBody(value)}
                value={this.state.reviewBody}
            /></Item>
            {this.state.isNull ? null :
            <Text style={{ paddingLeft: 20, paddingRight: 20, color: 'red' }}>
              {this.state.errorLength}</Text>}
        

      <TouchableOpacity style={styles.appButtonContainer} onPress={() => this.editreview()}>
      
      <Text style={styles.appButtonText}> Edit </Text>
        
      </TouchableOpacity>

      <TouchableOpacity style={styles.appButtonContainer} onPress={() => this.cameraLaunch()}>
        <Text style={styles.appButtonText}> Take a New Photo </Text>
      </TouchableOpacity>
      <View>
      <View style={styles.body}>
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

const styles = StyleSheet.create({
  container: {
    flex: 3,
    padding: 24,
  },
  body: {
    margin: 10,
    justifyContent: 'center',
    alignItems: 'center'
  },
  close: {
    margin: 5,
    position: 'absolute',
    top: 0,
    right: 0,
    width: 25,
    height: 25,
  },
  appDeleteContainer: {
    backgroundColor: 'red',
    width: 50,
    marginTop: 10,
    elevation: 3,
    borderRadius: 10,
    padding: 5,
    margin: 10,
    alignSelf: 'center'
  },
  appButtonContainer: {
    marginTop: 20,
    elevation: 8,
    backgroundColor: '#009688',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12
  },
  appButtonText: {
    fontSize: 18,
    color: 'white',
    fontWeight: 'bold',
    alignSelf: 'center',
    textTransform: 'uppercase'
  },
  images: {
    width: 150,
    height: 150,
    borderColor: 'black',
    borderWidth: 1,
    marginHorizontal: 3
  },

});

export default EditReview;
