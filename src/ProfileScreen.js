import React from "react";
import { ScrollView, Text, Button } from "react-native";
import Menu from './Menu';
import Footer from "./Footer";

export default class ProfileScreen extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <ScrollView>
        <Menu navigation={this.props.navigation} />
        <Text>Hola </Text> 
        <Button onPress={() => this.props.navigation.navigate("Home")} title="Go to Home" />
        <Footer navigation={this.props.navigation} />
      </ScrollView>
    );
  }
}
