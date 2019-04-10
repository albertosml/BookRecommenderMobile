import React from "react";
import {ScrollView, Text, View, AsyncStorage } from "react-native";
import {Card, Snackbar} from 'react-native-material-ui';
import Menu from './Menu';
import Footer from './Footer';
import Swiper from 'react-native-swiper';
import Icon from 'react-native-vector-icons/FontAwesome';

export default class ReadedBooksScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      generos: [],
      itemsPerPage: 4,
      snack_visible: false, 
      username: '',
      message: ''
    };

    this.removeGenre = this.removeGenre.bind(this);
  }

  async componentWillMount() {
    var username = await AsyncStorage.getItem('username');
    if(username != undefined && username == 'admin') this.setState({ username: username });
    else this.props.navigation.navigate('Home');

    fetch('https://book-recommender0.herokuapp.com/genrelist',{
      method: 'GET',
      headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
      }
    })
      .then(res => res.json())
      .then(data => {
          this.setState({ generos: data });
      })
      .catch(err => console.log(err));
  }

  removeGenre(name) {
    fetch('https://book-recommender0.herokuapp.com/removegenre',{
        method: 'POST',
        body: JSON.stringify({ name: name }),
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    })
        .then(res => res.json())
        .then(data => {
            this.setState({ generos: data, message: 'Género eliminado', snack_visible: true });
        })
        .catch(err => console.log(err));
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
                <Text style={{ color: 'green', fontSize: 24, margin: 25, textAlign: 'center'}}>No tiene ningún género añadido</Text>
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
                          this.state.generos.slice(i,i+this.state.itemsPerPage).map((genero) => {
                            return (
                              <Card key={genero._id} style={{ container: { backgroundColor: 'orange', marginHorizontal: 34, marginVertical: 15}}}>
                                <View style={{ flexDirection: 'row', padding:8 }}>
                                  <Text style={{ flex: 0.9 }}>{genero.name}</Text>
                                  <Icon name="minus" style={{ color: 'blue', flex: 0.1 }} size={24} onPress={() => this.removeGenre(genero.name)} onLongPress={() => this.setState({ snack_visible: true, message: "Presione el icono para eliminar este género" })} />
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