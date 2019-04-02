import React from "react";
import {ScrollView, Text, View } from "react-native";
import {Card, Snackbar, Checkbox, Button} from 'react-native-material-ui';
import Menu from './Menu';
import Footer from './Footer';
import Swiper from 'react-native-swiper';
import Icon from 'react-native-vector-icons/FontAwesome';

export default class RecommendedBooksScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      libros: [0,1,2,3,4,5],
      itemsPerPage: 5,
      snack_visible: false,
      message: '',
      check_generos: false,
      check_valoraciones: false,
      check_comentarios: false
    };
  }

  removeRecommendedBook() {

  }

  addPendingBook() {

  }

  requestRecommendation() {

  }

  render() {
    var numPages = this.state.libros.length / this.state.itemsPerPage;
    var longitud = this.state.libros.length % this.state.itemsPerPage == 0 ? numPages : numPages+1;
    return (
      <View style={{flex: 1}}>
        <Menu navigation={this.props.navigation} />
        <Text style={{ textAlign: 'center', fontSize: 30, margin: 10 }}>Mis Libros Recomendados</Text>
        {(() => {
          if(this.state.libros.length == 0) {
            return (
              <ScrollView style={{ margin: 10, backgroundColor: 'lightgray' }}>
                <Text style={{ color: 'green', fontSize: 24, margin: 25, textAlign: 'center'}}>No tiene ningún libro añadido como recomendado</Text>
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
                                  <Icon name="search" style={{ color: 'blue', flex: 0.1 }} size={24} onPress={() => this.props.navigation.navigate('BookDetails')} onLongPress={() => this.setState({ snack_visible: true, message: 'Presione este botón para ver más detalles del libro' })} />
                                  <Icon name="minus" style={{ color: 'blue', flex: 0.1 }} size={24} onPress={this.removeRecommendedBook} onLongPress={() => this.setState({ snack_visible: true, message: 'Presione este botón para quitar el libro de la lista de recomendados' })} />
                                  <Icon name="plus" style={{ color: 'blue', flex: 0.1 }} size={24} onPress={this.addPendingBook} onLongPress={() => this.setState({ snack_visible: true, message: 'Presione este botón para añadir el libro a la lista de pendientes' })} />                                
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

        <Swiper>
          <ScrollView>
            <Card style={{ container: { backgroundColor: 'lightgreen', marginVertical: 10, marginHorizontal: 25 } }}>
              <Text style={{ textAlign: 'center', marginVertical: 10}}>Seleccione el criterio o los criterios en los que quiere que basemos sus recomendaciones:</Text>
              <Checkbox label="Géneros" value="generos" checked={this.state.check_generos} onCheck={(c) => this.setState({ check_generos: c})} />
              <Checkbox label="Valoraciones" value="valoraciones" checked={this.state.check_valoraciones} onCheck={(c) => this.setState({ check_valoraciones: c})} />
              <Checkbox label="Comentarios" value="comentarios" checked={this.state.check_comentarios} onCheck={(c) => this.setState({ check_comentarios: c})} />
              <Button primary raised text="Solicitar Recomendación" style={{ container: { margin: 20 }}} onPress={this.requestRecommendation} />
            </Card>
          </ScrollView>
        </Swiper>
          
        <Snackbar visible={this.state.snack_visible} message={this.state.message} timeout={2000} onRequestClose={() => this.setState({ snack_visible: false })} />
        <Footer navigation={this.props.navigation} />
      </View>
    );
  }
}