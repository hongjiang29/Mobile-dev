import React, { Component } from 'react';
import { View, TouchableOpacity, ToastAndroid, FlatList, StyleSheet, StatusBar, Alert, Image, List } from 'react-native';
import { Container, Header, Input, Card, CardItem, Item, Text, Button, Icon, Left, Body, Right, Content, Thumbnail} from 'native-base';
import AsyncStorage from '@react-native-async-storage/async-storage';
import StarRating from 'react-native-star-rating';

class search_location extends Component{

  constructor(props){
    super(props);
    // the components state
    this.state = {
      isLoading: true,
      search: '',
      listData: '',
      favouritePlaces: [],
      list: [],
    };
  }

  componentDidMount() {
    this.unsubscribe = this.props.navigation.addListener('focus', () => {
      this.checkLoggedIn();
    });
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

  getData = async () => {
    const value = await AsyncStorage.getItem('token');
    return fetch("http://10.0.2.2:3333/api/1.0.0/find", 
    {
      headers: {
        'X-Authorization' : value
      },
    })
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
            isLoading: false,
            listData: responseJson
          })
          
        })
      .catch((message) => {console})
};

    search =  (text) => {
        let arrayholder = this.state.listData
        let array = []
        arrayholder.forEach(element => {
            console.log(element.location_name + element.location_town)
            if(element.location_name.toLowerCase().includes(text) || element.location_town.toLowerCase().includes(text)){
                array.push(element)
                console.log('true')
            }
            })
            this.setState({list: array})
        }

    render()  {
        if (this.state.isLoading){
          return (
  
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
              <Text>Loading..</Text>  
            </View>
          );
        } else{
        
            return (
                <Container>
                  <Header searchBar rounded>
                    <Item>
                      <Icon name="ios-search" />
                      <Input placeholder="Search" onChangeText={this.search} />
                    </Item>
                    <Button transparent>
                      <Text>Search</Text>
                    </Button>
                  </Header>
                  <FlatList
                data={this.state.list}
                renderItem={({ item }) => (
                  <TouchableOpacity onPress={() => this.props.navigation.navigate('Review', {id: item.location_id})}>
                  <Content>
                  <Card>
                    <CardItem>
                      <Left>
                        <Thumbnail source={{uri: 'https://picsum.photos/id/237/200/300'}} />
                        <Body>
                          <Text>{item.location_name}</Text>
                          <Text note>{item.location_town}</Text>
                        </Body>
                      </Left>
                    </CardItem>
                    <CardItem cardBody>
                      <Image source={{uri: 'https://picsum.photos/seed/picsum/200/300'}} style={{height: 200, width: null, flex: 1}}/>
                    </CardItem>
                    <CardItem>
                      <Body>
                      </Body>
                      <Right>
                      <Text>
                        <StarRating
                          containerStyle={styles.review}
                          starSize={25}
                          disabled={true}
                          maxStars={5}
                          rating={item.avg_overall_rating}
                          fullStarColor={'gold'}/>
                        </Text>
                      </Right>
                    </CardItem>
                    </Card>
            </Content>
                  </TouchableOpacity>
                  )}
                  
                  keyExtractor={(item,index) => item.location_id.toString()}
        /> 
                </Container>
              );
        }
        }
    }
    const styles = StyleSheet.create({
      container: {
        flex: 1,
        marginTop: StatusBar.currentHeight || 0,
      },
      appButtonText: {
        fontSize: 18,
        color: "black",
        fontWeight: "bold",
        alignSelf: "center",
        textTransform: "uppercase"
      },
      separatorLine: {
        height: 1,
        backgroundColor: 'black',
        paddingTop: 2,
      },
      items: {
        padding: 20,
        marginVertical: 8,
        marginHorizontal: 16,
      },
      text: {
        color: 'white',
        fontSize: 25
      },
    
      
    
    });
  

export default search_location