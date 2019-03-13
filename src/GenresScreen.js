import React from "react";
import { ScrollView, Text } from "react-native";
import Menu from './Menu';
import Footer from './Footer';

export default class GenresScreen extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <ScrollView>
        <Menu navigation={this.props.navigation} />
        <Text>Géneros</Text> 
        <Footer navigation={this.props.navigation} />
      </ScrollView>
    );
  }
}