import React from "react";
import {ScrollView, Text, View } from "react-native";
import {Card, Snackbar} from 'react-native-material-ui';
import Menu from './Menu';
import Footer from './Footer';
import Swiper from 'react-native-swiper';
import Icon from 'react-native-vector-icons/FontAwesome';

export default class PendingBooksScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      libros: [0],
      itemsPerPage: 4,
      snack_visible: false,
      message: ''
    };
  }

  removePendingBook() {

  }

  addReadedBook() {

  }

  render() {
    var numPages = this.state.libros.length / this.state.itemsPerPage;
    var longitud = this.state.libros.length % this.state.itemsPerPage == 0 ? numPages : numPages+1;
    return (
      <View style={{flex: 1}}>
        <Menu navigation={this.props.navigation} />
        <Text style={{ textAlign: 'center', fontSize: 30, margin: 10 }}>Mis Libros Pendientes</Text>
        {(() => {
          if(this.state.libros.length == 0) {
            return (
              <ScrollView style={{ margin: 10, backgroundColor: 'lightgray' }}>
                <Text style={{ color: 'green', fontSize: 24, margin: 25, textAlign: 'center'}}>No tiene ningún libro añadido como pendiente</Text>
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
                          this.state.libros.slice(i,i+this.state.itemsPerPage).map((n) => {
                            return (
                              <Card key={n} style={{ container: { backgroundColor: 'orange', marginHorizontal: 34, marginVertical: 15}}}>
                                <View style={{ flexDirection: 'row', padding:8 }}>
                                  <Text style={{ flex: 0.7 }}>Las lágrimas de Shiva - 8423675106</Text>
                                  <Icon name="plus" style={{ color: 'blue', flex: 0.1 }} size={24} onPress={() => this.props.navigation.navigate('BookDetails')} onLongPress={() => this.setState({ snack_visible: true, message: 'Presione este botón para ver más detalles del libro' })} />
                                  <Icon name="minus" style={{ color: 'blue', flex: 0.1 }} size={24} onPress={this.removePendingBook} onLongPress={() => this.setState({ snack_visible: true, message: 'Presione este botón para quitar el libro de la lista de pendientes' })} />
                                  <Icon name="book" style={{ color: 'blue', flex: 0.1 }} size={24} onPress={this.addReadedBook} onLongPress={() => this.setState({ snack_visible: true, message: 'Presione este botón para añadir el libro como leído' })} />
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