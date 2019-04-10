import React from "react";
import {View, Text, FlatList} from "react-native";
import {Toolbar} from 'react-native-material-ui';
import { Constants } from 'expo';

export default class Menu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      text: '',
      data: [],
      search_data: []
    };
   
    this.renderHeader = this.renderHeader.bind(this);
  }

  componentWillMount() {
    fetch('https://book-recommender0.herokuapp.com/title', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })
      .then(res => res.json())
      .then(data => {
        for(let i in data.data) this.state.data.push(data.data[i].label);
      })
  }

  renderHeader() {
    return (
      <Toolbar
          leftElement="menu"
          centerElement="BookRecommender"
          searchable={{
            autoFocus: true,
            placeholder: 'Buscar Libro...',
            onChangeText: (text) => {
              if(text.trim().length == 0) this.setState({ search_data: [] });
              else this.setState({ text: text, search_data: this.state.data.filter(key => key.toUpperCase() !== '' && key.toUpperCase().indexOf(text.toUpperCase()) !== -1) });
            },
            onSearchClosed: () => this.setState({ search_data: [] })
          }}
          rightElement={['home']}
          onRightElementPress={ () => this.props.navigation.navigate('Home')}
          onLeftElementPress={() => this.props.navigation.openDrawer({ navigation: this.props.navigation })}
        />
    )
  }

  onSelectItem(isbn) {
    if(this.props.onUpdate == undefined) this.props.navigation.navigate('BookDetails', { isbn: isbn });
    else {
      this.props.onUpdate(isbn);
      this.setState({ search_data: [] });
    }
  }

  render() {
    return (
      <View>
        <FlatList
          style={{ marginTop: Constants.statusBarHeight }}
          data={this.state.search_data}
          ListHeaderComponent={this.renderHeader}
          ItemSeparatorComponent={ () => {
            return (
              <View
                style={{ height: 0.5, width: '100%', backgroundColor: '#606070' }}
              />
            );
          }
          }
          keyExtractor={item => item}  
          renderItem={({item}) => (<Text onPress={() => this.onSelectItem(item.split(" - ")[1])} style={{ padding:10, fontSize:18, height:44, backgroundColor: '#ecdddd' }}>{item}</Text>)}
        />
      </View>
    );
  }
}