import React from "react";
import {ScrollView, Text, View, AsyncStorage } from "react-native";
import {Card, Snackbar, Button} from 'react-native-material-ui';
import Menu from './Menu';
import Footer from './Footer';
import Swiper from 'react-native-swiper';
import Icon from 'react-native-vector-icons/FontAwesome';
import RadioForm from 'react-native-simple-radio-button';
import { MaterialDialog } from 'react-native-material-dialog';

export default class RecommendedBooksScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      libros: [],
      itemsPerPage: 5,
      snack_visible: false,
      message: '',
      option: 1, 
      dialog: false,
      username: ''
    };

    this.removeRecommendedBook = this.removeRecommendedBook.bind(this);
    this.requestRecommendation = this.requestRecommendation.bind(this);
    this.addPendingBook = this.addPendingBook.bind(this);
  }

  async componentWillMount() {
    var username = await AsyncStorage.getItem('username');
    if(username != undefined && username.length > 0) this.setState({ username: username });
    else this.props.navigation.navigate('Home');

    fetch('http://35.180.69.250:3000/recomendedbooks',{
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
    fetch('http://35.180.69.250:3000/removerecomendedbook',{
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
    fetch('http://35.180.69.250:3000/removerecomendedbook',{
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

            fetch('http://35.180.69.250:3000/newpendingbook',{
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
    this.setState({ message: 'Realizando recomendación, espere un instante', snack_visible: true });

    fetch('http://35.180.69.250:3000/dorecommendation',{
        method: 'POST',
        body: JSON.stringify({ option: this.state.option, username: this.state.username }),
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    })
        .then(res => res.json())
        .then(data => {
            if(data.msg.length == 0) {
                this.setState({ libros: data.array });
                this.setState({ option: 1 });
                this.setState({ message: 'Recomendación realizada, se han obtenido ' + data.cont + ' libro/libros nuevos', snack_visible: true });
            }
            else this.setState({ message: data.msg, snack_visible: true });
        })
        .catch(err => console.log(err));
  }
    
  render() {
    var radio_props = [
      {label: 'Basada en valoraciones', value: 1 },
      {label: 'Basada en géneros favoritos', value: 2 },
      {label: 'Basada en opiniones', value: 3 },
      {label: 'Basada en opiniones y géneros favoritos', value: 4 }
    ];

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
        
        <MaterialDialog
          title="Solicitar Recomendación"
          visible={this.state.dialog}
          onOk={() => {
            this.setState({ dialog: false });
            this.requestRecommendation();
          }}
          onCancel={() => this.setState({ dialog: false })}
          cancelLabel="Cancelar"
          okLabel="Solicitar">
          <View>
            <Text style={{ textAlign: 'center', marginVertical: 10}}>Seleccione el criterio en el que quiere que basemos sus recomendaciones:</Text>
            <RadioForm radio_props={radio_props} initial={0} onPress={(value) => this.setState({ option: value })} />
          </View>
        </MaterialDialog>

        <Button text="Solicitar Recomendación" style={{ container: { margin: 20, backgroundColor: 'lightgreen' }}} onPress={() => this.setState({ dialog: true })} />
          
        <Snackbar visible={this.state.snack_visible} message={this.state.message} timeout={2000} onRequestClose={() => this.setState({ snack_visible: false })} />
        <Footer navigation={this.props.navigation} />
      </View>
    );
  }
}