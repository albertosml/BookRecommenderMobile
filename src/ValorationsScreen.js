import React from "react";
import { ScrollView, View, Text } from "react-native";
import Menu from './Menu';
import Footer from './Footer';

export default class ValorationsScreen extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={{flex: 1}}>
        <Menu navigation={this.props.navigation} />
        <ScrollView>
          <Text>Mis valoraciones</Text>
        </ScrollView>
        <Footer navigation={this.props.navigation} />
      </View>
    );
  }
}