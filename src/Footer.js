import React from "react";
import { View, Text } from "react-native";
import { COLOR } from 'react-native-material-ui';
  
export default class Footer extends React.Component {
  constructor(props) {
    super(props);
  }
  
  render() {
    return (
      <View style={{ padding:10, marginTop: 5, backgroundColor: COLOR.blue500}}>
        <Text style={{ color: 'white', textAlign: 'center', fontSize: 16 }}>TFG realizado por Alberto Silvestre Montes Linares</Text>
        <Text style={{ color: 'white', textAlign: 'center', marginTop: 3, fontSize: 16 }} onPress={() => this.props.navigation.navigate('Details')}>Ver detalles del proyecto</Text>
      </View>
    );
  }
}