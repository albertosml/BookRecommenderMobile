import React from "react";
import {ScrollView, Text, View, TextInput } from "react-native";
import {Card, Snackbar, Button} from 'react-native-material-ui';
import Menu from './Menu';
import Footer from './Footer';
import Swiper from 'react-native-swiper';

export default class FreeThemesScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      temas: [0,1,2],
      snack_visible: false,
      message: '', 
      response: '',
      title: '',
      description: ''
    };

    this.addComment = this.addComment.bind(this);
    this.addTheme = this.addTheme.bind(this);
  }

  addTheme() {
    console.log(this.state);
    this.setState({ message: 'Tema añadido', snack_visible: true, response: '' });
  }

  addComment() {
    console.log(this.state);
    this.setState({ message: 'Comentario añadido', snack_visible: true });
  }

  render() {
    return (
      <View style={{flex: 1}}>
        <Menu navigation={this.props.navigation} />
        <Text style={{ textAlign: 'center', fontSize: 30, margin: 10 }}>Temas</Text>
        {(() => {
          if(this.state.temas.length == 0) {
            return (
              <ScrollView style={{ margin: 10, backgroundColor: 'orange' }}>
                <Text style={{ color: 'green', fontSize: 24, margin: 25, textAlign: 'center'}}>No hay temas añadidos</Text>
              </ScrollView>
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
        })()}

        <Swiper>
          <ScrollView>
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
          </ScrollView>
        </Swiper>
          
        <Snackbar visible={this.state.snack_visible} message={this.state.message} timeout={2000} onRequestClose={() => this.setState({ snack_visible: false })} />
        <Footer navigation={this.props.navigation} />
      </View>
    );
  }
}