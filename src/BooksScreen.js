import React from "react";
import {ScrollView, Text, View, AsyncStorage } from "react-native";
import {Card, Snackbar} from 'react-native-material-ui';
import Menu from './Menu';
import Footer from './Footer';
import Swiper from 'react-native-swiper';
import Icon from 'react-native-vector-icons/FontAwesome';

export default class BooksScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      libros: [],
      itemsPerPage: 6,
      snack_visible: false,
      message: '',
      username: ''
    };
  }

  obtainBooks() {
    fetch('https://book-recommender0.herokuapp.com/books',{
      method: 'GET',
      headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
      }
    })
      .then(res => res.json())
      .then(data => {
          this.setState({ libros: data.array.reverse() });
      })
      .catch(err => console.log(err));
  }

  async componentWillMount() {
    var username = await AsyncStorage.getItem('username');
    if(username != undefined && username.length > 0) this.setState({ username: username });
  
    this.obtainBooks();
  }

  removeBook(isbn) {
    fetch('https://book-recommender0.herokuapp.com/removebook',{
        method: 'POST',
        body: JSON.stringify({ isbn: isbn }),
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    })
        .then(res => res.json())
        .then(data => {
            this.setState({ message: 'Libro eliminado', snack_visible: true });
            this.obtainBooks();
        })
        .catch(err => console.log(err));
  }

  render() {
    var numPages = this.state.libros.length / this.state.itemsPerPage;
    var longitud = this.state.libros.length % this.state.itemsPerPage == 0 ? numPages : numPages+1;
    return (
      <View style={{flex: 1}}>
        <Menu navigation={this.props.navigation} />
        <Text style={{ textAlign: 'center', fontSize: 30, margin: 10 }}>Libros</Text>
        {(() => {
          if(this.state.libros.length == 0) {
            return (
              <ScrollView style={{ margin: 10, backgroundColor: 'lightgray' }}>
                <Text style={{ color: 'green', fontSize: 24, margin: 25, textAlign: 'center'}}>No hay ningún libro dado de alta</Text>
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
                                  <Text style={{ flex: 0.9 }}>{libro.title} - {libro.isbn}</Text>
                                  <Icon name="plus" style={{ color: 'blue', flex: 0.1 }} size={24} onPress={() => this.props.navigation.navigate('BookDetails', { isbn: libro.isbn })} onLongPress={() => this.setState({ snack_visible: true, message:"Presione el icono para ver más detalles del libro" })} />
                                  
                                  {(() => {
                                    if(this.state.username == "admin") {
                                      return <Icon name="minus" style={{ color: 'blue', flex: 0.1 }} size={24} onPress={() => this.removeBook(libro.isbn)} onLongPress={() => this.setState({ snack_visible: true, message:"Eliminar libro" })} />
                                    }
                                  })()}
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