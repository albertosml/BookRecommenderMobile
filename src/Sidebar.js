import React, { Component } from 'react';
import { ScrollView, Image, Text, View, AsyncStorage } from 'react-native';
import { Drawer, Avatar, COLOR } from 'react-native-material-ui';
import { Constants } from 'expo';

export default class Sidebar extends Component {
    constructor(props) {
        super(props);
        this.state = {
          username: '', 
          name: ''
        };
    
        this.closeSession = this.closeSession.bind(this);
    }   

    async shouldComponentUpdate() {
        var value = await AsyncStorage.getItem('username');
        if(value == null) value = '';
        
        if(value != this.state.username) {
            this.setState({ username: value });
            return true;
        }
        else return false;
    }

    closeSession() {
        AsyncStorage.setItem('username', '');
        this.setState({ username: '' });
        this.props.navigation.navigate('Home');
    }
    
    render() {
        return (
            <ScrollView style={{ marginTop: Constants.statusBarHeight }}>
                <Drawer>
                    <Drawer.Header
                        image={<Image source={require('./images/libros.jpg')} />}
                    >
                        <Drawer.Header.Account
                            avatar={<Avatar icon="person" style={{ container: { backgroundColor: 'green' }}} />}
                            footer={{
                                dense: true,
                                centerElement:
                                    <View style={{ marginBottom: 25}}>
                                        <Text style={{ color: 'white' }}>{this.state.username.length > 0 ? this.state.username : 'No conectado'}</Text>
                                        <Text style={{ color: 'white' }}>{this.state.name.length > 0 ? this.state.name : ''}</Text>
                                        {(() => {
                                            if(this.state.username.length > 0 && this.state.username != undefined) return <Text style={{ color: COLOR.blue500 }} onPress={this.closeSession}>Abandonar Sesión</Text>;
                                            else return <Text style={{ color: COLOR.blue500 }} onPress={() => this.props.navigation.navigate('StartSession')}>Iniciar Sesión</Text>;
                                        })()}
                                    </View>
                            }}
                        />                    
                    </Drawer.Header>
                    {(() => {
                        if(this.state.username == "admin") {
                            return (
                                <Drawer.Section
                                    title="Opciones"
                                    divider
                                    items={[
                                        { icon: 'home', value: 'Inicio', onPress: () => this.props.navigation.navigate('Home') },
                                        { icon: 'person', value: 'Perfil', onPress: () => this.props.navigation.navigate('Profile') },
                                        { icon: 'remove-red-eye', key:'suggestions' ,value: 'Ver Sugerencias', onPress: () => this.props.navigation.navigate('Suggestions') },
                                        { icon: 'remove-red-eye', key:'themes' ,value: 'Ver Libros', onPress: () => this.props.navigation.navigate('Books') },
                                        { icon: 'remove-red-eye', value: 'Ver Géneros', onPress: () => this.props.navigation.navigate('Genres') },
                                        { icon: 'edit', value: 'Nueva Noticia', onPress: () => this.props.navigation.navigate('NewSuggestion') }
                                    ]}
                                />
                            )
                        }
                        else if(this.state.username.length > 0) {
                            return (
                                <Drawer.Section
                                    title="Opciones"
                                    divider
                                    items={[
                                        { icon: 'home', value: 'Inicio', onPress: () => this.props.navigation.navigate('Home') },
                                        { icon: 'person', value: 'Perfil', onPress: () => this.props.navigation.navigate('Profile') },
                                        { icon: 'book', value: 'Registrar Libro', onPress: () => this.props.navigation.navigate('NewBook') },
                                        { icon: 'edit', value: 'Nueva Sugerencia', onPress: () => this.props.navigation.navigate('NewSuggestion') },
                                        { icon: 'remove-red-eye', key: 'themes', value: 'Temas Libres', onPress: () => this.props.navigation.navigate('FreeThemes') },
                                        { icon: 'remove-red-eye', value: 'Ver Libros Añadidos', onPress: () => this.props.navigation.navigate('Books') },
                                        { icon: 'book', value: 'Mis Valoraciones', key: 'valoraciones', onPress: () => this.props.navigation.navigate('Valorations') },
                                        { icon: 'book', value: 'Mis Libros Pendientes', key: 'pendientes', onPress: () => this.props.navigation.navigate('PendingBooks') },
                                        { icon: 'book', value: 'Mis Libros Leidos', key: 'leidos', onPress: () => this.props.navigation.navigate('ReadedBooks') },
                                        { icon: 'book', value: 'Mis libros Recomendados', key: 'recomendados', onPress: () => this.props.navigation.navigate('RecommendedBooks') },
                                    ]}
                                />
                            )
                        }
                        else {
                            return (
                                <Drawer.Section
                                    title="Opciones"
                                    divider
                                    items={[
                                        { icon: 'home', value: 'Inicio', onPress: () => this.props.navigation.navigate('Home') },
                                        { icon: 'person', value: 'Registrar Usuario', onPress: () => this.props.navigation.navigate('NewUser') },
                                        { icon: 'book', value: 'Registrar Libro', onPress: () => this.props.navigation.navigate('NewBook') },
                                        { icon: 'edit', value: 'Nueva Sugerencia', onPress: () => this.props.navigation.navigate('NewSuggestion') },
                                        { icon: 'remove-red-eye', key:'themes' ,value: 'Temas Libres', onPress: () => this.props.navigation.navigate('FreeThemes') },
                                        { icon: 'remove-red-eye', value: 'Ver Libros Añadidos', onPress: () => this.props.navigation.navigate('Books') }
                                    ]}
                                />
                            )
                        }
                    })()}
                </Drawer>
            </ScrollView>
        )
    }
}


