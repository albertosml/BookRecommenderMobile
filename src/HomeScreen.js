import React from "react";
import {ScrollView, Text, Button } from "react-native";
import Menu from './Menu';
import Footer from './Footer';

export default class HomeScreen extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <ScrollView>
        <Menu navigation={this.props.navigation} />  
        <Text>Mi casa, mi teléfono</Text>
        <Button onPress={() => this.props.navigation.openDrawer()} title="Abreme Drawer" />
        <Footer navigation={this.props.navigation} />
      </ScrollView>
    );
  }
}
