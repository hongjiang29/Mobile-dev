import React, { Component } from 'react';
import { TextInput, View, Image, StyleSheet, Alert, ScrollView, TouchableOpacity, StatusBar, SafeAreaView} from 'react-native';
import { Container, Form, Header, Title, CardItem, Item, Input, Text, Button, Icon, Left, Body, Right, Content } from 'native-base';
import StarRating from 'react-native-star-rating';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'react-native-image-picker';
import {Colors} from 'react-native/Libraries/NewAppScreen';


class AddReview extends Component {
  constructor(props){
    super(props);

    this.state = {
      overall_rating: 0,
      price_rating: 0,
      quality_rating: 0,
      clenliness_rating: 0,
      review_body: '',
      params: props.route.params.id,
      image: false,
      listData: [],
      file: {},
      isNull: true,
      fileUri: '',
      errorLength: '',
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
    let {overall_rating, price_rating, quality_rating, clenliness_rating, review_body} = this.state;
  
    if (overall_rating == 0 || price_rating == 0 || quality_rating == 0 || clenliness_rating == 0 || review_body.length == 0){
      this.setState({errorLength: 'One of the ratings or review box is empty!',
                     isNull: false})
      return false
    }

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
          navigation.push('Review', {id: id});
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
    this.setState({isNull: true,
                   overall_rating: rating})
  }
  handlePrice = (rating) => {
    this.setState({isNull: true,
                   price_rating: rating})
  }

  handleQuality = (rating) => {
    this.setState({isNull: true,
                   quality_rating: rating})
  }

  handleCleniness = (rating) => {
    this.setState({isNull: true,
                   clenliness_rating: rating})
  }

  handleBody = (text) => {
    this.setState({isNull: true,
                   review_body: text})
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
        <Header>
            <Left>
            <Button transparent onPress={() => this.props.navigation.goBack()}>
              <Icon name='arrow-back' />
            </Button>
              </Left>
              <Body>
              <Title style={{fontWeight:'bold', fontSize:20}}>Add Review</Title>

              </Body>
              <Right>
              </Right>
           </Header>
        <Content>
      <View style={styles.container}>
      <Form style={{paddingLeft: 20, paddingRight:20}}>
      <Item style={{marginTop:20}}>
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
            </Item>
            <Item style={{marginTop:20}}>
            <Text>
            Review/Comment: {"\n"}
            </Text></Item>
            <Item>
            <Input
                placeholder="Review away..."
                multiline={true}
                value={this.state.review_body}
                onChangeText={(value) => this.handleBody(value)}/></Item>

            {this.state.isNull ? null :
            <Text style={{paddingLeft: 20, paddingRight:20, color:'red'}}>{this.state.errorLength}</Text>}
                
        

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
  appDeleteContainer: {
    backgroundColor: "red",
    width: 50,
    marginTop: 10,
    elevation: 3,
    borderRadius: 10,
    padding: 5,
    margin: 10,
    alignSelf: 'center'
  },
  appButtonContainer: {
    marginTop: 10,
    elevation: 8,
    backgroundColor: "#009688",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
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
