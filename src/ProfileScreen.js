import React from "react";
import {ScrollView, Text, TextInput, View, AsyncStorage, KeyboardAvoidingView } from "react-native";
import {Card, Snackbar, Button} from 'react-native-material-ui';
import Menu from './Menu';
import Footer from './Footer';
import AutoTags from 'react-native-tag-autocomplete';

export default class ProfileScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      snack_visible: false,
      message: '',
      username: '',
      username_old: '',
      name: '',
      name_old: '',
      surname: '',
      surname_old: '',
      email: '',
      email_old: '',
      password: '',
      confirmpassword: '',
      chips: [],
      chips_old: [],
      suggestions: []
    };

    this.addUser = this.addUser.bind(this);
    this.handleAddition = this.handleAddition.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleCreateTag = this.handleCreateTag.bind(this);
  }

  async componentWillMount() {
    var username = await AsyncStorage.getItem('username');
    if(username != undefined && username.length > 0) this.setState({ username_old: username });
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

    fetch('https://book-recommender0.herokuapp.com/user/data',{
        method: 'POST',
        body: JSON.stringify({ username: this.state.username_old }),
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    })
        .then(res => res.json())
        .then(data => { 
            this.setState({
                chips: data.generos,
                name: '',
                surname: '',
                email: '',
                chips_old: data.generos,
                name_old: data.user.name,
                surname_old: data.user.surname,
                email_old: data.user.email,
                username_old: data.user.username
            });
        })   
        .catch(err => console.log(err));
  }

  addUser() {
    fetch('https://book-recommender0.herokuapp.com/user/profile',{
        method: 'POST',
        body: JSON.stringify(this.state),
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    })
        .then(res => res.json())
        .then(data => { 
            if(data.close != undefined) {
              this.setState({ message: 'Para la próxima sesión se le habrá cambiado el nombre, por lo que se le ruega que cierre la sesión', snack_visible: true });
            }

            if(data.msg.length == 0) this.setState({ snack_visible: true, message: 'Usuario editado'}); 
            else this.setState({ snack_visible: true, message: data.msg});

            // Actualizo los cambios en el formulario
            if(this.state.username.length >0) this.setState({ username: '', username_old: this.state.username_old });
            if(this.state.name.length >0) this.setState({ name: '', name_old: this.state.name });
            if(this.state.surname.length >0) this.setState({ surname: '', surname_old: this.state.surname });
            if(this.state.email.length >0) this.setState({ email: '', email_old: this.state.email });

            // Vacío los campos relacionados con la contraseña
            this.setState({ password: '', confirmpassword: ''});
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
    this.setState({ chips: this.state.chips.concat([ elem ]) });
  }

  render() {
    return (
      <View style={{flex: 1}}>
        <Menu navigation={this.props.navigation} />
        <Text style={{ textAlign: 'center', fontSize: 30, margin: 10 }}>Perfil</Text>
        
        <View style={{flex: 1}}>
          <KeyboardAvoidingView behavior="height">
            <ScrollView>
              <Card style={{ container: { backgroundColor: 'lightgreen', marginVertical: 10, marginHorizontal: 25 } }}>
                <View style={{ marginHorizontal: 20, marginVertical: 10 }}>
                  <Text style={{ color: '#585858'}}>Nombre de usuario</Text>
                  <TextInput style={{ borderBottomColor: '#585858', borderBottomWidth: 1, marginVertical: 4 }} value={this.state.username} onChangeText={(u) => this.setState({ username: u })} />
                  <Text style={{ color: '#585858'}}>Nombre de usuario actual: {this.state.username_old}</Text>
                </View>

                <View style={{ marginHorizontal: 20, marginVertical: 10 }}>
                  <Text style={{ color: '#585858'}}>Nombre</Text>
                  <TextInput style={{ borderBottomColor: '#585858', borderBottomWidth: 1, marginVertical: 4 }} value={this.state.name} onChangeText={(n) => this.setState({ name: n })} />
                  <Text style={{ color: '#585858'}}>Nombre actual: {this.state.name_old}</Text>
                </View>

                <View style={{ marginHorizontal: 20, marginVertical: 10 }}>
                  <Text style={{ color: '#585858'}}>Apellidos</Text>
                  <TextInput style={{ borderBottomColor: '#585858', borderBottomWidth: 1, marginVertical: 4 }} value={this.state.surname} onChangeText={(s) => this.setState({ surname: s })} />
                  <Text style={{ color: '#585858'}}>Apellidos actuales: {this.state.surname_old}</Text>
                </View> 

                <View style={{ marginHorizontal: 20, marginVertical: 10 }}>
                  <Text style={{ color: '#585858'}}>Correo Electrónico</Text>
                  <TextInput keyboardType="email-address" style={{ borderBottomColor: '#585858', borderBottomWidth: 1, marginVertical: 4 }} value={this.state.email} onChangeText={(e) => this.setState({ email: e })} />
                  <Text style={{ color: '#585858'}}>Email actual: {this.state.email_old}</Text>
                </View>  

                <View style={{ marginHorizontal: 20, marginVertical: 10 }}>
                  <Text style={{ color: '#585858'}}>Contraseña</Text>
                  <TextInput secureTextEntry={true} style={{ borderBottomColor: '#585858', borderBottomWidth: 1, marginVertical: 4 }} value={this.state.password} onChangeText={(p) => this.setState({ password: p })} />
                  <Text style={{ color: '#585858'}}>Para modificar la contraseña, introduzca una nueva y confirmela.</Text>
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

                <Button primary raised text="Editar" style={{ container: { margin: 20 }}} onPress={this.addUser} />
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