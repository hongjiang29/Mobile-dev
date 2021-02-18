import React, { Component } from 'react';
import { Text, TextInput, View, Button, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import StarRating from 'react-native-star-rating';
import AsyncStorage from '@react-native-async-storage/async-storage';


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
      location_id: props.route.params.loc_id
    };
  }

  editreview = async () => {
    const navigation = this.props.navigation;
    let review_id = this.state.review_id;
    let loc_id = this.state.location_id;
    let overall_rating = this.state.overall_rating;
    let price_rating = this.state.price_rating;
    let quality_rating = this.state.quality_rating;
    let clenliness_rating = this.state.clenliness_rating;
    let review_body = this.state.review_body;
    const Token = await AsyncStorage.getItem('token');
    console.log(overall_rating)
    fetch("http://10.0.2.2:3333/api/1.0.0/location/"+loc_id+"/review/"+review_id,
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
          review_body: review_body
        }),

      })
      .then ((res) => {
        if (res.status === 200)
        {
          navigation.navigate('Review');
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

  render() {
    return (
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
                onChangeText={(review_body) => this.setState({review_body})}
                value={this.state.review_body}/>
        

      <TouchableOpacity style={styles.appButtonContainer} onPress={() => this.editreview()}>
      
      <Text style={styles.appButtonText}> Edit </Text>
        
      </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 3,
    padding: 24,
  },
  appButtonContainer: {
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
  

});

export default EditReview
