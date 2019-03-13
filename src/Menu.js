import React from "react";
import {View, Text, FlatList} from "react-native";
import {Toolbar} from 'react-native-material-ui';
import { Constants } from 'expo';

export default class Menu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      text: '',
      data: ['Pepe']
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
            onChangeText: (text) => {
              this.setState({ text: text});
            },
            onSubmitEditing: (text) => this.setState({ data: [] })
          }}
          onLeftElementPress={() => this.props.navigation.openDrawer()}
        />
    )
  }

  render() {
    return (
      <View>
        <FlatList
          style={{ marginTop: Constants.statusBarHeight }}
          data={this.state.data}
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
          renderItem={({item}) => (<Text style={{ padding:10, fontSize:18, height:44, backgroundColor: '#ecdddd' }}>{item}</Text>)}
        />
      </View>
    );
  }
}