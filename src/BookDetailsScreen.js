import React from "react";
import {ScrollView, Text, View, TextInput, Linking, Image, AsyncStorage, KeyboardAvoidingView } from "react-native";
import {Card, Snackbar, BottomNavigation, Button } from 'react-native-material-ui';
import Menu from './Menu';
import Swiper from 'react-native-swiper';
import { MaterialDialog } from 'react-native-material-dialog';
import PureChart from 'react-native-pure-chart';
import StarRating from 'react-native-star-rating';
import Icon from 'react-native-vector-icons/FontAwesome';
import ActionButton from 'react-native-action-button';
import { COLOR } from 'react-native-material-ui';

export default class BookDetailsScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      temas: [],
      snack_visible: false,
      message: '', 
      response: '',
      title: '',
      description: '',
      rating: 0,
      isbn: '',
      isbn13: '',
      isbn10: '',
      titulo: '',
      author: '',
      url: '',
      numpages: 0,
      publicationdate: '',
      publisher: '',
      language: '',
      genres: '',
      username: '',
      valoraciones: [],
      puede_valorar: false,
      media: 0,
      datos_val: [],
      image: null,
      dialog_visible: false,
      active: "valorations",
      dialog_comment: false
    };

    this.addComment = this.addComment.bind(this);
    this.addTheme = this.addTheme.bind(this);
    this.onUpdate = this.onUpdate.bind(this);
    this.obtainData = this.obtainData.bind(this);
    this.getValorations = this.getValorations.bind(this);
    this.addLike = this.addLike.bind(this);
    this.addDislike = this.addDislike.bind(this);
    this.addValoration = this.addValoration.bind(this);
    this.addPendingBook = this.addPendingBook.bind(this);
    this.addReadedBook = this.addReadedBook.bind(this);
  }

  async obtainData(isbn) {
    fetch('https://book-recommender0.herokuapp.com/book/data',{
        method: 'POST',
        body: JSON.stringify({ isbn: isbn }),
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    })
      .then(res => res.json())
      .then(data => { 
          if(data.data == undefined) this.props.navigation.navigate('Home');

          if(data.data[0].publicationdate == undefined) this.setState({ publicationdate: "" });
          else if(data.data[0].publicationdate.includes("T")) this.setState({ publicationdate: data.data[0].publicationdate.split("T")[0] });
          else this.setState({ publicationdate: data.data[0].publicationdate }); 

          this.setState({
            titulo: data.data[0].title,
            isbn: data.data[0].isbn,
            isbn10: data.data[0].isbn.length == 10 ? data.data[0].isbn : "No encontrado",
            isbn13: data.data[0].isbn.length == 13 ? data.data[0].isbn : (data.data[0].isbn13 != undefined ? data.data[0].isbn13 : "No encontrado"),
            author: data.data[0].authors,
            numpages: data.data[0].numpages,
            genres: data.genres,
            type: data.data[0].type,
            url: data.data[0].url,
            publisher: data.data[0].publisher == undefined ? "" : data.data[0].publisher,
            language: data.data[0].language,
            image: data.data[0].image
          });
      })  
      .catch(err => console.log(err));

    fetch('https://book-recommender0.herokuapp.com/canvalorate',{
        method: 'POST',
        body: JSON.stringify({ isbn: isbn, username: this.state.username }),
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    })
        .then(res => res.json())
        .then(data => {
            this.setState({ puede_valorar: data.canvalorate });
        })
        .catch(err => console.log(err));

    this.getValorations(isbn);
    this.getThemes(isbn);
  }

  componentWillUnmount() {
    this.setState({ dialog_visible: false });
  }

  async componentWillMount() {
    this.setState({ username: await AsyncStorage.getItem('username') });
    if(this.state.username == undefined) this.setState({ username: '' });
    await this.obtainData(this.props.navigation.getParam('isbn', ''));
  }

  async onUpdate(isbn) {
    await this.obtainData(isbn);
  }

  getValorations(isbn) {
    fetch('https://book-recommender0.herokuapp.com/valorations',{
        method: 'POST',
        body: JSON.stringify({ username: null, isbn: isbn }),
        headers: {
           'Accept': 'application/json',
           'Content-Type': 'application/json'
        }
    })
        .then(res => res.json())
        .then(data => {
            if(data.countValorations > 0) {
                // Media
                var m = 0;

                // Datos de las valoraciones
                var datos = [];

                let d = {};
                d['color'] = '#297AB1';
                d['data'] = [];

                for(let i=1;i<=5;i++) {
                  m += data.num_valo[i-1] * i;
                  d['data'].push({ x: i.toString(), y:data.num_valo[i-1] });
                }

                datos.push(d);

                this.setState({ valoraciones: data.array, num_total_valoraciones: data.countValorations, media: Math.round((m/data.countValorations)*100)/100, datos_val: datos });
            }
            else this.setState({ valoraciones: data.array, num_total_valoraciones: data.countValorations });
          })
          .catch(err => console.log(err));
  }

  getThemes(isbn){
    fetch('https://book-recommender0.herokuapp.com/themes',{
        method: 'POST',
        body: JSON.stringify({ book: isbn, username: this.state.username }),
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    })
        .then(res => res.json())
        .then(data => {
            this.setState({ temas: data.array, num_total_temas: data.countThemes  });
        })
        .catch(err => console.log(err));
  }

  addLike(id) {
    fetch('https://book-recommender0.herokuapp.com/givelike',{
        method: 'POST',
        body: JSON.stringify({ like: true, valorationid: id, username: this.state.username }),
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    })
        .then(res => res.json())
        .then(data => {
            if(data.msg.length == 0) {
              this.setState({ snack_visible: true, message: 'Le ha dado a \'Me gusta\' esta valoración' });
              this.getValorations(this.state.isbn);
            }
            else {
              console.log("FIESTA" + data.msg);
              this.setState({ snack_visible: true, message: data.msg });
            }
        })
        .catch(err => console.log(err));
  }

  addDislike(id) {
    fetch('https://book-recommender0.herokuapp.com/givelike',{
        method: 'POST',
        body: JSON.stringify({ like: false, valorationid: id, username: this.state.username }),
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    })
        .then(res => res.json())
        .then(data => {
            if(data.msg.length == 0) {
              this.setState({ snack_visible: true, message: 'Le ha dado a \'No me gusta\' esta valoración' });
              this.getValorations(this.state.isbn);
            }
            else this.setState({ snack_visible: true, message: data.msg });
        })
        .catch(err => console.log(err));
  }

  addTheme(){
    fetch('https://book-recommender0.herokuapp.com/theme/signup',{
        method: 'POST',
        body: JSON.stringify({ title: this.state.title, description: this.state.description, isbn: this.state.isbn, username: this.state.username }),
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    })
        .then(res => res.json())
        .then(data => {
            if(data.msg.length == 0) {
              this.setState({ snack_visible: true, message: 'Tema Creado', title: '', description: '' });
              this.getThemes(this.state.isbn);
            }
            else this.setState({ snack_visible: true, message: data.msg });
        })
        .catch(err => console.log(err));
  }

  addComment(temaId) {
    fetch('https://book-recommender0.herokuapp.com/comment/signup',{
        method: 'POST',
        body: JSON.stringify({ temaid: temaId, response: this.state.response, username: this.state.username }),
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    })
        .then(res => res.json())
        .then(data => {
            if(data.msg.length == 0) {
              this.setState({ snack_visible: true, message: 'Comentario Realizado', response: '' });
              this.getThemes(this.state.isbn);
            }
            else this.setState({ snack_visible: true, message: data.msg });
        })
        .catch(err => console.log(err));
  }

  addPendingBook() {
    fetch('https://book-recommender0.herokuapp.com/newpendingbook',{
        method: 'POST',
        body: JSON.stringify({ isbn: this.state.isbn, username: this.state.username }),
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    })
        .then(res => res.json())
        .then(data => {
            if(data.msg.length == 0) this.setState({ message: 'Libro añadido como pendiente de leer', snack_visible: true }); 
            else this.setState({ message: data.msg, snack_visible: true }); 
        })
        .catch(err => console.log(err));
  }

  addReadedBook() {
    fetch('https://book-recommender0.herokuapp.com/addreadedbook',{
        method: 'POST',
        body: JSON.stringify({ isbn: this.state.isbn, username: this.state.username }),
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    })
        .then(res => res.json())
        .then(data => {
            if(data.msg.length == 0) {
              this.setState({ message: 'Libro añadido como leído', snack_visible: true }); 
              this.onUpdate(this.state.isbn);
            }
            else this.setState({ message: data.msg, snack_visible: true }); 
        })
        .catch(err => console.log(err));
  }

  addValoration() {
    fetch('https://book-recommender0.herokuapp.com/valoration/signup',{
      method: 'POST',
      body: JSON.stringify({ description: this.state.description, note: this.state.rating, isbn: this.state.isbn, username: this.state.username }),
      headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
      }
    })
      .then(res => res.json())
      .then(data => {
          if(data.msg.length == 0) {
            this.setState({ snack_visible: true, message: 'Valoración añadida', puede_valorar: false, description: '', rating: 0 });
            this.getValorations(this.state.isbn);
          }
          else this.setState({ snack_visible: true, message: data.msg });
      })
      .catch(err => console.log(err));  
  }

  render() {
    return (
      <View style={{flex: 1}}>
        <Menu navigation={this.props.navigation} onUpdate={this.onUpdate} />
        <View style={{ flexDirection: 'row', marginLeft: 'auto', marginRight: 'auto' }}>
          <Text style={{ textAlign: 'center', fontSize: 30, margin: 10 }}>{this.state.titulo}</Text>
          {(() => {
            if(this.state.username != "admin") {
              return <Icon name="book" style={{ marginTop: 8, color: COLOR.blue500 }} onPress={() => this.props.navigation.navigate('EditBook', { isbn: this.state.isbn })} onLongPress={() => this.setState({ snack_visible: true, message: 'Editar este libro'})} size={35}/>;
            }
          })()}
        </View>

        <MaterialDialog
          title={this.state.titulo}
          visible={this.state.dialog_visible}
          onOk={() => this.setState({ dialog_visible: false })}
          onCancel={() => this.setState({ dialog_visible: false })}
          cancelLabel="Cancelar">
          <View>
            <Text>ISBN-10: {this.state.isbn10}</Text>
            <Text>ISBN-13: {this.state.isbn13}</Text>
            <Text>Autores: {this.state.author}</Text>
            <Text>Número de páginas: {this.state.numpages}</Text>
            <Text>Fecha de publicación: {this.state.publicationdate}</Text>
            <Text>URL: {this.state.url}</Text>
            <Text>Editorial: {this.state.publisher}</Text>
            <Text>Idioma: {this.state.language}</Text>
            <Text>Géneros: {this.state.genres.toString()}</Text>
          </View>  
        </MaterialDialog>

        {(() => {
          if(this.state.active == 'valorations') {
            return (
              <ScrollView>
                {(() => {
                  if(this.state.image) return <Image source={{ uri: this.state.image }} style={{ width:100, height:150, marginLeft: 'auto', marginRight: 'auto', marginTop: 10, marginBottom: 10 }} />
                })()}
            
                <View style={{ margin: 10, marginTop: 0, backgroundColor: 'lightgray' }}>
                  {(() => {
                    if(this.state.valoraciones.length > 0) {
                      return (
                        <View>
                          <Text style={{ textAlign: 'center' }}>Nota media de las valoraciones: {this.state.media}</Text>
                          <Text style={{ textAlign: 'center' }}>Gráfica con el número de valoraciones que tiene cada nota</Text>

                          <View style={{ marginLeft: 'auto', marginRight: 'auto', marginVertical: 10 }}>
                            <PureChart data={this.state.datos_val} type="bar" height={150} />
                          </View>
                        </View>
                      )
                    }
                  })()}

                  <Text style={{ textAlign: 'center' }}>IMPORTANTE: Un libro solo se podrá valorar si se ha registrado como leído</Text>

                  {
                    this.state.valoraciones.map((valoracion) => {
                      return (
                        <Card key={valoracion.id} style={{ container: { backgroundColor: 'orange', marginHorizontal: 34, marginVertical: 15}}}>
                          <Text style={{ color: 'white', textAlign: 'center', fontSize: 16, marginTop: 5 }}>{valoracion.book}</Text>
                          <Text style={{ marginHorizontal: 15, marginVertical:5, fontWeight: 'bold'}}>{valoracion.user} realizó esta valoración el día {valoracion.fecha} a las {valoracion.hora}:</Text>
                          <Text style={{ marginHorizontal: 15, marginVertical: 10 }}>{valoracion.description}</Text>
                          
                          <View style={{ flexDirection: 'row'}}>
                            <Text style={{ marginHorizontal: 15, marginVertical:5, fontWeight: 'bold'}}>Nota:</Text>
                            <StarRating disabled={true} maxStars={5} rating={valoracion.note} starStyle={{ margin:2 }} starSize={22} emptyStarColor="lightgray" fullStarColor="yellow"/>
                          </View> 

                          {(() => {
                            if(this.state.username.length > 0 && this.state.username != "admin") {
                              return (
                                <View style={{ flexDirection: 'row', margin: 3, marginTop: 9 }}>
                                  <View style={{ padding: 5, marginHorizontal: 7, backgroundColor: 'lightgray' }}>
                                    <Icon name="thumbs-up" onPress={() => this.addLike(valoracion.id)} onLongPress={() => this.setState({ snack_visible: true, message: 'Dar a \'Me gusta\' a esta valoración'})} size={28} />
                                  </View>
                                  <View style={{ padding: 5, marginHorizontal: 7, backgroundColor: 'lightgray' }}>
                                    <Icon name="thumbs-down" onPress={() => this.addDislike(valoracion.id)} onLongPress={() => this.setState({ snack_visible: true, message: 'Dar a \'No me gusta\' a esta valoración'})} size={28} />
                                  </View>
                                </View>
                              )
                            }
                          })()}
                            
                          <View style={{ flexDirection: 'row', justifyContent: 'flex-end', margin:3}}>
                            <Icon name="thumbs-up" size={24}/>
                            <Text> {valoracion.likes}   </Text>
                            <Icon name="thumbs-down" size={24}/>
                            <Text> {valoracion.dislikes}   </Text>
                          </View>
                        </Card>
                      )
                    })
                  }

                  {(() => {
                    if(this.state.valoraciones.length == 0) {
                      return (
                        <View>
                          <Text style={{ color: 'green', fontSize: 24, margin: 25, textAlign: 'center'}}>No ha realizado ninguna valoración</Text>
                        </View>
                      )
                    }
                  })()}

                  {(() => { 
                    if(this.state.puede_valorar) {
                      return (
                        <KeyboardAvoidingView behavior='padding'>
                          <Card style={{ container: { backgroundColor: 'lightgreen', marginVertical: 10, marginHorizontal: 25 } }}>
                            <Text style={{ textAlign: 'center', marginVertical: 15, fontSize:18, fontWeight: "bold"}}>Valoración</Text>
                                                
                            <View style={{ marginHorizontal: 20, marginVertical: 10 }}>
                              <Text style={{ color: '#585858'}}>Descripción</Text>
                              <TextInput multiline={true} style={{ borderBottomColor: '#585858', borderBottomWidth: 1, marginVertical: 4 }} value={this.state.description} onChangeText={(d) => this.setState({ description: d })} />
                            </View>
                                  
                            <View style={{ flexDirection: 'row'}}>
                              <Text style={{ marginHorizontal: 20, marginVertical: 10, color: '#585858' }}>Nota:</Text>
                              <StarRating disabled={false} maxStars={5} rating={this.state.rating} starStyle={{ margin:2, marginTop: 8}} starSize={22} emptyStarColor="lightgray" fullStarColor="yellow" selectedStar={(r) => this.setState({ rating: r})} />
                            </View> 
                                                  
                            <Button primary raised text="Valorar" style={{ container: { margin: 20 }}} onPress={this.addValoration} />
                          </Card>
                        </KeyboardAvoidingView>
                      )
                    }
                  })()}
                </View>
              </ScrollView> 
            )
          }
          else {
            if(this.state.temas.length == 0) {
              return (
                <Swiper style={{ margin: 10, marginTop: 0, backgroundColor: 'lightgray' }}>
                  <Text style={{ color: 'green', fontSize: 24, margin: 25, textAlign: 'center'}}>No hay temas añadidos</Text>
                </Swiper>
              )
            }
            else {
              return (
                <Swiper style={{ margin: 10, backgroundColor: 'orange' }} showsButtons={false} onIndexChanged={() => this.setState({ response: '' })}>
                  {
                    this.state.temas.map((tema) => {
                      return (
                        <ScrollView key={tema.id}>
                          <Text style={{ color: 'white', textAlign: 'center', fontSize: 16, marginVertical: 5, marginHorizontal:10 }}>{tema.title}</Text>
                          <Text style={{ marginHorizontal: 15, marginVertical:5, fontWeight: 'bold'}}>{tema.user} abrió el tema el día {tema.fecha} a las {tema.hora}:</Text>
                          <Text style={{ marginHorizontal: 15, marginVertical: 10 }}>{tema.description}</Text>

                          {
                            tema.comments.map((comment) => {
                              return (
                                <View key={comment}>
                                  <Text style={{ marginHorizontal: 15, marginVertical:5, fontWeight: 'bold'}}>{comment.user} respondió al tema el día {comment.fecha} a las {comment.hora}:</Text>
                                  <Text style={{ marginHorizontal: 15, marginVertical: 10 }}>{comment.description}</Text>
                                </View>
                              )
                            })
                          }

                          <MaterialDialog
                            title="Comentario"
                            visible={this.state.dialog_comment}
                            onOk={() => {
                              this.setState({ dialog_comment: false, response: '' });
                              this.addComment(tema.id);
                            }}
                            onCancel={() => this.setState({ dialog_comment: false, response: '' })}
                            cancelLabel="Cancelar"
                            okLabel="Comentar">
                            <View style={{ marginHorizontal: 20 }}>
                              <Text style={{ color: '#585858'}}>Respuesta</Text>
                              <TextInput multiline={true} style={{ borderBottomColor: '#585858', borderBottomWidth: 1, marginVertical: 4 }} value={this.state.response} onChangeText={(r) => this.setState({ response: r })} />
                            </View>
                          </MaterialDialog>

                          {(() => {
                            if(this.state.username.length > 0 && this.state.username != "admin") {
                              return <Button primary raised text="Comentar" style={{ container: { margin: 20 }}} onPress={() => this.setState({ dialog_comment: true })} />;
                            }
                          })()}
                        </ScrollView>
                      )
                    })
                  }
                  </Swiper> 
              ) 
            }
          }
        })()}

        {(() => {
          if(this.state.active == 'comments' && this.state.username != "admin" && this.state.username.length > 0) {
            return (
              <KeyboardAvoidingView behavior="padding">
                <View>
                  <Card style={{ container: { backgroundColor: 'lightgreen', marginVertical: 10, marginHorizontal: 25 } }}>
                    <Text style={{ textAlign: 'center', marginVertical: 15, fontSize:18, fontWeight: "bold"}}>Nuevo Tema</Text>
                                    
                    <View style={{ marginHorizontal: 20 }}>
                      <Text style={{ color: '#585858'}}>Título</Text>
                      <TextInput style={{ borderBottomColor: '#585858', borderBottomWidth: 1, marginVertical: 4 }} value={this.state.title} onChangeText={(t) => this.setState({ title: t })} />
                    </View>

                    <View style={{ marginHorizontal: 20, marginVertical: 10 }}>
                      <Text style={{ color: '#585858'}}>Descripción</Text>
                      <TextInput multiline={true} style={{ borderBottomColor: '#585858', borderBottomWidth: 1, marginVertical: 4 }} value={this.state.description} onChangeText={(d) => this.setState({ description: d })} />
                    </View>
                                        
                    <Button primary raised text="Crear" style={{ container: { margin: 20 }}} onPress={this.addTheme} />
                  </Card>
                </View>
              </KeyboardAvoidingView>  
            )
          }
        })()}
        
        {(() => {
          if(this.state.username != undefined && this.state.username.length > 0 && this.state.username != "admin") {
            return (
              <ActionButton buttonColor="rgba(231,76,60,1)" style={{ marginBottom: 60 }}>
                <ActionButton.Item buttonColor='green' title="AGREGAR A PENDIENTES" onPress={this.addPendingBook}>
                  <Icon name="plus" size={20} />
                </ActionButton.Item>
                <ActionButton.Item buttonColor='#3498db' title="AGREGAR A LEÍDOS" onPress={this.addReadedBook}>
                  <Icon name="plus" size={20} />
                </ActionButton.Item>
                <ActionButton.Item buttonColor='yellow' title="DATOS DEL LIBRO" onPress={() => this.setState({ dialog_visible: true })}>
                  <Icon name="info" size={20} />
                </ActionButton.Item>
                <ActionButton.Item buttonColor='purple' title="VER MÁS DETALLES DEL LIBRO" onPress={() => Linking.openURL(this.state.url)}>
                  <Icon name="eye" size={20} />
                </ActionButton.Item>
              </ActionButton>
            )
          }
          else {
            return (
              <ActionButton buttonColor="rgba(231,76,60,1)" style={{ marginBottom: 60 }}>
                <ActionButton.Item buttonColor='yellow' title="DATOS DEL LIBRO" onPress={() => this.setState({ dialog_visible: true })}>
                  <Icon name="info" size={20} />
                </ActionButton.Item>
                <ActionButton.Item buttonColor='purple' title="VER MÁS DETALLES DEL LIBRO" onPress={() => Linking.openURL(this.state.url)}>
                  <Icon name="eye" size={20} />
                </ActionButton.Item>
              </ActionButton>
            )
          }
        })()}
            
        {(() => {
          if(!this.state.snack_visible) {
            return (
              <BottomNavigation>
                <BottomNavigation.Action key="valorations" icon="edit" label="Valoraciones" 
                  onPress={() => this.setState({ active: 'valorations' })} />
                <BottomNavigation.Action key="comment" icon="comment" label="Comentarios"
                  onPress={() => this.setState({ active: 'comments' })} />
              </BottomNavigation>
            )
          }
        })()}

        <Snackbar visible={this.state.snack_visible} message={this.state.message} bottomNavigation={true} timeout={2000} onRequestClose={() => this.setState({ snack_visible: false })} />
      </View>
    );
  }
}