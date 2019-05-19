import React from "react";
import {ScrollView, Text, TextInput, View, AsyncStorage, KeyboardAvoidingView } from "react-native";
import {Card, Snackbar, Button} from 'react-native-material-ui';
import Menu from './Menu';
import Footer from './Footer';
import AutoTags from 'react-native-tag-autocomplete';

export default class NewUserScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      snack_visible: false,
      message: '',
      username: '',
      name: '',
      surname: '',
      email: '',
      password: '',
      confirmpassword: '',
      chips: [],
      suggestions: []
    };

    this.addUser = this.addUser.bind(this);
    this.handleAddition = this.handleAddition.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleCreateTag = this.handleCreateTag.bind(this);
  }

  async componentWillMount() {
    var username = await AsyncStorage.getItem('username');
    if(username != undefined && username.length > 0) this.props.navigation.navigate('Home');

    fetch('https://book-recommender0.herokuapp.com/genrelist',{
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    })
        .then(res => res.json())
        .then(data => { 
            // Preparo array de géneros de sugerencia
            let array = [];
            data.map(d => {
              array.push(d.name);
            }); 

            // Inserto array de géneros de sugerencia
            this.setState({
                suggestions: array
            });
        })   
        .catch(err => console.log(err));
  }

  addUser() {
    fetch('https://book-recommender0.herokuapp.com/users/signup',{
        method: 'POST',
        body: JSON.stringify(this.state),
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    })
        .then(res => res.json())
        .then(data => {
            if(data.msg.length == 0) {
              this.setState({ snack_visible: true, message: 'Usuario registrado con éxito' });

              // Espera a la redirección para que se vea el mensaje de arriba
              setTimeout(() => this.props.navigation.navigate('Home'), 2000);
            }
            else this.setState({ message: data.msg, snack_visible: true });
        })
        .catch(err => console.log(err));
  }

  handleDelete = index => {
    // Añado el género a la lista de sugerencias
    this.setState({ suggestions: this.state.suggestions.concat([ this.state.chips[index] ]) });
    
    // Elimino el género de la lista de géneros
    let chips = this.state.chips;
    chips.splice(index, 1);
    this.setState({ chips });
  }
    
  handleAddition = suggestion => {
    // Añado el género a la lista de géneros
    this.setState({ chips: this.state.chips.concat([suggestion]) });

    // Elimino el género de las sugerencias
    let index = this.state.suggestions.indexOf(suggestion);
    let suggestions = this.state.suggestions;
    suggestions.splice(index, 1);
    this.setState({ suggestions });
  }

  handleCreateTag = elem => {
    this.setState({ chips: this.state.chips.concat([ { name: elem } ]) });
  }

  render() {
    return (
      <View style={{flex: 1}}>
        <Menu navigation={this.props.navigation} />
        <Text style={{ textAlign: 'center', fontSize: 30, margin: 10 }}>Nuevo Usuario</Text>
        
        <View style={{flex: 1}}>
          <KeyboardAvoidingView behavior="height">
            <ScrollView>
              <Card style={{ container: { backgroundColor: 'lightgreen', marginVertical: 10, marginHorizontal: 25 } }}>
                <View style={{ marginHorizontal: 20, marginVertical: 10 }}>
                  <Text style={{ color: '#585858'}}>Nombre de usuario</Text>
                  <TextInput style={{ borderBottomColor: '#585858', borderBottomWidth: 1, marginVertical: 4 }} value={this.state.username} onChangeText={(u) => this.setState({ username: u })} />
                </View>

                <View style={{ marginHorizontal: 20, marginVertical: 10 }}>
                  <Text style={{ color: '#585858'}}>Nombre</Text>
                  <TextInput style={{ borderBottomColor: '#585858', borderBottomWidth: 1, marginVertical: 4 }} value={this.state.name} onChangeText={(n) => this.setState({ name: n })} />
                </View>

                <View style={{ marginHorizontal: 20, marginVertical: 10 }}>
                  <Text style={{ color: '#585858'}}>Apellidos</Text>
                  <TextInput style={{ borderBottomColor: '#585858', borderBottomWidth: 1, marginVertical: 4 }} value={this.state.surname} onChangeText={(s) => this.setState({ surname: s })} />
                </View> 

                <View style={{ marginHorizontal: 20, marginVertical: 10 }}>
                  <Text style={{ color: '#585858'}}>Correo Electrónico</Text>
                  <TextInput keyboardType="email-address" style={{ borderBottomColor: '#585858', borderBottomWidth: 1, marginVertical: 4 }} value={this.state.email} onChangeText={(e) => this.setState({ email: e })} />
                </View>  

                <View style={{ marginHorizontal: 20, marginVertical: 10 }}>
                  <Text style={{ color: '#585858'}}>Contraseña</Text>
                  <TextInput secureTextEntry={true} style={{ borderBottomColor: '#585858', borderBottomWidth: 1, marginVertical: 4 }} value={this.state.password} onChangeText={(p) => this.setState({ password: p })} />
                </View> 

                <View style={{ marginHorizontal: 20, marginVertical: 10 }}>
                  <Text style={{ color: '#585858'}}>Confirmar Contraseña</Text>
                  <TextInput secureTextEntry={true} style={{ borderBottomColor: '#585858', borderBottomWidth: 1, marginVertical: 4 }} value={this.state.confirmpassword} onChangeText={(c) => this.setState({ confirmpassword: c })} />
                </View> 

                <View style={{ marginHorizontal: 20, marginVertical: 10 }}>
                  <Text style={{ color: '#585858'}}>Géneros Favoritos</Text>
                  <AutoTags suggestions={this.state.suggestions} tagsSelected={this.state.chips} createTagOnSpace={true} onCustomTagCreated={this.handleCreateTag} handleAddition={this.handleAddition} handleDelete={this.handleDelete} placeholder="Añada un género literario que le guste" />
                  <Text style={{ color: '#585858'}}>Busque su género en el autocompletado y selecciónelo con el ratón. Si no aparece, introdúzcalo manualmente y pulse la tecla de la coma (",").</Text>
                </View> 

                <Button primary raised text="Registrar" style={{ container: { margin: 20 }}} onPress={this.addUser} />
              </Card>
            </ScrollView>
          </KeyboardAvoidingView>
        </View>
          
        <Snackbar visible={this.state.snack_visible} message={this.state.message} timeout={2000} onRequestClose={() => this.setState({ snack_visible: false })} />
        <Footer navigation={this.props.navigation} />
      </View>
    );
  }
}