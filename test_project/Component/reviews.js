
import React, { Component,} from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity, Alert, Image } from 'react-native';
import StarRating from 'react-native-star-rating';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Container, Header, Card, CardItem, Text, Button, Icon, Left, Body, Right, Title, Subtitle} from 'native-base';

class Reviews extends Component{
  constructor(props){
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
  componentDidMount() {
    this.unsubscribe = this.props.navigation.addListener('focus', () => {
      this.checkLoggedIn();
      this.getLikes();
      this.getData();
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  checkLoggedIn = async () => {
    const value = await AsyncStorage.getItem('token');
    if (value == null) {
      this.props.navigation.navigate('Login')
    }
  }

  like = async (location_id, review_id) => {
    const value = await AsyncStorage.getItem('token');
    return fetch("http://10.0.2.2:3333/api/1.0.0/location/"+location_id+"/review/"+review_id+"/like", 
    {
      method: 'POST',
      headers: {
        'X-Authorization' : value
      },
    })
      .then ((res) => {
        if (res.status === 200)
        {
          this.getData()
          var joined = this.state.likes.concat(review_id);
          this.setState({boolPhoto: false, likes: joined })
          Alert.alert("Liked!")
        }else if (res.status === 401){
          this.props.navigation.navigate("Login")
        }
        else{
          throw 'failed';
        }
      })
};

unLike = async (location_id, review_id) => {
  const value = await AsyncStorage.getItem('token');
  return fetch("http://10.0.2.2:3333/api/1.0.0/location/"+location_id+"/review/"+review_id+"/like", 
  {
    method: 'DELETE',
    headers: {
      'X-Authorization' : value
    },
  })
    .then ((res) => {
      if (res.status === 200)
      {
        this.getData()
        const array = [...this.state.likes]; // make a separate copy of the array
        const index = array.indexOf(review_id)
        if (index !== -1) {
          array.splice(index, 1);
          this.setState({boolPhoto: false, likes: array});
      }
        Alert.alert("Unliked!")
      }else if (res.status === 401){
        this.props.navigation.navigate("Login")
      }
      else{
        throw 'failed';
      }
    })
};

  getLikes = async () => {
    const userId = await AsyncStorage.getItem('id');
    const value = await AsyncStorage.getItem('token');
    return fetch("http://10.0.2.2:3333/api/1.0.0/user/"+userId,{
      method: "GET",
      headers: {
      'X-Authorization' : value
    },
  })
      .then ((res) => {
        if (res.status === 200)
        {
          console.log('getlikes')
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
        const likes = (responseJson.liked_reviews);
        const array_likes = [...this.state.likes];
        const array_reviews = [...this.state.myReviews];
        const myReviews = (responseJson.reviews);

        likes.forEach(element => {
          array_likes.push(element.review.review_id)
    })
        myReviews.forEach(element => {
          array_reviews.push(element.review.review_id)
    })
        this.setState({
          likes: array_likes,
          myReviews:array_reviews
        })

        })
};
  
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
        const array_id = [...this.state.location_ids]
        const myReviews = (responseJson.location_reviews);
        myReviews.forEach(element => {
          array_id.push(element.review_id)
    })
          this.setState({
            location_ids: array_id,
            listData: responseJson,
          })
          if(this.state.boolPhoto){
          this.getphoto()}
        })
};

getphoto = async () => {
  const value = await AsyncStorage.getItem('token');
  let array = this.state.location_ids
  let loc_id = this.state.params
  let photos = {}
  array.forEach(element => {
  fetch("http://10.0.2.2:3333/api/1.0.0/location/"+loc_id+"/review/"+element+"/photo",{
    method: "GET",
    headers: {
    'X-Authorization' : value
  },
})
    .then ((res) => {
      if (res.status === 200)
      {
        return res.url;
      }else if (res.status === 401){
        console.log('error')
      }
      else if (res.status === 404){
       console.log('missing')
      } else{
        console.log('forbidden')
      }
    }).then((response) => {
      if (typeof(response) === 'undefined') {
        return false
      }else{
      console.log('success')
      photos[element] = response+ "?time=" + new Date()}
    })
  })
  this.setState({photo: photos,
    isLoading: false}) 
    
  }


  renderFileUri (review_id) {
    if (this.state.photo[review_id]){
    return <Image source={{uri: this.state.photo[review_id]}} style={{height: 200, width: null, flex: 1}}/>}
    else{
      return <Image/>
    }
    }

deleteReview = async (location_id, review_id) => {
  const value = await AsyncStorage.getItem('token');
  return fetch("http://10.0.2.2:3333/api/1.0.0/location/"+location_id+"/review/"+review_id, 
  {
    method: 'DELETE',
    headers: {
      'X-Authorization' : value
    },
  })
    .then ((res) => {
      if (res.status === 200)
      {
        this.getData()
        Alert.alert("Deleted!")
      }else if (res.status === 401){
        this.props.navigation.navigate("Review")
      }
      else{
        throw 'failed';
      }
    })
};

  checkLikes(review_id){
    if (this.state.likes.includes(review_id)) {
      return true
    } else {
      return false
    }
  }

  checkReviews(review_id){
    if (this.state.myReviews.includes(review_id)) {
      return true
    } else {
      return false
    }
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

  renderLikeButton = (item) => {
    let bool = this.checkLikes(item.review_id)
    let id = this.state.params;
    if (bool == true) {
    return <Button transparent onPress={() => this.unLike(id, item.review_id)}>
            <Icon active name="thumbs-up" />
            <Text>{item.likes}</Text>
          </Button>
  } else {
    return <Button transparent onPress={() => this.like(id, item.review_id)}>
            <Icon active name="thumbs-up-outline" />
            <Text>{item.likes}</Text>
          </Button>
  }
}

  renderEditButton = (item, loc_id) => {
    let bool = this.checkReviews(item.review_id)
    if (bool == true) {
    return <Button transparent onPress={() => this.props.navigation.navigate('EditReview', {review: item, loc_id: loc_id})}>
            <Icon active name="md-hammer" /> 
            <Text>Edit</Text>
          </Button>
  }
}

  renderDeleteButton = (review_id) => {
    let bool = this.checkReviews(review_id)
    let id = this.state.params;
    if (bool == true) {
    return <Button rounded danger onPress={() => this.deleteReview(id, review_id)}>
            <Text>Delete</Text>
          </Button>
  }
  }
    render(){
        
        if (this.state.isLoading){
            return (
              <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <Text>Loading..</Text>  
              </View>
            );
          } else{
            const item_first = this.state.listData
            const loc_id = item_first.location_id
        return (
          
          <Container>
            <Header>
            <Left>
            <Button transparent onPress={() => this.props.navigation.navigate('Home')}>
              <Icon name='arrow-back' />
            </Button>
              </Left>
              <Body>
              <Title style={{fontWeight:'bold', fontSize:20}}>{item_first.location_name}</Title>
              <Subtitle>{item_first.location_town}</Subtitle>
              </Body>
              <Right>
              <TouchableOpacity style={styles.appButtonContainer} onPress={() => this.props.navigation.navigate("AddReview", {id: this.state.params})}>
                    
              <Text style={styles.appButtonText}> + </Text>
                
              </TouchableOpacity>
              
              </Right>
           </Header>
                <Card>

                  <CardItem cardBody>
                    <Left>
                      <Text>
                      Price Rating:
                      {this.starRating(item_first.avg_price_rating)}  
                    </Text>
                    </Left>
                    <Body>
                      <Text>
                        Quality Rating:     
                        {this.starRating(item_first.avg_quality_rating)}
                      </Text>
                    </Body>
                    <Right>
                        <Text>Hygiene Rating:
                        {this.starRating(item_first.avg_clenliness_rating)}
                    </Text>
                    </Right>
                  </CardItem>
                    </Card>
                    <Text style={{left: 30,top: 5, fontWeight: "bold", paddingBottom:10}}>Reviews: </Text>
                    <FlatList
                    data = {item_first.location_reviews}
                    renderItem={({ item }) => (
                      <Card>
                      <CardItem>
                        <Left></Left>
                        <Body>
                        <Text style={styles.text, {fontWeight:'bold'}}>
                          Overall Rating: {"\n"}
                          {this.starRating(item.overall_rating)}
                          </Text>
                        </Body>
                        <Right></Right>
                        </CardItem>  
                    <CardItem>
                      <Left>

                    <Text style={styles.textrating}>

                      Price Rating: {"\n"}
                      {this.starRating(item.price_rating)}
                      </Text>
                      </Left>

                      <Body>
                      <Text style={styles.textrating}>
                      Quality Rating: {"\n"}
                      {this.starRating(item.quality_rating)}
                      </Text>
                      </Body>

                      <Right>
                      <Text style={styles.textrating}>
                      Clenliness Rating: {"\n"}
                      {this.starRating(item.clenliness_rating)}
                      </Text>
                      </Right>
                      
                    </CardItem>
                    <CardItem cardBody>
                      {this.renderFileUri(item.review_id)}
                    </CardItem>
                    <CardItem>
                    <Text style={styles.text}>
                      Comment: {item.review_body}{"\n"}</Text>
                    </CardItem>
                    <CardItem>
                      <Left>
                        {this.renderLikeButton(item)}
                      </Left>
                      <Body>
                      {this.renderDeleteButton(item.review_id)}
                      </Body>
                      <Right>
                      {this.renderEditButton(item, loc_id)}
                      </Right>
                    </CardItem>
                    </Card>
                    )}
                    keyExtractor={(item,index) => item.review_id.toString()}
                    /> 
                </Container>
          );
        }
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
      textrating:{
          fontSize: 12,
          fontWeight:'bold'
      },

      container: {
        flex: 1,
        padding: 10,
      },  
      appButtonContainer: {
        width: 50,
        marginTop: 10,
        elevation: 3,
        backgroundColor: "#009688",
        borderRadius: 10,
        padding: 5,
        margin: 10,
      },
      
      appButtonText: {
        fontSize: 18,
        color: "white",
        fontWeight: "bold",
        alignSelf: "center",
        textTransform: "uppercase"
      },
    })

export default Reviews