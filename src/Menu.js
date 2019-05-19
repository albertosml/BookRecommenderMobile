import React from "react";
import {View, Text, FlatList} from "react-native";
import {Toolbar} from 'react-native-material-ui';
import { Constants } from 'expo';

export default class Menu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      options: [],
      value: ''
    };
   
    this.renderHeader = this.renderHeader.bind(this);
  }

  renderHeader() {
    return (
      <Toolbar
          leftElement="menu"
          centerElement="BookRecommender"
          searchable={{
            autoFocus: true,
            placeholder: 'Buscar Libro...',
            onSubmitEditing: () => this.doSearch(),
            onChangeText: (v) => this.setState({ value: v, options: [] }),
            onSearchCloseRequested: () => this.setState({ options: [] })
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
      this.setState({ options: [] });
    }
  }

  doSearch() {
    fetch('https://book-recommender0.herokuapp.com/dosearch',{
        method: 'POST',
        body: JSON.stringify({ text: this.state.value }),
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    })
        .then(res => res.json())
        .then(data => { 
            if(data.msg.length == 0) {
                this.setState({ options: data.libros, value: '' });
                if(data.libros.length == 0) M.toast({ 'html': 'No se han encontrado resultados'}); 
            } 
            else M.toast({ 'html': data.msg });
        })
        .catch(err => console.log(err));
  }

  render() {
    return (
      <View>
        <FlatList
          style={{ marginTop: Constants.statusBarHeight }}
          data={this.state.options}
          ListHeaderComponent={this.renderHeader}
          ItemSeparatorComponent={ () => {
            return (
              <View
                style={{ height: 0.5, width: '100%', backgroundColor: '#606070' }}
              />
            );
          }
          }
          keyExtractor={item => item.value}  
          renderItem={({item}) => (<Text onPress={() => this.onSelectItem(item.value)} style={{ padding:10, fontSize:18, height:44, backgroundColor: '#ecdddd' }}>{item.label}</Text>)}
        />
      </View>
    );
  }
}