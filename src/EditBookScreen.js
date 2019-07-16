import React from "react";
import {ScrollView, Text, TextInput, View, Image, Linking, KeyboardAvoidingView } from "react-native";
import {Card, Snackbar, Button} from 'react-native-material-ui';
import Menu from './Menu';
import Footer from './Footer';
import AutoTags from 'react-native-tag-autocomplete';
import DatePicker from 'react-native-datepicker';
import { ImagePicker } from 'expo';

export default class EditBookScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      snack_visible: false,
      message: '',
      isbn: '',
      title: '',
      title_old: '',
      chips_author: [],
      chips_author_old: [],
      numpages: 0,
      numpages_old: 0,
      publicationdate: '',
      publicationdate_old: '',
      url: '',
      url_old: '',
      publisher: '',
      publisher_old: '',
      language: '',
      language_old: '',
      chips: [],
      chips_old: [],
      suggestions: [],
      image: ''
    };

    this.editBook = this.editBook.bind(this);
    this.handleAddition = this.handleAddition.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleCreateTag = this.handleCreateTag.bind(this);
    this.handleDeleteAuthor = this.handleDeleteAuthor.bind(this);
    this.handleNewAuthor = this.handleNewAuthor.bind(this);
    this.selectImage = this.selectImage.bind(this);
  }

  componentWillMount() {
    fetch('http://35.180.69.250:3000/genrelist',{
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

    fetch('http://35.180.69.250:3000/book/data',{
        method: 'POST',
        body: JSON.stringify({ isbn: this.props.navigation.getParam('isbn', '') }),
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    })
        .then(res => res.json())
        .then(data => { 
            if(data.data == undefined) this.props.navigation.navigate('Home');

            this.setState({
                title_old: data.data[0].title,
                isbn: data.data[0].isbn,
                chips_author_old: data.data[0].authors,
                chips_author: data.data[0].authors,
                numpages_old: data.data[0].numpages,
                chips_old: data.genres,
                chips: data.genres
            });

            if(data.data[0].publicationdate != undefined) this.setState({ publicationdate_old: data.data[0].publicationdate.split("T")[0] });
            if(data.data[0].url != undefined) this.setState({ url_old: data.data[0].url });
            if(data.data[0].publisher != undefined) this.setState({ publisher_old: data.data[0].publisher });
            if(data.data[0].language != undefined) this.setState({ language_old: data.data[0].language });
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

  editBook() { 
    fetch('http://35.180.69.250:3000/book/edit',{
        method: 'POST',
        body: JSON.stringify(this.state),
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    })
        .then(res => res.json())
        .then(data => { 
            if(data.msg.length == 0) this.props.navigation.navigate('BookDetails', { isbn: this.state.isbn });
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
        <Text style={{ textAlign: 'center', fontSize: 30, margin: 10 }}>Editar libro con ISBN: {this.state.isbn}</Text>
        
        <View style={{flex: 1}}>
          <KeyboardAvoidingView behavior="height">
            <ScrollView>
              <Card style={{ container: { backgroundColor: 'lightgreen', marginVertical: 10, marginHorizontal: 25 } }}>
                <View style={{ marginHorizontal: 20, marginVertical: 10 }}>
                  <Text style={{ color: '#585858'}}>Título</Text>
                  <TextInput style={{ borderBottomColor: '#585858', borderBottomWidth: 1, marginVertical: 4 }} value={this.state.title} onChangeText={(t) => this.setState({ title: t })} />
                  <Text style={{ color: '#585858'}}>Título actual: {this.state.title_old}</Text>
                </View>

                <View style={{ marginHorizontal: 20, marginVertical: 10 }}>
                  <Text style={{ color: '#585858'}}>Autores</Text>
                  <AutoTags tagsSelected={this.state.chips_author} createTagOnSpace={true} onCustomTagCreated={this.handleNewAuthor} handleDelete={this.handleDeleteAuthor} placeholder="Añada los autores..." />
                  <Text style={{ color: '#585858'}}>Escriba el nombre de los autores separados por comas.</Text>
                </View> 

                <View style={{ marginHorizontal: 20, marginVertical: 10 }}>
                  <Text style={{ color: '#585858'}}>Número de páginas</Text>
                  <TextInput keyboardType={"number-pad"} style={{ borderBottomColor: '#585858', borderBottomWidth: 1, marginVertical: 4 }} value={`${this.state.numpages}`} onChangeText={(n) => this.setState({ numpages: n })} />
                  <Text style={{ color: '#585858'}}>Número de páginas actual: {this.state.numpages_old}</Text>
                </View> 

                <View style={{ marginHorizontal: 20, marginVertical: 10 }}>
                  <Text style={{ color: '#585858'}}>Fecha de publicación</Text>
                  <DatePicker placeholder=" " date={this.state.publicationdate} mode="date" onDateChange={(date) => this.setState({ publicationdate: date })} />
                  <Text style={{ color: '#585858'}}>Fecha de publicación actual: {this.state.publicationdate_old}</Text>
                </View>  

                <View style={{ marginHorizontal: 20, marginVertical: 10 }}>
                  <Text style={{ color: '#585858'}}>URL</Text>
                  <TextInput style={{ borderBottomColor: '#585858', borderBottomWidth: 1, marginVertical: 4 }} value={this.state.url} onChangeText={(u) => this.setState({ url: u })} />
                  <View style={{ flexDirection: 'row' }}>
                    <Text style={{ color: '#585858' }}>URL actual: </Text>
                    <Text style={{ color: 'blue' }} onPress={() => Linking.openURL(this.state.url_old)}>Ver URL</Text>
                  </View>
                </View> 

                <View style={{ marginHorizontal: 20, marginVertical: 10 }}>
                  <Text style={{ color: '#585858'}}>Editorial</Text>
                  <TextInput style={{ borderBottomColor: '#585858', borderBottomWidth: 1, marginVertical: 4 }} value={this.state.publisher} onChangeText={(p) => this.setState({ publisher: p })} />
                  <Text style={{ color: '#585858'}}>Editorial actual: {this.state.publisher_old}</Text>
                </View> 

                <View style={{ marginHorizontal: 20, marginVertical: 10 }}>
                  <Text style={{ color: '#585858'}}>Idioma</Text>
                  <TextInput style={{ borderBottomColor: '#585858', borderBottomWidth: 1, marginVertical: 4 }} value={this.state.language} onChangeText={(l) => this.setState({ language: l })} />
                  <Text style={{ color: '#585858'}}>Idioma actual: {this.state.language_old}</Text>
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
                      return <Image source={{ uri: this.state.image }} style={{ width:200, height:200, marginLeft: 'auto', marginRight: 'auto', marginTop: 10 }} />
                    }
                  })()}
                  <Button accent raised text="Seleccionar imagen" style={{ container: { margin:20 }}} onPress={this.selectImage} />
                  <Text style={{ color: '#585858'}}>Las imágenes que se suban a esta web deben ser libres, es decir, sin derechos de autor y, de un tamaño menor a 16MB. No nos haremos responsables de las imágenes subidas a esta web que no sean libres.</Text>
                </View> 

                <Button primary raised text="Editar" style={{ container: { margin: 20 }}} onPress={this.editBook} />
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