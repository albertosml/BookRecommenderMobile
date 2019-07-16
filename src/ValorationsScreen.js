import React from "react";
import {ScrollView, Text, View, AsyncStorage } from "react-native";
import {Card} from 'react-native-material-ui';
import Menu from './Menu';
import Footer from './Footer';
import Swiper from 'react-native-swiper';
import StarRating from 'react-native-star-rating';
import Icon from 'react-native-vector-icons/FontAwesome';

export default class ValorationsScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      valoraciones: [],
      itemsPerPage: 4,
      username: ''
    };
  }

  async componentWillMount() {
    var username = await AsyncStorage.getItem('username');
    if(username != undefined && username.length > 0) this.setState({ username: username });
    else this.props.navigation.navigate('Home');

    fetch('http://35.180.69.250:3000/valorations',{
        method: 'POST',
        body: JSON.stringify({ username: this.state.username, isbn: null }),
        headers: {
           'Accept': 'application/json',
           'Content-Type': 'application/json'
        }
    })
        .then(res => res.json())
        .then(data => {
          this.setState({ valoraciones: data.array, num_total_valoraciones: data.countValorations  });
        })
        .catch(err => console.log(err));
  }

  render() {
    var numPages = this.state.valoraciones.length / this.state.itemsPerPage;
    var longitud = this.state.valoraciones.length % this.state.itemsPerPage == 0 ? numPages : numPages+1;
    return (
      <View style={{flex: 1}}>
        <Menu navigation={this.props.navigation} />
        <Text style={{ textAlign: 'center', fontSize: 30, margin: 10 }}>Mis valoraciones</Text>
        {(() => {
          if(this.state.valoraciones.length == 0) {
            return (
              <ScrollView style={{ margin: 10, backgroundColor: 'lightgray' }}>
                <Text style={{ color: 'green', fontSize: 24, margin: 25, textAlign: 'center'}}>No ha realizado ninguna valoración</Text>
              </ScrollView>
            )
          }
          else {
            return (
              <Swiper style={{ margin: 10, backgroundColor: 'lightgray' }} showsButtons={false}>
                {
                  Array.from({length: longitud}, (v,i) => i*this.state.itemsPerPage).map((i) => {
                    return (
                      <ScrollView key={i}>
                        {
                          this.state.valoraciones.slice(i,i+this.state.itemsPerPage).map((valoracion) => {
                            return (
                              <Card key={valoracion.id} style={{ container: { backgroundColor: 'orange', marginHorizontal: 34, marginVertical: 15}}}>
                                <Text style={{ color: 'white', textAlign: 'center', fontSize: 16, marginTop: 5 }}>{valoracion.book}</Text>
                                <Text style={{ marginHorizontal: 15, marginVertical:5, fontWeight: 'bold'}}>{valoracion.user} realizó esta valoración el día {valoracion.fecha} a las {valoracion.hora}:</Text>
                                <Text style={{ marginHorizontal: 15, marginVertical: 10 }}>{valoracion.description}</Text>
                                
                                <View style={{ flexDirection: 'row'}}>
                                  <Text style={{ marginHorizontal: 15, marginVertical:5, fontWeight: 'bold'}}>Nota:</Text>
                                  <StarRating disabled={true} maxStars={5} rating={valoracion.note} starStyle={{ margin:2 }} starSize={22} emptyStarColor="lightgray" fullStarColor="yellow"/>
                                </View> 
      
                                <View style={{ flexDirection: 'row', justifyContent: 'flex-end', margin:3}}>
                                  <Icon name="thumbs-up" size={24}/>
                                  <Text> {valoracion.likes}   </Text>
                                  <Icon name="thumbs-down" size={24}/>
                                  <Text> {valoracion.dislikes}   </Text>
                                </View>
                              </Card>
                            )
                          })
                        }
                      </ScrollView>
                    )
                  })
                }
              </Swiper> 
            )
          }
        })()}
        <Footer navigation={this.props.navigation} />
      </View>
    );
  }
}