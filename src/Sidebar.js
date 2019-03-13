import React, { Component } from 'react';
import { ScrollView, Image, Text } from 'react-native';
import { Drawer, Avatar, COLOR, ThemeContext, getTheme } from 'react-native-material-ui';
import { Constants } from 'expo';

const uiTheme = {
    drawerHeaderListItem: {
      primaryText: { color: 'white' },
      secondaryText: { color: 'white' },
      tertiaryText: { color: COLOR.blue500 }
    }
  };

export default class Sidebar extends Component {
    constructor() {
        super();
        this.state = {
            username: 'admin'
        };
    }

    render() {
        return (
            <ScrollView style={{ marginTop: Constants.statusBarHeight }}>
                <Drawer>
                    <Drawer.Header
                        image={<Image source={require('./images/libros.jpg')} />}
                    >
                        <ThemeContext.Provider value={getTheme(uiTheme)}>
                            <Drawer.Header.Account
                                avatar={<Avatar icon="person" style={{ container: { backgroundColor: 'green', marginTop:24 }}}  />}
                                footer={{
                                    dense: true,
                                    centerElement: {
                                        primaryText: 'albertosml',
                                        secondaryText: 'Alberto Silvestre Montes Linares',
                                        tertiaryText: 'Abandonar Sesión'
                                    }
                                }}
                            />
                        </ThemeContext.Provider>
                            
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


