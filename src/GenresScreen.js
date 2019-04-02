import React from "react";
import {ScrollView, Text, View } from "react-native";
import {Card, Snackbar} from 'react-native-material-ui';
import Menu from './Menu';
import Footer from './Footer';
import Swiper from 'react-native-swiper';
import Icon from 'react-native-vector-icons/FontAwesome';

export default class ReadedBooksScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      generos: [0,1,2,3,4,5,6,7,8],
      itemsPerPage: 4,
      snack_visible: false
    };
  }

  removeGenre() {

  }

  render() {
    var numPages = this.state.generos.length / this.state.itemsPerPage;
    var longitud = this.state.generos.length % this.state.itemsPerPage == 0 ? numPages : numPages+1;
    return (
      <View style={{flex: 1}}>
        <Menu navigation={this.props.navigation} />
        <Text style={{ textAlign: 'center', fontSize: 30, margin: 10 }}>Géneros</Text>
        {(() => {
          if(this.state.generos.length == 0) {
            return (
              <ScrollView style={{ margin: 10, backgroundColor: 'lightgray' }}>
                <Text style={{ color: 'green', fontSize: 24, margin: 25, textAlign: 'center'}}>No tiene ningún libro añadido como leído</Text>
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
                          this.state.generos.slice(i,i+this.state.itemsPerPage).map((n) => {
                            return (
                              <Card key={n} style={{ container: { backgroundColor: 'orange', marginHorizontal: 34, marginVertical: 15}}}>
                                <View style={{ flexDirection: 'row', padding:8 }}>
                                  <Text style={{ flex: 0.9 }}>Juvenil</Text>
                                  <Icon name="minus" style={{ color: 'blue', flex: 0.1 }} size={24} onPress={this.removeGenre} onLongPress={() => this.setState({ snack_visible: true })} />
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
        <Snackbar visible={this.state.snack_visible} message="Presione el icono para ver más detalles del libro" timeout={2000} onRequestClose={() => this.setState({ snack_visible: false })} />
        <Footer navigation={this.props.navigation} />
      </View>
    );
  }
}