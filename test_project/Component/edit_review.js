import React, { Component } from 'react';
import { TextInput, View, StyleSheet, Alert, TouchableOpacity, Image } from 'react-native';
import StarRating from 'react-native-star-rating';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Container, Form, Header, Title, CardItem, Input, Text, Button, Icon, Left, Body, Right, Item, Content } from 'native-base';
import * as ImagePicker from 'react-native-image-picker';


class EditReview extends Component {
  constructor(props){
    super(props);
    console.log(props)
    this.state = {
      overall_rating: props.route.params.review.overall_rating,
      price_rating: props.route.params.review.price_rating,
      quality_rating: props.route.params.review.quality_rating,
      clenliness_rating: props.route.params.review.clenliness_rating,
      review_body: props.route.params.review.review_body,
      review_id: props.route.params.review.review_id,
      location_id: props.route.params.loc_id,
      isNull: true,
      response_url: '',
      error:'',
      file: {},
      photo: false,
      isloading: true
    };
  }

  componentDidMount() {
    this.unsubscribe = this.props.navigation.addListener('focus', () => {
      this.getphoto();
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  editreview = async () => {
    const navigation = this.props.navigation;
    let {review_id, location_id, overall_rating, price_rating, quality_rating, clenliness_rating, review_body, response_url, photo} = this.state;
    const Token = await AsyncStorage.getItem('token');
    if (review_body.length == 0){
      this.setState({error: 'Review box empty!',
                     isNull: false})
      return false
    }
    if (response_url == false && photo == true){
      this.deletePhoto()
    } else if (this.state.file != ""){
      this.addPhoto()
    }
    var Filter = require('bad-words'),
    filter = new Filter();
    filter.addWords('tea', 'cakes', 'pastries');
    console.log(overall_rating)
    return fetch("http://10.0.2.2:3333/api/1.0.0/location/"+location_id+"/review/"+review_id,
      {
        method: 'patch',
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
        if (res.status === 200)
        {
          navigation.push('Review', {id: location_id});
          return res.json();
        }else if (res.status === 400){
          throw 'Validation';
        }
        else{
          throw 'failed';
        };
      })
      .then ((responseJson) => {
        console.log(responseJson);
      })
      .catch((message) => {console.log("error" + message)})
  }


  addPhoto = async () => {
    let {location_id, review_id} = this.state;
    console.log(review_id)
    const Token = await AsyncStorage.getItem('token');
    return fetch("http://10.0.2.2:3333/api/1.0.0/location/"+location_id+"/review/"+review_id+"/photo",
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
        }else if (res.status === 400){
          throw 'Validation';
        }
        else{
          throw 'failed';
        };
      })
      .catch((message) => {console.log("error" + message)})
  }

  deletePhoto = async () => {
    const value = await AsyncStorage.getItem('token');
    let {review_id, location_id} = this.state;
    return fetch("http://10.0.2.2:3333/api/1.0.0/location/"+location_id+"/review/"+review_id+"/photo", 
    {
      method: 'DELETE',
      headers: {
        'X-Authorization' : value
      },
    })
      .then ((res) => {
        if (res.status === 200)
        {
        }else if (res.status === 401){
          this.props.navigation.navigate("Review")
        }
        else{
          throw 'failed';
        }
      })
  };

  getphoto = async () => {
  const value = await AsyncStorage.getItem('token');
  let {review_id, location_id} = this.state;
 
  return fetch("http://10.0.2.2:3333/api/1.0.0/location/"+location_id+"/review/"+review_id+"/photo",{
    method: "GET",
    headers: {
    'X-Authorization' : value
  },
})
    .then ((res) => {
      if (res.status === 200)
      {
        console.log('success')
        this.setState({isloading: false, photo:true, response_url: res.url+ "?time=" + new Date()})
        
      }else if (res.status === 401){
        console.log('error')
      }
      else if (res.status === 404){
       console.log('missing')
       this.setState({photo:false, isloading: false})

      } else{
        console.log('forbidden')
      }
    })
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
          response_url: response.uri
        });
      }
    });
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
  removeImage = () => {
    this.setState({response_url: false})
}
  
  starRating(rating) {
    return <StarRating
              containerStyle={styles.review}
              starSize={20}
              disabled={true}
              maxStars={5}
              rating={rating}
              fullStarColor={'gold'}/>
  }

  renderFileUri() {
    if (this.state.response_url) {
      console.log('hello')
      return <View><Image
        source={{ uri: this.state.response_url }}
        style={styles.images}/>
        <TouchableOpacity style={styles.close} onPress={() => this.removeImage()}>
        <Icon name="ios-close-circle" size={25} />
        </TouchableOpacity>
      </View>
    } else {
    }
  }


  render() {
    if (this.state.isloading){
      return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text>Loading..</Text>  
        </View>
      )
    } else{
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
        <Title style={{fontWeight:'bold', fontSize:20}}>Edit Review</Title>
        </Body>
        <Right></Right>
        </Header>
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
            </Text>
            </Item>
            <Item>
            <Input
                placeholder="Review away..."
                multiline={true}
                onChangeText={(value) =>this.handleBody(value)}
                value={this.state.review_body}/></Item>
            {this.state.isNull ? null :
            <Text style={{paddingLeft: 20, paddingRight:20, color:'red'}}>{this.state.errorLength}</Text>}
        

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
    position: "absolute",
    top: 0,
    right: 0,
    width: 25,
    height: 25,
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
    marginTop:20,
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
  images: {
    width: 150,
    height: 150,
    borderColor: 'black',
    borderWidth: 1,
    marginHorizontal: 3
  },

});

export default EditReview
