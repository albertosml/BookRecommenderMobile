import React from "react";
import {ScrollView, Text, View, AsyncStorage } from "react-native";
import {Card, Snackbar} from 'react-native-material-ui';
import Menu from './Menu';
import Footer from './Footer';
import Swiper from 'react-native-swiper';
import Icon from 'react-native-vector-icons/FontAwesome';

export default class SuggestionsScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sugerencias: [],
      itemsPerPage: 4,
      snack_visible: false,
      message: '',
      username: ''
    };

    this.getSuggestions = this.getSuggestions.bind(this);
  }

  getSuggestions() {
    fetch('http://35.180.69.250:3000/suggestions',{
      method: 'POST',
      headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
      }
    })
      .then(res => res.json())
      .then(data => {
          this.setState({ sugerencias: data.array });
      })
      .catch(err => console.log(err));
  }

  async componentWillMount() {
    var username = await AsyncStorage.getItem('username');
    if(username != undefined && username == "admin") this.setState({ username: username });
    else this.props.navigation.navigate('Home');

    this.getSuggestions();
  }

  removeSuggestion(id) {
    fetch('http://35.180.69.250:3000/removesuggestion',{
        method: 'POST',
        body: JSON.stringify({ id: id }),
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    })
        .then(res => res.json())
        .then(data => {
            if(data.msg.length == 0) this.setState({ message: 'Sugerencia eliminada', snack_visible: true });
            else this.setState({ message: data.msg, snack_visible: true });

            this.getSuggestions();
        })
        .catch(err => console.log(err));
  }

  render() {
    var numPages = this.state.sugerencias.length / this.state.itemsPerPage;
    var longitud = this.state.sugerencias.length % this.state.itemsPerPage == 0 ? numPages : numPages+1;
    return (
      <View style={{flex: 1}}>
        <Menu navigation={this.props.navigation} />
        <Text style={{ textAlign: 'center', fontSize: 30, margin: 10 }}>Sugerencias</Text>
        {(() => {
          if(this.state.sugerencias.length == 0) {
            return (
              <ScrollView style={{ margin: 10, backgroundColor: 'lightgray' }}>
                <Text style={{ color: 'green', fontSize: 24, margin: 25, textAlign: 'center'}}>No hay ninguna sugerencia</Text>
              </ScrollView>
            )
          }
          else {
            return (
              <Swiper style={{ margin: 10, backgroundColor: 'lightgray' }} showsButtons={false}>
                {
                  Array.from({length: longitud}, (v,i) => i*this.state.itemsPerPage).map((i) => {
                    return (
                      <ScrollView key={i}>
                        {
                          this.state.sugerencias.slice(i,i+this.state.itemsPerPage).map((sugerencia) => {
                            return (
                              <Card key={sugerencia.id} style={{ container: { backgroundColor: 'orange', marginHorizontal: 34, marginVertical: 15}}}>
                                <Text style={{ color: 'white', textAlign: 'center', fontSize: 16, marginTop: 5 }}>{sugerencia.user}</Text>
                                <Text style={{ marginHorizontal: 15, marginVertical: 10 }}>{sugerencia.description}</Text>
                                <View style={{ flexDirection: 'row', justifyContent: 'flex-end', margin:3}}>
                                  <Icon name="minus" style={{ color: 'blue' }} size={24} onPress={() => this.removeSuggestion(sugerencia.id)} onLongPress={() => this.setState({ snack_visible: true, message: "Eliminar sugerencia" })} />
                                </View>
                              </Card>
                            )
                          })
                        }
                      </ScrollView>
                    )
                  })
                }
              </Swiper> 
            )
          }
        })()}
        <Snackbar visible={this.state.snack_visible} message={this.state.message} timeout={2000} onRequestClose={() => this.setState({ snack_visible: false })} />
        <Footer navigation={this.props.navigation} />
      </View>
    );
  }
}