import React from "react";
import { ScrollView, View, Text, Image } from "react-native";
import Menu from './Menu';
import Footer from './Footer';

export default class DetailsScreen extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={{flex: 1}}>
        <Menu navigation={this.props.navigation} />
        <ScrollView style={{ marginTop: 6}}>
        <Text style={{ textAlign: 'center', fontSize: 30, margin: 10 }}>Detalles</Text>
          <View style={{flex: 1, flexDirection: 'row', marginLeft: 20, marginRight: 20}}>
            <View style={{ flex: 0.7 }}>
              <Text style={{ fontSize: 18, marginBottom: 8}}>
                <Text style={{ fontWeight: 'bold' }}>Nombre:</Text>
                <Text> Alberto Silvestre Montes Linares</Text>
              </Text>
              <Text style={{ fontSize: 18, marginBottom: 8}}>
                <Text style={{ fontWeight: 'bold' }}>Correo:</Text>
                <Text> albertosml@correo.ugr.es / bookrecommender0@gmail.com</Text>
              </Text>
              <Text style={{ fontSize: 18, marginBottom: 8}}>
                <Text style={{ fontWeight: 'bold' }}>Cuenta de Github:</Text>
                <Text> albertosml</Text>
              </Text>
              <Text style={{ fontSize: 18, marginBottom: 8}}>
                <Text style={{ fontWeight: 'bold' }}>Tutor del proyecto:</Text>
                <Text> Juan Manuel Fernández Luna</Text>
              </Text>
            </View>
            <View style={{flex: 0.3, height: 50, marginTop: 45}}>
              <Image source={require('./images/albertosml.png')} style={{ borderRadius:50, width:100, height:100 }} />
            </View>
          </View>
          <View style={{ marginLeft: 20, marginTop: 8, marginRight: 20, marginBottom: 7 }}>
              <Text style={{ fontWeight: 'bold', fontSize: 18, marginBottom: 3 }}>Descripción del proyecto:</Text>
              <Text style={{ fontSize: 18 }}>Este proyecto es un "Trabajo Fin de Grado" que tiene como objetivo el desarrollo de una plataforma web que permita a los usuarios registrados poder dar de alta libros que hayan leído, valorarlos y comentarlos y ponerlos a disposición de otros usuarios, que a su vez, podrán realizar las mismas acciones sobre ellos. Además, tendrá prestaciones de búsqueda de libros y recomendación de nuevos a los usuarios del sistema. El desarrollo se realizará tanto para la Web como para dispositivos móviles en forma de aplicación.</Text>
          </View>
        </ScrollView>
        <Footer navigation={this.props.navigation} />
      </View>
    );
  }
}