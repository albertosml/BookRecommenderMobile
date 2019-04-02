import React from "react";
import {ScrollView, Text, TextInput, View } from "react-native";
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
      username_old: 'albertosml',
      name: '',
      name_old: 'Alberto Silvestre',
      surname: '',
      surname_old: 'Montes Linares',
      email: '',
      email_old: 'alberto.silvestre28@gmail.com',
      password: '',
      confirm_password: '',
      genres: [{ name: 'Perd' }],
      genres_old: [{ name: 'Perd' }],
      suggestions: [{ name: 'Mickey Mouse'}, {name: 'Alber' }]
    };

    this.addUser = this.addUser.bind(this);
    this.handleAddition = this.handleAddition.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleCreateTag = this.handleCreateTag.bind(this);
  }

  handleDelete = index => {
    // Añado el género a la lista de sugerencias
    this.setState({ suggestions: this.state.suggestions.concat([ this.state.genres[index] ]) });
    
    // Elimino el género de la lista de géneros
    let genres = this.state.genres;
    genres.splice(index, 1);
    this.setState({ genres });
  }
    
  handleAddition = suggestion => {
    // Añado el género a la lista de géneros
    this.setState({ genres: this.state.genres.concat([suggestion]) });

    // Elimino el género de las sugerencias
    let index = this.state.suggestions.indexOf(suggestion);
    let suggestions = this.state.suggestions;
    suggestions.splice(index, 1);
    this.setState({ suggestions });
  }

  handleCreateTag = elem => {
    this.setState({ genres: this.state.genres.concat([ { name: elem } ]) });
  }

  addUser() {
    console.log(this.state);
    this.setState({ message: 'Usuario modificado', snack_visible: true });
  }

  render() {
    return (
      <View style={{flex: 1}}>
        <Menu navigation={this.props.navigation} />
        <Text style={{ textAlign: 'center', fontSize: 30, margin: 10 }}>Perfil</Text>
        
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
              <TextInput secureTextEntry={true} style={{ borderBottomColor: '#585858', borderBottomWidth: 1, marginVertical: 4 }} value={this.state.confirm_password} onChangeText={(c) => this.setState({ confirm_password: c })} />
            </View> 

            <View style={{ marginHorizontal: 20, marginVertical: 10 }}>
              <Text style={{ color: '#585858'}}>Géneros Favoritos</Text>
              <AutoTags suggestions={this.state.suggestions} tagsSelected={this.state.genres} createTagOnSpace={true} onCustomTagCreated={this.handleCreateTag} handleAddition={this.handleAddition} handleDelete={this.handleDelete} placeholder="Añada un género literario que le guste" />
              <Text style={{ color: '#585858'}}>Busque su género en el autocompletado y selecciónelo con el ratón. Si no aparece, introdúzcalo manualmente y pulse la tecla de la coma (",").</Text>
            </View> 

            <Button primary raised text="Registrar" style={{ container: { margin: 20 }}} onPress={this.addUser} />
          </Card>
        </ScrollView>
          
        <Snackbar visible={this.state.snack_visible} message={this.state.message} timeout={2000} onRequestClose={() => this.setState({ snack_visible: false })} />
        <Footer navigation={this.props.navigation} />
      </View>
    );
  }
}