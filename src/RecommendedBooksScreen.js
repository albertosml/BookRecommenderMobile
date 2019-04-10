import React from "react";
import {ScrollView, Text, View, AsyncStorage } from "react-native";
import {Card, Snackbar, Checkbox, Button} from 'react-native-material-ui';
import Menu from './Menu';
import Footer from './Footer';
import Swiper from 'react-native-swiper';
import Icon from 'react-native-vector-icons/FontAwesome';

export default class RecommendedBooksScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      libros: [],
      itemsPerPage: 5,
      snack_visible: false,
      message: '',
      check_generos: false,
      check_valoraciones: false,
      check_comentarios: false
    };

    this.removeRecommendedBook = this.removeRecommendedBook.bind(this);
    this.requestRecommendation = this.requestRecommendation.bind(this);
    this.addPendingBook = this.addPendingBook.bind(this);
  }

  async componentWillMount() {
    var username = await AsyncStorage.getItem('username');
    if(username != undefined && username.length > 0) this.setState({ username: username });
    else this.props.navigation.navigate('Home');

    fetch('https://book-recommender0.herokuapp.com/recomendedbooks',{
      method: 'POST',
      body: JSON.stringify({ username: this.state.username }),
      headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
      }
    })
      .then(res => res.json())
      .then(data => {
        this.setState({ libros: data.array });
      })
      .catch(err => console.log(err));
  }

  removeRecommendedBook(isbn) {
    fetch('https://book-recommender0.herokuapp.com/removerecomendedbook',{
        method: 'POST',
        body: JSON.stringify({ isbn: isbn, username: this.state.username }),
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    })
        .then(res => res.json())
        .then(data => {
          this.setState({ libros: data.array });
          this.setState({ message: 'Libro eliminado de la lista de recomendados', snack_visible: true });
        })
        .catch(err => console.log(err));
  }

  addPendingBook(isbn) {
    fetch('https://book-recommender0.herokuapp.com/removerecomendedbook',{
        method: 'POST',
        body: JSON.stringify({ isbn: isbn, username: this.state.username }),
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    })
        .then(res => res.json())
        .then(data => {
            this.setState({ libros: data.array });

            fetch('https://book-recommender0.herokuapp.com/newpendingbook',{
                method: 'POST',
                body: JSON.stringify({ isbn: isbn, username: this.state.username }),
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            })
                .then(res => res.json())
                .then(data => {
                    this.setState({ message: 'Libro añadido como pendiente', snack_visible: true });
                })
                .catch(err => console.log(err));
        })
        .catch(err => console.log(err));  
  }

  requestRecommendation() {
    this.setState({ message: 'Recomendación solicitada', snack_visible: true });
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
                          this.state.libros.slice(i,i+this.state.itemsPerPage).map((libro) => {
                            return (
                              <Card key={libro.isbn} style={{ container: { backgroundColor: 'orange', marginHorizontal: 34, marginVertical: 15}}}>
                                <View style={{ flexDirection: 'row', padding:8 }}>
                                  <Text style={{ flex: 0.7 }}>{libro.title} - {libro.isbn}</Text>
                                  <Icon name="search" style={{ color: 'blue', flex: 0.1 }} size={24} onPress={() => this.props.navigation.navigate('BookDetails', { isbn: libro.isbn })} onLongPress={() => this.setState({ snack_visible: true, message: 'Presione este botón para ver más detalles del libro' })} />
                                  <Icon name="minus" style={{ color: 'blue', flex: 0.1 }} size={24} onPress={() => this.removeRecommendedBook(libro.isbn)} onLongPress={() => this.setState({ snack_visible: true, message: 'Presione este botón para quitar el libro de la lista de recomendados' })} />
                                  <Icon name="plus" style={{ color: 'blue', flex: 0.1 }} size={24} onPress={() => this.addPendingBook(libro.isbn)} onLongPress={() => this.setState({ snack_visible: true, message: 'Presione este botón para añadir el libro a la lista de pendientes' })} />                                
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