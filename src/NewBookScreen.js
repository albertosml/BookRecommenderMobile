import React from "react";
import {ScrollView, Text, TextInput, View, Image, AsyncStorage } from "react-native";
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
      chips_author: [],
      numpages: 0,
      publicationdate: '',
      url: '',
      publisher: '',
      language: '',
      chips: [],
      suggestions: [],
      image: '',
      username: ''
    };

    this.addBook = this.addBook.bind(this);
    this.handleAddition = this.handleAddition.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleCreateTag = this.handleCreateTag.bind(this);
    this.handleDeleteAuthor = this.handleDeleteAuthor.bind(this);
    this.handleNewAuthor = this.handleNewAuthor.bind(this);
    this.selectImage = this.selectImage.bind(this);
  }

  async componentWillMount() {
    this.setState({ username: await AsyncStorage.getItem('username') });

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

  handleNewAuthor = elem => {
    this.setState({ chips_author: this.state.chips_author.concat([ elem ]) });
  }

  handleDeleteAuthor = index => {
    let chips_author = this.state.chips_author;
    chips_author.splice(index, 1);
    this.setState({ chips_author });
  }

  addBook() {
    fetch('https://book-recommender0.herokuapp.com/book/signup',{
        method: 'POST',
        body: JSON.stringify(this.state),
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    })
        .then(res => res.json())
        .then(data => {
            if(data.msg.length == 0) this.props.navigation.navigate('BookDetails', { isbn: data.isbn });
            else this.setState({ snack_visible: true, message: data.msg });
        })
        .catch(err => console.log(err));
  }

  selectImage = async() => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4,3],
      base64: true
    });
    
    if(!result.cancelled) this.setState({ image: 'data:image/png;base64,' + result.base64 });
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
              <AutoTags tagsSelected={this.state.chips_author} createTagOnSpace={true} onCustomTagCreated={this.handleNewAuthor} handleDelete={this.handleDeleteAuthor} placeholder="Añada los autores..." />
              <Text style={{ color: '#585858'}}>Escriba el nombre de los autores separados por comas.</Text>
            </View> 

            <View style={{ marginHorizontal: 20, marginVertical: 10 }}>
              <Text style={{ color: '#585858'}}>Número de páginas</Text>
              <TextInput keyboardType={"number-pad"} style={{ borderBottomColor: '#585858', borderBottomWidth: 1, marginVertical: 4 }} value={`${this.state.numpages}`} onChangeText={(n) => this.setState({ numpages: n })} />
            </View> 

            <View style={{ marginHorizontal: 20, marginVertical: 10 }}>
              <Text style={{ color: '#585858'}}>Fecha de publicación</Text>
              <DatePicker placeholder=" " date={this.state.publicationdate} mode="date" onDateChange={(date) => this.setState({ publicationdate: date })} />
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
              <AutoTags suggestions={this.state.suggestions} tagsSelected={this.state.chips} createTagOnSpace={true} onCustomTagCreated={this.handleCreateTag} handleAddition={this.handleAddition} handleDelete={this.handleDelete} placeholder="Añada un género literario que le guste" />
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