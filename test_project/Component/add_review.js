import React, { Component } from 'react';
import { Text, TextInput, View, Image, StyleSheet, Alert, ScrollView, TouchableOpacity, StatusBar, SafeAreaView} from 'react-native';
import { Container, Content, Header } from 'native-base';
import StarRating from 'react-native-star-rating';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'react-native-image-picker';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import Filter from 'bad-words';


class AddReview extends Component {
  constructor(props){
    super(props);

    this.state = {
      overall_rating: 5,
      price_rating: 5,
      quality_rating: 5,
      clenliness_rating: 5,
      review_body: '',
      params: props.route.params.id,
      image: false,
      listData: [],
      file: {},
      fileUri: ''
    };
  }

  cameraLaunch = () => {
    let options = {
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

getData = async () => {
  let id = this.state.params;
  console.log(id)
  return fetch("http://10.0.2.2:3333/api/1.0.0/location/"+id)
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
          listData: responseJson.location_reviews[responseJson.location_reviews.length - 1]
        })
        this.addPhoto()
      })
};

  addreview = async () => {
    const navigation = this.props.navigation;
    let id = this.state.params;
    let overall_rating = this.state.overall_rating;
    let price_rating = this.state.price_rating;
    let quality_rating = this.state.quality_rating;
    let clenliness_rating = this.state.clenliness_rating;
    let review_body = this.state.review_body;
    var Filter = require('bad-words'),
    filter = new Filter();
    filter.addWords('tea', 'cakes', 'pastries');
    const Token = await AsyncStorage.getItem('token');
    console.log(overall_rating)
    fetch("http://10.0.2.2:3333/api/1.0.0/location/"+id+"/review",
      {
        method: 'post',
        headers: {
          'X-Authorization' : Token,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          overall_rating: overall_rating,
          price_rating: price_rating,
          quality_rating: quality_rating,
          clenliness_rating: clenliness_rating,
          review_body: filter.clean(review_body)
        }),

      })
      .then ((res) => {
        if (res.status === 201)
        {
          if (this.state.fileUri){
            console.log('hi2')
            this.getData()
          }else{
          navigation.navigate('Review')}
        }else if (res.status === 400){
          throw 'Validation';
        }
        else{
          throw 'failed';
        };
      })
      .catch((message) => {console.log("error" + message)})
  }

  addPhoto = async () => {
    console.log('hi3')
    const navigation = this.props.navigation;
    let id = this.state.params;
    let review_id = this.state.listData.review_id;
    console.log(review_id)
    const Token = await AsyncStorage.getItem('token');
    fetch("http://10.0.2.2:3333/api/1.0.0/location/"+id+"/review/"+review_id+"/photo",
      {
        method: 'post',
        headers: {
          'X-Authorization' : Token,
          "Content-Type": "image/jpeg"
        },
        body: this.state.file
        })
      .then ((res) => {
        if (res.status === 200)
        {
          Alert.alert("hello photo uploaded")
          navigation.navigate('Review');
        }else if (res.status === 400){
          throw 'Validation';
        }
        else{
          throw 'failed';
        };
      })
      .catch((message) => {console.log("error" + message)})
  }

  handleOverall = (rating) => {
    this.setState({overall_rating: rating})
  }
  handlePrice = (rating) => {
    this.setState({price_rating: rating})
  }

  handleQuality = (rating) => {
    this.setState({quality_rating: rating})
  }

  handleCleniness = (rating) => {
    this.setState({clenliness_rating: rating})
  }

  handleBody = (text) => {
    this.setState({review_body: text})
  }

  renderFileUri() {
    if (this.state.fileUri) {
      console.log('hello')
      return <View><Image
        source={{ uri: this.state.fileUri }}
        style={styles.images}/>
        <TouchableOpacity style={styles.appDeleteContainer} onPress={() => this.removeImage()}>
        <Text style={styles.appButtonText}> X </Text>
      </TouchableOpacity>
      </View>
    } else {
      return <Image
        source={require('../assets/dummy.png')}
        style={styles.images}
      />
    }
  }
  removeImage = () => {
      this.setState({fileUri: false})
  }

  render() {
    return (
      <Container>
        <Header/>
        <Content>
      <View style={styles.container}>
          <Text>
          Overall Rating: {"\n"}
            <StarRating
                containerStyle={styles.review}
                starSize={25}
                disabled={false}
                maxStars={5}
                rating={this.state.overall_rating}
                fullStarColor={'gold'}
                selectedStar={(rating) => this.handleOverall(rating)}/>{"\n"}

            Price Rating: {"\n"}
              <StarRating
                containerStyle={styles.review}
                starSize={25}
                disabled={false}
                maxStars={5}
                rating={this.state.price_rating}
                fullStarColor={'gold'}
                selectedStar={(rating) => this.handlePrice(rating)}/>{"\n"}

            Quality Rating: {"\n"}
              <StarRating
                containerStyle={styles.review}
                starSize={25}
                disabled={false}
                maxStars={5}
                rating={this.state.quality_rating}
                fullStarColor={'gold'}
                selectedStar={(rating) => this.handleQuality(rating)}/>{"\n"}

            Clenliness Rating: {"\n"}
              <StarRating
                containerStyle={styles.review}
                starSize={25}
                disabled={false}
                maxStars={5}
                rating={this.state.clenliness_rating}
                fullStarColor={'gold'}
                selectedStar={(rating) => this.handleCleniness(rating)}/>{"\n"}
            </Text>
            <Text>
            Review/Comment: {"\n"}
            </Text>
            <TextInput
                placeholder="Review away..."
                multiline={true}
                numberOfLines={1}
                value={this.state.review_body}
                onChangeText={(value) => this.handleBody(value)}/>
                
        

      <TouchableOpacity style={styles.appButtonContainer} onPress={() => this.addreview()}>
      
      <Text style={styles.appButtonText}> Add </Text>
        
      </TouchableOpacity>

      <TouchableOpacity style={styles.appButtonContainer} onPress={() => this.cameraLaunch()}>
      
      <Text style={styles.appButtonText}> Take a Photo </Text>
        
      </TouchableOpacity>
      <View>
      <View style={styles.body}>
      {this.renderFileUri()}
        </View>
      </View>
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
  appDeleteContainer: {
    marginTop: 10,
    elevation: 8,
    backgroundColor: "red",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12
  },
  appButtonContainer: {
    marginTop: 10,
    elevation: 8,
    backgroundColor: "#009688",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12
  },
  appButtonText: {
    fontSize: 18,
    color: "white",
    fontWeight: "bold",
    alignSelf: "center",
    textTransform: "uppercase"
  },
  scrollView: {
    backgroundColor: Colors.lighter,
  },

  body: {
    margin: 10,
    justifyContent: 'center',
    alignItems: 'center'

  },
  ImageSections: {
    display: 'flex',
    flexDirection: 'row',
    paddingHorizontal: 8,
    paddingVertical: 8,
    justifyContent: 'center'
  },
  images: {
    width: 150,
    height: 150,
    borderColor: 'black',
    borderWidth: 1,
    marginHorizontal: 3
  },
  

});

export default AddReview
