
import React, { Component } from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import StarRating from 'react-native-star-rating';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Container, Header, Card, CardItem, Text, Button, Icon, Left, Body, Right } from 'native-base';

class Reviews extends Component{
  constructor(props){
    super(props);

    // the components state
    this.state = {
        isLoading: true,
        listData: '',
        likes: [],
        myReviews: [],
        params: props.route.params.id
    };
  }

  componentDidMount() {
    this.unsubscribe = this.props.navigation.addListener('focus', () => {
      this.checkLoggedIn();
    });
    this.getLikes();
    this.getData();
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
          var joined = this.state.likes.concat(review_id);
          this.setState({ likes: joined })
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
        const array = [...this.state.likes]; // make a separate copy of the array
        const index = array.indexOf(review_id)
        if (index !== -1) {
          array.splice(index, 1);
          this.setState({likes: array});
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
        console.log(responseJson)

        likes.forEach(element => {
          array_likes.push(element.review.review_id)
    })

        myReviews.forEach(element => {
          array_reviews.push(element.review.review_id)
    })

    this.setState({
      isLoading: false,
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
          this.setState({
            listData: responseJson
          })
        })
};

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
        const array = [...this.state.myReviews]; // make a separate copy of the array
        const index = array.indexOf(review_id)
        if (index !== -1) {
          array.splice(index, 1);
          this.setState({myReviews: array});
        }
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

  renderLikeButton = (review_id) => {
    let bool = this.checkLikes(review_id)
    let id = this.state.params;
    console.log(id)
    if (bool == true) {
    return <Button transparent onPress={() => this.unLike(id, review_id)}>
            <Icon active name="thumbs-up" />
            <Text>unlike</Text>
          </Button>
  } else {
    return <Button transparent onPress={() => this.like(id, review_id)}>
            <Icon active name="thumbs-up-outline" />
            <Text>like</Text>
          </Button>
  }
}

  renderEditButton = (review_id) => {
    let bool = this.checkReviews(review_id)
    let id = this.state.params;
    if (bool == true) {
    return <Button transparent onPress={() => this.unLike(id, review_id)}>
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
            const item = this.state.listData
        return (
          <Container>
            <Header>
              <Right>
              <TouchableOpacity style={styles.appButtonContainer} onPress={() => this.props.navigation.navigate("AddReview", {id: this.state.params})}>
                    
              <Text style={styles.appButtonText}> Add Review </Text>
                
              </TouchableOpacity>
              
              </Right>
           </Header>
                <Card>
                  <CardItem>
                    <Left></Left>
                      <Body>
                        <Text >{item.location_name}</Text>
                        <Text note>{item.location_town}</Text>
                      </Body>
                    <Right></Right>
                  </CardItem>

                  <CardItem cardBody>
                    <Left>
                      <Text>
                      Price Rating:
                      {this.starRating(item.avg_price_rating)}  
                    </Text>
                    </Left>
                    <Body>
                      <Text>
                        Quality Rating:     
                        {this.starRating(item.avg_quality_rating)}
                      </Text>
                    </Body>
                    <Right>
                        <Text>Hygiene Rating:
                        {this.starRating(item.avg_clenliness_rating)}
                    </Text>
                    </Right>
                  </CardItem>
                    </Card>
                    <Text style={{left: 30,top: 5, fontWeight: "bold", paddingBottom:10}}>Reviews: </Text>
                    <FlatList
                    data = {item.location_reviews}
                    renderItem={({ item }) => (
                      <Card>
                    <CardItem>
                    <Text style={styles.text}>
                     
                      Overall Rating: {"\n"}
                      {this.starRating(item.overall_rating)}
                      {"\n"}

                      Price Rating: {"\n"}
                      {this.starRating(item.price_rating)}
                      {"\n"}

                      Quality Rating: {"\n"}
                      {this.starRating(item.quality_rating)}
                      {"\n"}

                      Clenliness Rating: {"\n"}
                      {this.starRating(item.clenliness_rating)}
                      {"\n"}
                      {"\n"}
                      Comment: {item.review_body}{"\n"}
                      </Text>
                    </CardItem>
                    <CardItem>
                      <Left>
                        {this.renderLikeButton(item.review_id)}
                      </Left>
                      <Body>
                      {this.renderDeleteButton(item.review_id)}
                      </Body>
                      <Right>
                      {this.renderEditButton(item.review_id)}
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
      text: {
        
      },
      container: {
        flex: 1,
        padding: 10,
      },  
      appButtonContainer: {
        flex: 1,
        marginTop: 10,
        elevation: 8,
        backgroundColor: "#009688",
        borderRadius: 10,
        padding: 5,
        margin: 10,
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
    })

export default Reviews