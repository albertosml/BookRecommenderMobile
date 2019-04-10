import React from "react";
import {ScrollView, Text, View, AsyncStorage } from "react-native";
import {Card, Snackbar} from 'react-native-material-ui';
import Menu from './Menu';
import Footer from './Footer';
import Swiper from 'react-native-swiper';
import Icon from 'react-native-vector-icons/FontAwesome';

export default class PendingBooksScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      libros: [],
      itemsPerPage: 4,
      snack_visible: false,
      message: ''
    };

    this.removePendingBook = this.removePendingBook.bind(this);
    this.addReadedBook = this.addReadedBook.bind(this);
  }

  async componentWillMount() {
    var username = await AsyncStorage.getItem('username');
    if(username != undefined && username.length > 0) this.setState({ username: username });
    else this.props.navigation.navigate('Home');

    fetch('https://book-recommender0.herokuapp.com/pendingbooks',{
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

  removePendingBook(isbn) {
    fetch('https://book-recommender0.herokuapp.com/removependingbook',{
        method: 'POST',
        body: JSON.stringify({ isbn: isbn, username: this.state.username }),
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    })
        .then(res => res.json())
        .then(data => {
            this.setState({ libros: data.array, message: 'Libro eliminado de la lista de libros pendientes', snack_visible: true });
        })
        .catch(err => console.log(err));
}

addReadedBook(isbn) {
    fetch('https://book-recommender0.herokuapp.com/removependingbook',{
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

            fetch('https://book-recommender0.herokuapp.com/addreadedbook',{
                method: 'POST',
                body: JSON.stringify({ isbn: isbn, username: this.state.username }),
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            })
                .then(res => res.json())
                .then(data => {
                    this.setState({ snack_visible: true, message: 'Libro añadido como leído'});
                })
                .catch(err => console.log(err));
        })
        .catch(err => console.log(err));
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
                  Array.from({length: longitud}, (v,i) => i*this.state.itemsPerPage).map((j) => {
                    return (
                      <ScrollView key={j}>
                        {
                          this.state.libros.slice(j,j+this.state.itemsPerPage).map((libro) => {
                            return (
                              <Card key={libro.isbn} style={{ container: { backgroundColor: 'orange', marginHorizontal: 34, marginVertical: 15}}}>
                                <View style={{ flexDirection: 'row', padding:8 }}>
                                  <Text style={{ flex: 0.7 }}>{libro.title} - {libro.isbn}</Text>
                                  <Icon name="plus" style={{ color: 'blue', flex: 0.1 }} size={24} onPress={() => this.props.navigation.navigate('BookDetails', { isbn: libro.isbn })} onLongPress={() => this.setState({ snack_visible: true, message: 'Presione este botón para ver más detalles del libro' })} />
                                  <Icon name="minus" style={{ color: 'blue', flex: 0.1 }} size={24} onPress={() => this.removePendingBook(libro.isbn)} onLongPress={() => this.setState({ snack_visible: true, message: 'Presione este botón para quitar el libro de la lista de pendientes' })} />
                                  <Icon name="book" style={{ color: 'blue', flex: 0.1 }} size={24} onPress={() => this.addReadedBook(libro.isbn)} onLongPress={() => this.setState({ snack_visible: true, message: 'Presione este botón para añadir el libro como leído' })} />
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