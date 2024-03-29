import React from "react";
import {ScrollView, Text, TextInput, View, AsyncStorage } from "react-native";
import {Card, Snackbar, Button} from 'react-native-material-ui';
import Menu from './Menu';
import Footer from './Footer';

export default class StartSessionScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      snack_visible: false,
      message: '',
      username: '',
      password: ''
    };

    this.startSession = this.startSession.bind(this);
    this.rememberPassword = this.rememberPassword.bind(this);
  }

  async componentWillMount() {
    var value = await AsyncStorage.getItem('username');
    if(value != null) this.props.navigate('Home');
  }

  startSession() {
    fetch('http://35.180.69.250:3000/users/signin',{
        method: 'POST',
        body: JSON.stringify({ username: this.state.username.trim(), password: this.state.password }),
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    })
        .then(res => res.json())
        .then(data => {
            if(data.msg.length == 0) {
              // Establezco la sesión
              AsyncStorage.setItem('username', data.username);
              this.setState({ username: '', password: ''})

              // Voy a inicio
              this.props.navigation.navigate('Home');
            }
            else this.setState({ snack_visible: true, message: data.msg, username: '', password: ''});
        })
        .catch(err => console.log(err));
  }

  rememberPassword() {
    if(this.state.username.length == 0) this.setState({ message: 'Introduzca el nombre del usuario en su campo correspondiente', snack_visible: true });
    else {
      fetch('http://35.180.69.250:3000/rememberpassword', {
          method: 'POST',
          body: JSON.stringify({ username: this.state.username }),
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        })
          .then(res => res.json())
          .then(data => {
            if(data.msg.length == 0) this.setState({ snack_visible: true, message: 'Correo enviado a: ' + data.email});
            else this.setState({ snack_visible: true, message: data.msg});
          })
          .catch(err => console.log(err));
    }
  }

  render() {
    return (
      <View style={{flex: 1}}>
        <Menu ref="menu" navigation={this.props.navigation} />
        <Text style={{ textAlign: 'center', fontSize: 30, margin: 10 }}>Iniciar Sesión</Text>
        
        <ScrollView>
          <Card style={{ container: { backgroundColor: 'lightgreen', marginVertical: 10, marginHorizontal: 25 } }}>
            <View style={{ marginHorizontal: 20, marginVertical: 10 }}>
              <Text style={{ color: '#585858'}}>Nombre de usuario/Email</Text>
              <TextInput style={{ borderBottomColor: '#585858', borderBottomWidth: 1, marginVertical: 4 }} value={this.state.username} onChangeText={(u) => this.setState({ username: u })} />
            </View> 

            <View style={{ marginHorizontal: 20, marginVertical: 10 }}>
              <Text style={{ color: '#585858'}}>Contraseña</Text>
              <TextInput secureTextEntry={true} style={{ borderBottomColor: '#585858', borderBottomWidth: 1, marginVertical: 4 }} value={this.state.password} onChangeText={(p) => this.setState({ password: p })} />
            </View> 
            
            <Button primary raised text="Iniciar" style={{ container: { margin: 20 }}} onPress={this.startSession} />

            <Button onPress={this.rememberPassword} style={{ color: 'blue', textAlign: 'center', marginVertical: 10}} text="Se me ha olvidado la contraseña" />
          </Card>
        </ScrollView>
          
        <Snackbar visible={this.state.snack_visible} message={this.state.message} timeout={2000} onRequestClose={() => this.setState({ snack_visible: false })} />
        <Footer navigation={this.props.navigation} />
      </View>
    );
  }
}