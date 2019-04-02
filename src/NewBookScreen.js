import React from "react";
import {ScrollView, Text, TextInput, View, Image } from "react-native";
import {Card, Snackbar, Button} from 'react-native-material-ui';
import Menu from './Menu';
import Footer from './Footer';
import AutoTags from 'react-native-tag-autocomplete';
import DatePicker from 'react-native-datepicker';
import { ImagePicker } from 'expo';

export default class NewBookScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      snack_visible: false,
      message: '',
      isbn: '',
      title: '',
      authors: [],
      numpages: 0,
      publication_date: '',
      url: '',
      publisher: '',
      language: '',
      genres: [],
      suggestions: [{ name: 'Mickey Mouse'}, {name: 'Alber' }],
      image: ''
    };

    this.addBook = this.addBook.bind(this);
    this.handleAddition = this.handleAddition.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleCreateTag = this.handleCreateTag.bind(this);
    this.handleDeleteAuthor = this.handleDeleteAuthor.bind(this);
    this.handleNewAuthor = this.handleNewAuthor.bind(this);
    this.selectImage = this.selectImage.bind(this);
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

  handleNewAuthor = elem => {
    this.setState({ authors: this.state.authors.concat([ { name: elem } ]) });
  }

  handleDeleteAuthor = index => {
    let authors = this.state.authors;
    authors.splice(index, 1);
    this.setState({ authors });
  }

  addBook() {
    this.setState({ message: 'Libro registrado', snack_visible: true });
  }

  selectImage = async() => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4,3],
      base64: true
    });
    
    if(!result.cancelled) this.setState({ image: result.base64 });
  }

  render() {
    return (
      <View style={{flex: 1}}>
        <Menu navigation={this.props.navigation} />
        <Text style={{ textAlign: 'center', fontSize: 30, margin: 10 }}>Nuevo Libro</Text>
        
        <ScrollView>
          <Card style={{ container: { backgroundColor: 'lightgreen', marginVertical: 10, marginHorizontal: 25 } }}>
            <View style={{ marginHorizontal: 20, marginVertical: 10 }}>
              <Text style={{ color: '#585858'}}>ISBN</Text>
              <TextInput style={{ borderBottomColor: '#585858', borderBottomWidth: 1, marginVertical: 4 }} value={this.state.isbn} onChangeText={(i) => this.setState({ isbn: i })} />
              <Text style={{ color: '#585858'}}>Para rellenado automático, introduzca el ISBN del libro para que sean rellenados los campos, excepto los géneros y la imagen. En el caso de que no podamos proporcionarle los datos, rellénelos usted mismo.</Text>
            </View>

            <View style={{ marginHorizontal: 20, marginVertical: 10 }}>
              <Text style={{ color: '#585858'}}>Título</Text>
              <TextInput style={{ borderBottomColor: '#585858', borderBottomWidth: 1, marginVertical: 4 }} value={this.state.title} onChangeText={(t) => this.setState({ title: t })} />
            </View>

            <View style={{ marginHorizontal: 20, marginVertical: 10 }}>
              <Text style={{ color: '#585858'}}>Autores</Text>
              <AutoTags tagsSelected={this.state.authors} createTagOnSpace={true} onCustomTagCreated={this.handleNewAuthor} handleDelete={this.handleDeleteAuthor} placeholder="Añada los autores..." />
              <Text style={{ color: '#585858'}}>Escriba el nombre de los autores separados por comas.</Text>
            </View> 

            <View style={{ marginHorizontal: 20, marginVertical: 10 }}>
              <Text style={{ color: '#585858'}}>Número de páginas</Text>
              <TextInput keyboardType={"number-pad"} style={{ borderBottomColor: '#585858', borderBottomWidth: 1, marginVertical: 4 }} value={`${this.state.numpages}`} onChangeText={(n) => this.setState({ numpages: n })} />
            </View> 

            <View style={{ marginHorizontal: 20, marginVertical: 10 }}>
              <Text style={{ color: '#585858'}}>Fecha de publicación</Text>
              <DatePicker placeholder=" " date={this.state.publication_date} mode="date" onDateChange={(date) => this.setState({ publication_date: date })} />
            </View>  

            <View style={{ marginHorizontal: 20, marginVertical: 10 }}>
              <Text style={{ color: '#585858'}}>URL</Text>
              <TextInput style={{ borderBottomColor: '#585858', borderBottomWidth: 1, marginVertical: 4 }} value={this.state.url} onChangeText={(u) => this.setState({ url: u })} />
            </View> 

            <View style={{ marginHorizontal: 20, marginVertical: 10 }}>
              <Text style={{ color: '#585858'}}>Editorial</Text>
              <TextInput style={{ borderBottomColor: '#585858', borderBottomWidth: 1, marginVertical: 4 }} value={this.state.publisher} onChangeText={(p) => this.setState({ publisher: p })} />
            </View> 

            <View style={{ marginHorizontal: 20, marginVertical: 10 }}>
              <Text style={{ color: '#585858'}}>Idioma</Text>
              <TextInput style={{ borderBottomColor: '#585858', borderBottomWidth: 1, marginVertical: 4 }} value={this.state.language} onChangeText={(l) => this.setState({ language: l })} />
            </View> 

            <View style={{ marginHorizontal: 20, marginVertical: 10 }}>
              <Text style={{ color: '#585858'}}>Géneros Favoritos</Text>
              <AutoTags suggestions={this.state.suggestions} tagsSelected={this.state.genres} createTagOnSpace={true} onCustomTagCreated={this.handleCreateTag} handleAddition={this.handleAddition} handleDelete={this.handleDelete} placeholder="Añada un género literario que le guste" />
              <Text style={{ color: '#585858'}}>Busque su género en el autocompletado y selecciónelo con el ratón. Si no aparece, introdúzcalo manualmente y pulse la tecla de la coma (",").</Text>
            </View> 

            <View style={{ marginHorizontal: 20, marginVertical: 10 }}>
              <Text style={{ color: '#585858' }}>Imagen</Text>
              {(() => {
                if(this.state.image) {
                  return <Image source={{ uri: 'data:image/png;base64,' + this.state.image }} style={{ width:200, height:200, marginLeft: 'auto', marginRight: 'auto', marginTop: 10 }} />
                }
              })()}
              <Button accent raised text="Seleccionar imagen" style={{ container: { margin:20 }}} onPress={this.selectImage} />
            </View> 

            <Button primary raised text="Registrar" style={{ container: { margin: 20 }}} onPress={this.addBook} />
          </Card>
        </ScrollView>
          
        <Snackbar visible={this.state.snack_visible} message={this.state.message} timeout={2000} onRequestClose={() => this.setState({ snack_visible: false })} />
        <Footer navigation={this.props.navigation} />
      </View>
    );
  }
}