import React from "react";
import {ScrollView, Text, TextInput, View } from "react-native";
import {Card, Snackbar, Button} from 'react-native-material-ui';
import Menu from './Menu';
import Footer from './Footer';

export default class NewSuggestionScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      description: '',
      snack_visible: false,
      message: ''
    };

    this.addSuggestion = this.addSuggestion.bind(this);
  }
 
  addSuggestion() {
    this.setState({ message: this.state.description, snack_visible: true, description: '' });
  }

  render() {
    return (
      <View style={{flex: 1}}>
        <Menu navigation={this.props.navigation} />
        <Text style={{ textAlign: 'center', fontSize: 30, margin: 10 }}>Añadir sugerencia</Text>
        
        <ScrollView>
          <Card style={{ container: { backgroundColor: 'lightgreen', marginVertical: 10, marginHorizontal: 25 } }}>
            <Text style={{ textAlign: 'center', marginVertical: 15, fontSize:18, fontWeight: "bold"}}>Nueva Sugerencia</Text>
            
            <View style={{ marginHorizontal: 20 }}>
              <Text style={{ color: '#585858'}}>Descripción</Text>
              <TextInput multiline={true} style={{ borderBottomColor: '#585858', borderBottomWidth: 1, marginVertical: 4 }} value={this.state.description} onChangeText={(d) => this.setState({ description: d })} />
              <Text style={{ color: '#585858'}}>Aquí se puede comentar cualquier sugerencia, duda, problema o arreglo sobre esta web, con el objetivo de hacer mejorar este proyecto.</Text>
            </View>
              
            <Button primary raised text="Realizar Sugerencia" style={{ container: { margin: 20 }}} onPress={this.addSuggestion} />
          </Card>
        </ScrollView>
          
        <Snackbar visible={this.state.snack_visible} message={this.state.message} timeout={2000} onRequestClose={() => this.setState({ snack_visible: false })} />
        <Footer navigation={this.props.navigation} />
      </View>
    );
  }
}