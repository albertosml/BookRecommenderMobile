import React from "react";
import {ScrollView, Text, View, AsyncStorage, Image } from "react-native";
import {Card, Snackbar} from 'react-native-material-ui';
import Menu from './Menu';
import Footer from './Footer';
import Swiper from 'react-native-swiper';
import Icon from 'react-native-vector-icons/FontAwesome';

export default class HomeScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      noticias: [],
      itemsPerPage: 4,
      snack_visible: false, 
      username: '',
      message: ''
    };
  }

  async componentWillMount() {
    this.setState({ username: await AsyncStorage.getItem('username')}); 

    fetch('http://35.180.69.250:3000/news',{
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
    })
      .then(res => res.json())
      .then(data => {
        this.setState({ noticias: data.array });
      })
      .catch(err => console.log(err));
  }

  componentWillReceiveProps(nextProps) {
    var new_username = nextProps.navigation.getParam('username', '');
    if(new_username !== this.state.username) this.setState({ username: new_username });
  }
  
  removeNotice(id) {
    fetch('http://35.180.69.250:3000/removenews',{
        method: 'POST',
        body: JSON.stringify({ id: id }),
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    })
        .then(res => res.json())
        .then(data => {
            if(data.msg.length == 0) {
                this.setState({ noticias: data.array });
                this.setState({ message: 'Noticia eliminada', snack_visible: true });
            } 
            else this.setState({ message: data.msg, snack_visible: true });  
        })
        .catch(err => console.log(err));
  }

  render() {
    if(this.state.username != null && this.state.username.length > 0) {
      var numPages = this.state.noticias.length / this.state.itemsPerPage;
      var longitud = this.state.noticias.length % this.state.itemsPerPage == 0 ? numPages : numPages+1;
      return (
        <View style={{flex: 1}}>
          <Menu navigation={this.props.navigation} />
          <Text style={{ textAlign: 'center', fontSize: 30, margin: 10 }}>Noticias</Text>
          {(() => {
            if(this.state.noticias.length == 0) {
              return (
                <ScrollView style={{ margin: 10, backgroundColor: 'lightgray' }}>
                  <Text style={{ color: 'green', fontSize: 24, margin: 25, textAlign: 'center'}}>No hay ninguna noticia dada por el administrador</Text>
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
                            this.state.noticias.slice(i,i+this.state.itemsPerPage).map((noticia) => {
                              if(noticia.id != undefined) {
                                return (
                                  <Card key={noticia.id} style={{ container: { backgroundColor: 'orange', marginHorizontal: 34, marginVertical: 15}}}>
                                    <Text style={{ color: 'white', textAlign: 'center', fontSize: 16, marginTop: 5 }}>Administrador</Text>
                                    <Text style={{ marginHorizontal: 15, marginVertical: 10 }}>{noticia.description}</Text>
                                    {(() => {
                                      if(this.state.username == "admin") {
                                        return (
                                          <View style={{ flexDirection: 'row', justifyContent: 'flex-end', margin:3}}>
                                            <Icon name="minus" style={{ color: 'blue' }} size={24} onPress={() => this.removeNotice(noticia.id)} onLongPress={() => this.setState({ snack_visible: true, message: "Presione el icono para eliminar la noticia" })} />
                                          </View>
                                        )
                                      }
                                    })()}
                                  </Card>
                                )
                              }
                                
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
    else {
      return (
        <View style={{flex: 1}}>
          <Menu navigation={this.props.navigation} />
          <Text style={{ textAlign: 'center', fontSize: 30, margin: 10 }}>BookRecommender</Text>

          <View style={{ marginTop: 10, marginBottom: 10, alignItems: 'center' }}>
            <Image source={require('./images/favicon.png')} style={{ width:150, height:150 }} />
          </View>
            
          <View style={{ marginLeft: 20, marginTop: 30, marginRight: 20, marginBottom: 50 }}>
              <Text style={{ fontSize: 18 }}>En esta plataforma podrá expresar sus opiniones y valoraciones sobre aquellos libros
                                 que se haya leído y debatir con otros acerca de ellos o de cualquier otro tema relacionado 
                                 con la lectura. Además, se le posibilitará el descubrimiento de nuevas obras mediante 
                                 la búsqueda y la recomendación de libros realizada por la propia plataforma. Esta estará disponible en 
                                 su versión web y móvil, en forma de aplicación en ambos casos.</Text>
          </View>

          <Footer navigation={this.props.navigation} />
        </View>
      );
    }
  }
}
