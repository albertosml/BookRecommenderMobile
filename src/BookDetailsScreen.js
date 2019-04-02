import React from "react";
import {ScrollView, Text, View, TextInput, Linking, Image } from "react-native";
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
      temas: [0,1],
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
      url: 'https://as.com',
      numpages: 0,
      publicationdate: '',
      publisher: '',
      language: '',
      genre: '',
      username: '',
      valoraciones: [0,1],
      puede_valorar: false,
      media: 0,
      datos_val: [],
      image: 'JLKNN',
      dialog_visible: false,
      active: "valorations"
    };

    this.addComment = this.addComment.bind(this);
    this.addTheme = this.addTheme.bind(this);
    this.addPendingBook = this.addPendingBook.bind(this);
    this.addReadedBook = this.addReadedBook.bind(this);
  }

  addTheme() {
    this.setState({ message: 'Tema añadido', snack_visible: true, response: '' });
  }

  addComment() {
    this.setState({ message: 'Comentario añadido', snack_visible: true });
  }

  addPendingBook() {
    console.log("gHO");
    //this.setState({ message: 'Libro añadido como pendiente de leer', snack_visible: true });    
  }

  addReadedBook() {
    this.setState({ message: 'Libro añadido como leído', snack_visible: true });    
  }

  render() {
    let sampleData = [
      {
        data: [
          {x: '1', y: 0},
          {x: '2', y: 1},
          {x: '3', y: 0},
          {x: '4', y: 1},
          {x: '5', y: 1}
        ],
        color: '#297AB1'
      }
    ];

    return (
      <View style={{flex: 1}}>
        <Menu navigation={this.props.navigation} />
        <View style={{ flexDirection: 'row', marginLeft: 'auto', marginRight: 'auto' }}>
          <Text style={{ textAlign: 'center', fontSize: 30, margin: 10 }}>Las lágrimas de Shiva</Text>
          <Icon name="book" style={{ marginTop: 8, color: COLOR.blue500 }} onPress={() => this.props.navigation.navigate('EditBook')} onLongPress={() => this.setState({ snack_visible: true, message: 'Editar este libro'})} size={35}/>
        </View>

        <MaterialDialog
          title="Las lágrimas de Shiva"
          visible={this.state.dialog_visible}
          onOk={() => this.setState({ dialog_visible: false })}
          onCancel={() => this.setState({ dialog_visible: false })}
          cancelLabel="Cancelar">
          <View>
            <Text>ISBN-10: 8423675106</Text>
            <Text>ISBN-13: 9788423675104</Text>
            <Text>Autores: César Mallorquí</Text>
            <Text>Número de páginas: 0</Text>
            <Text>Fecha de publicación: 2005-04-01</Text>
            <Text>URL: http://as.com</Text>
            <Text>Editorial: Edebé</Text>
            <Text>Idioma: ES</Text>
            <Text>Géneros: Juvenil, Ficción</Text>
          </View>  
        </MaterialDialog>

        {(() => {
          if(this.state.active == 'valorations') {
            return (
              <ScrollView>
                {(() => {
                  if(this.state.image) return <Image source={{ uri: 'data:image/png;base64,' + this.state.image }} style={{ width:100, height:150, marginLeft: 'auto', marginRight: 'auto', marginTop: 10 }} />
                })()}
            
                <View style={{ margin: 10, marginTop: 0, backgroundColor: 'lightgray' }}>
                  <Text style={{ textAlign: 'center' }}>Nota media de las valoraciones: {this.state.media}</Text>
                  <Text style={{ textAlign: 'center' }}>Gráfica con el número de valoraciones que tiene cada nota</Text>

                  <View style={{ marginLeft: 'auto', marginRight: 'auto', marginVertical: 10 }}>
                    <PureChart data={sampleData} type="bar" height={150} />
                  </View>

                  <Text style={{ textAlign: 'center' }}>IMPORTANTE: Un libro solo se podrá valorar si se ha registrado como leído</Text>

                  {
                    this.state.valoraciones.map((n) => {
                      return (
                        <Card key={n} style={{ container: { backgroundColor: 'orange', marginHorizontal: 34, marginVertical: 15}}}>
                          <Text style={{ color: 'white', textAlign: 'center', fontSize: 16, marginTop: 5 }}>Las lágrimas de shiva</Text>
                          <Text style={{ marginHorizontal: 15, marginVertical:5, fontWeight: 'bold'}}>albertosml realizó esta valoración el día 24/2/2019 a las 20:14:29:</Text>
                          <Text style={{ marginHorizontal: 15, marginVertical: 10 }}>No soy mucho de los libros de intriga, pero la verdad es que este libro me gustó mucho, ya que este libro te engancha en la historia desde el primer momento y, además, tiene un buen final.</Text>
                          <View style={{ flexDirection: 'row'}}>
                            <Text style={{ marginHorizontal: 15, marginVertical:5, fontWeight: 'bold'}}>Nota:</Text>
                            <StarRating disabled={true} maxStars={5} rating={2} starStyle={{ margin:2}} starSize={22} emptyStarColor="lightgray" fullStarColor="yellow"/>
                          </View> 
                          <View style={{ flexDirection: 'row', margin: 3, marginTop: 9 }}>
                            <View style={{ padding: 5, marginHorizontal: 7, backgroundColor: 'lightgray' }}>
                              <Icon name="thumbs-up" onPress={this.addPendingBook} onLongPress={() => this.setState({ snack_visible: true, message: 'Dar a \'Me gusta\' a esta valoración'})} size={28} />
                            </View>
                            <View style={{ padding: 5, marginHorizontal: 7, backgroundColor: 'lightgray' }}>
                              <Icon name="thumbs-down" onPress={this.addReadedBook} onLongPress={() => this.setState({ snack_visible: true, message: 'Dar a \'No me gusta\' a esta valoración'})} size={28} />
                            </View>
                          </View>
                          <View style={{ flexDirection: 'row', justifyContent: 'flex-end', margin:3}}>
                            <Icon name="thumbs-up" size={24}/>
                            <Text> 1   </Text>
                            <Icon name="thumbs-down" size={24}/>
                            <Text> 2   </Text>
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
                                          
                    <Button primary raised text="Valorar" style={{ container: { margin: 20 }}} onPress={this.addTheme} />
                  </Card>
                </View>
              </ScrollView> 
            )
          }
          else {
            if(this.state.temas.length == 0) {
              return (
                <View style={{ margin: 10, marginTop: 0, backgroundColor: 'lightgray' }}>
                  <Text style={{ color: 'green', fontSize: 24, margin: 25, textAlign: 'center'}}>No hay temas añadidos</Text>
                </View>
              )
            }
            else {
              return (
                <Swiper style={{ margin: 10, backgroundColor: 'orange' }} showsButtons={false} onIndexChanged={() => this.setState({ response: '' })}>
                  {
                    this.state.temas.map((t) => {
                      return (
                        <ScrollView key={t}>
                          <Text style={{ color: 'white', textAlign: 'center', fontSize: 16, marginVertical: 5, marginHorizontal:10 }}>¿Alguna novela historica reciente que merezca la pena?</Text>
                          <Text style={{ marginHorizontal: 15, marginVertical:5, fontWeight: 'bold'}}>marcos_lupion abrió el tema el día 1/3/2019 a las 23:43:58:</Text>
                          <Text style={{ marginHorizontal: 15, marginVertical: 10 }}>Quiero algún libro de novela histórica sobre la caída del muro de Berlín.</Text>
                                  
                          <Text style={{ marginHorizontal: 15, marginVertical:5, fontWeight: 'bold'}}>albertosml respondió al tema el día 3/3/2019 a las 16:17:10:</Text>
                          <Text style={{ marginHorizontal: 15, marginVertical: 10 }}>Dos puntos de vista, de Uwe Johnson</Text>
          
                          <Text style={{ marginHorizontal: 15, marginVertical:5, fontWeight: 'bold'}}>Fran_Cisco respondió al tema el día 3/3/2019 a las 17:46:16:</Text>
                          <Text style={{ marginHorizontal: 15, marginVertical: 10 }}>Puede que te guste "El capitán Alatriste" de Arturo Pérez-Reverte, a mi me resultó muy entretenido. Si te gusta, hay otros 6 libros para leer.</Text>
                                  
                          <Card style={{ container: { backgroundColor: 'lightgreen', marginVertical: 10, marginHorizontal: 25 } }}>
                            <Text style={{ textAlign: 'center', marginVertical: 15, fontSize:18, fontWeight: "bold"}}>Comentario</Text>
                              
                            <View style={{ marginHorizontal: 20 }}>
                              <Text style={{ color: '#585858'}}>Respuesta</Text>
                              <TextInput multiline={true} style={{ borderBottomColor: '#585858', borderBottomWidth: 1, marginVertical: 4 }} value={this.state.response} onChangeText={(r) => this.setState({ response: r })} />
                            </View>
                                      
                            <Button primary raised text="Comentar" style={{ container: { margin: 20 }}} onPress={this.addComment} />
                          </Card>
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
          if(this.state.active == 'comments') {
            return (
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
            )
          }
        })()}
          
        <ActionButton buttonColor="rgba(231,76,60,1)" style={{ marginBottom: 40 }}>
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

        <BottomNavigation>
          <BottomNavigation.Action key="valorations" icon="edit" label="Valoraciones" 
            onPress={() => this.setState({ active: 'valorations' })} />
          <BottomNavigation.Action key="comment" icon="comment" label="Comentarios"
            onPress={() => this.setState({ active: 'comments' })} />
        </BottomNavigation>

        <Snackbar visible={this.state.snack_visible} message={this.state.message} timeout={2000} onRequestClose={() => this.setState({ snack_visible: false })} />
      </View>
    );
  }
}