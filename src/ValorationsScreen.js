import React from "react";
import {ScrollView, Text, View } from "react-native";
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
      valoraciones: [0,1],
      itemsPerPage: 4,
      rating: 2
    };
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
                          this.state.valoraciones.slice(i,i+this.state.itemsPerPage).map((n) => {
                            return (
                              <Card key={n} style={{ container: { backgroundColor: 'orange', marginHorizontal: 34, marginVertical: 15}}}>
                                <Text style={{ color: 'white', textAlign: 'center', fontSize: 16, marginTop: 5 }}>Las lágrimas de shiva</Text>
                                <Text style={{ marginHorizontal: 15, marginVertical:5, fontWeight: 'bold'}}>albertosml realizó esta valoración el día 24/2/2019 a las 20:14:29:</Text>
                                <Text style={{ marginHorizontal: 15, marginVertical: 10 }}>No soy mucho de los libros de intriga, pero la verdad es que este libro me gustó mucho, ya que este libro te engancha en la historia desde el primer momento y, además, tiene un buen final.</Text>
                                <View style={{ flexDirection: 'row'}}>
                                  <Text style={{ marginHorizontal: 15, marginVertical:5, fontWeight: 'bold'}}>Nota:</Text>
                                  <StarRating disabled={true} maxStars={5} rating={this.state.rating} starStyle={{ margin:2}} starSize={22} emptyStarColor="lightgray" fullStarColor="yellow"/>
                                </View> 
                                <View style={{ flexDirection: 'row', justifyContent: 'flex-end', margin:3}}>
                                  <Icon name="thumbs-up" size={24}/>
                                  <Text> 1   </Text>
                                  <Icon name="thumbs-down" size={24}/>
                                  <Text> 2   </Text>
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