import React from "react";
import {ScrollView, Text, View } from "react-native";
import {Card, Snackbar} from 'react-native-material-ui';
import Menu from './Menu';
import Footer from './Footer';
import Swiper from 'react-native-swiper';
import Icon from 'react-native-vector-icons/FontAwesome';

export default class SuggestionsScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sugerencias: [0,1,2,3,4,5,6,7,8],
      itemsPerPage: 4,
      snack_visible: false
    };
  }

  removeSuggestion() {

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
                          this.state.sugerencias.slice(i,i+this.state.itemsPerPage).map((n) => {
                            return (
                              <Card key={n} style={{ container: { backgroundColor: 'orange', marginHorizontal: 34, marginVertical: 15}}}>
                                <Text style={{ color: 'white', textAlign: 'center', fontSize: 16, marginTop: 5 }}>Administrador {n}</Text>
                                <Text style={{ marginHorizontal: 15, marginVertical: 10 }}> SORPRESA!!! Miren sus libros recomendados, se le han hecho las primeras sugerencias a los usuarios ya registrados.</Text>
                                <View style={{ flexDirection: 'row', justifyContent: 'flex-end', margin:3}}>
                                  <Icon name="minus" style={{ color: 'blue' }} size={24} onPress={this.removeSuggestion} onLongPress={() => this.setState({ snack_visible: true })} />
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
        <Snackbar visible={this.state.snack_visible} message="Eliminar sugerencia" timeout={2000} onRequestClose={() => this.setState({ snack_visible: false })} />
        <Footer navigation={this.props.navigation} />
      </View>
    );
  }
}