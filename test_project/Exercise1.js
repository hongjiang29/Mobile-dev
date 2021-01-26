import React, { Component } from 'react';
import { TextInput, Text, Button, View, FlatList, TouchableOpacity } from 'react-native';
import { Container } from 'native-base';


class ToDoApp extends Component {

  constructor(props){
    super(props);

    // the components state
    this.state = {
      text: '',
      list_items: []
    };

    this.add = this.add.bind(this);
    this.remove = this.remove.bind(this);
  }

  // add a new element to the list (whatever is stored in the text value) and
  // then reset the text value to null
  add = (text) => {
    if(text.trim().length > 0){
      this.setState(

        prevState => {
          let { list_items } = prevState;
          // alert(list_items);
          return({
            list_items: list_items.concat(text),
            text: ""
          });
        }
      );
    }
  }

  // remove the i'th element of the list
  remove = (i) => {
    this.setState(
      prevState => {
        let list_items = prevState.list_items.slice();

        list_items.splice(i, 1);

        return { list_items };
      }
    );
  }

  // sets the text value in the state
  handleInput = (text) => {
    this.setState({text: text})
  }

  render(){
    return (
      <View>
        <TextInput placeholder="ToDo..." onChangeText={this.handleInput} value={this.state.text} />
        <TouchableOpacity
           onPress = {
              () => this.add(this.state.text)
           }>
           <Text> Add </Text>
        </TouchableOpacity>
        <FlatList
          data={this.state.list_items}
          renderItem={({ item, index }) =>
            <Container>
            <Text>{item}</Text>
            <TouchableOpacity onPress={() => this.remove(index)}>
               <Text> Done </Text>
            </TouchableOpacity>
            </Container>
          }
        />
      </View>
    );
  }
}

export default ToDoApp