import React from "react";
import {ScrollView, Text, View, TextInput, AsyncStorage, KeyboardAvoidingView } from "react-native";
import {Card, Snackbar, Button} from 'react-native-material-ui';
import Menu from './Menu';
import Footer from './Footer';
import Swiper from 'react-native-swiper';
import { MaterialDialog } from 'react-native-material-dialog';

export default class FreeThemesScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      temas: [],
      snack_visible: false,
      message: '', 
      response: '',
      title: '',
      description: '',
      dialog_comment: false,
      username: ''
    };

    this.addComment = this.addComment.bind(this);
    this.addTheme = this.addTheme.bind(this);
    this.getThemes = this.getThemes.bind(this);
  }

  async componentWillMount() {
    var username = await AsyncStorage.getItem('username') ;
    if(username != undefined) this.setState({ username: username });

    this.getThemes();
  }

  getThemes(){
    fetch('https://book-recommender0.herokuapp.com/themes',{
        method: 'POST',
        body: JSON.stringify({ book: null, username: this.state.username }),
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    })
        .then(res => res.json())
        .then(data => {
            this.setState({ temas: data.array  });
        })
        .catch(err => console.log(err));
  }

  addTheme(){
    fetch('https://book-recommender0.herokuapp.com/theme/signup',{
        method: 'POST',
        body: JSON.stringify({ title: this.state.title, description: this.state.description, isbn: null, username: this.state.username }),
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    })
        .then(res => res.json())
        .then(data => {
            if(data.msg.length == 0) {
              this.setState({ snack_visible: true, message: 'Tema Creado', title: '', description: '' });
              this.getThemes();
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
              this.getThemes();
            }
            else this.setState({ snack_visible: true, message: data.msg });
        })
        .catch(err => console.log(err));
  }

  render() {
    return (
      <View style={{flex: 1}}>
        <Menu navigation={this.props.navigation} />
        <Text style={{ textAlign: 'center', fontSize: 30, margin: 10 }}>Temas</Text>
        
        {(() => {
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
        )()}

        {(() => {
          if(this.state.username != "admin" && this.state.username.length > 0) {
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

        <Snackbar visible={this.state.snack_visible} message={this.state.message} timeout={2000} onRequestClose={() => this.setState({ snack_visible: false })} />
        <Footer navigation={this.props.navigation} />
      </View>
    );
  }
}