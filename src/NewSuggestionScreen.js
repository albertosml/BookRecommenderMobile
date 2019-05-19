import React from "react";
import {ScrollView, Text, TextInput, View, AsyncStorage, KeyboardAvoidingView } from "react-native";
import {Card, Snackbar, Button} from 'react-native-material-ui';
import Menu from './Menu';
import Footer from './Footer';

export default class NewSuggestionScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      description: '',
      snack_visible: false,
      message: ''
    };

    this.addSuggestion = this.addSuggestion.bind(this);
  }

  async componentWillMount() {
    this.setState({ username: await AsyncStorage.getItem('username') });
    if(this.state.username == undefined) this.setState({ username: '' });
  }
 
  addSuggestion(){
    fetch('https://book-recommender0.herokuapp.com/suggestion/signup',{
        method: 'POST',
        body: JSON.stringify(this.state),
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    })
        .then(res => res.json())
        .then(data => {
            if(data.msg.length == 0) {
                if(this.state.username == "admin") this.setState({ message: 'Noticia creada', snack_visible: true });
                else this.setState({ message: 'Sugerencia realizada. Gracias por comentarnos.', snack_visible: true });
                
                this.setState({ description: '' });
            }
            else this.setState({ message: data.msg, snack_visible: true});
        })
        .catch(err => console.log(err));
  }

  render() {
    return (
      <View style={{flex: 1}}>
        <Menu navigation={this.props.navigation} />
        
        {(() => {
          if(this.state.username == "admin") {
            return (
              <View style={{flex: 1}}>
                <Text style={{ textAlign: 'center', fontSize: 30, margin: 10 }}>Añadir noticia</Text>
              
                <KeyboardAvoidingView behavior="height">
                  <ScrollView>
                    <Card style={{ container: { backgroundColor: 'lightgreen', marginVertical: 10, marginHorizontal: 25 } }}>
                      <Text style={{ textAlign: 'center', marginVertical: 15, fontSize:18, fontWeight: "bold"}}>Nueva noticia</Text>
                      
                      <View style={{ marginHorizontal: 20 }}>
                        <Text style={{ color: '#585858'}}>Descripción</Text>
                        <TextInput multiline={true} style={{ borderBottomColor: '#585858', borderBottomWidth: 1, marginVertical: 4 }} value={this.state.description} onChangeText={(d) => this.setState({ description: d })} />
                        <Text style={{ color: '#585858'}}>Aquí se puede comentar cualquier sugerencia sobre el uso de la web o novedad sobre ella.</Text>
                      </View>
                        
                      <Button primary raised text="Realizar" style={{ container: { margin: 20 }}} onPress={this.addSuggestion} />
                    </Card>
                  </ScrollView>
                </KeyboardAvoidingView>
                  
              </View>
            )
          }
          else {
            return (
              <View style={{flex: 1}}>
                <Text style={{ textAlign: 'center', fontSize: 30, margin: 10 }}>Añadir sugerencia</Text>
        
                <KeyboardAvoidingView behavior="height">
                  <ScrollView>
                    <Card style={{ container: { backgroundColor: 'lightgreen', marginVertical: 10, marginHorizontal: 25 } }}>
                      <Text style={{ textAlign: 'center', marginVertical: 15, fontSize:18, fontWeight: "bold"}}>Nueva Sugerencia</Text>
                      
                      <View style={{ marginHorizontal: 20 }}>
                        <Text style={{ color: '#585858'}}>Descripción</Text>
                        <TextInput multiline={true} style={{ borderBottomColor: '#585858', borderBottomWidth: 1, marginVertical: 4 }} value={this.state.description} onChangeText={(d) => this.setState({ description: d })} />
                        <Text style={{ color: '#585858'}}>Aquí se puede comentar cualquier sugerencia, duda, problema o arreglo sobre esta web, con el objetivo de hacer mejorar este proyecto.</Text>
                      </View>
                        
                      <Button primary raised text="Realizar" style={{ container: { margin: 20 }}} onPress={this.addSuggestion} />
                    </Card>
                  </ScrollView>
                </KeyboardAvoidingView>
              </View>
            )
          }
        })()}
        
        <Snackbar visible={this.state.snack_visible} message={this.state.message} timeout={2000} onRequestClose={() => this.setState({ snack_visible: false })} />
        <Footer navigation={this.props.navigation} />
      </View>
    );
  }
}