import BookDetailsScreen from './src/BookDetailsScreen';
import BooksScreen from './src/BooksScreen';
import DetailsScreen from './src/DetailsScreen';
import EditBookScreen from './src/EditBookScreen';
import FreeThemesScreen from './src/FreeThemesScreen';
import GenresScreen from './src/GenresScreen';
import HomeScreen from './src/HomeScreen';
import NewBookScreen from './src/NewBookScreen';
import NewSuggestionScreen from './src/NewSuggestionScreen';
import NewUserScreen from './src/NewUserScreen';
import PendingBooksScreen from './src/PendingBooksScreen';
import ProfileScreen from './src/ProfileScreen';
import ReadedBooksScreen from './src/ReadedBooksScreen';
import RecommendedBooksScreen from './src/RecommendedBooksScreen';
import StartSessionScreen from './src/StartSessionScreen';
import SuggestionsScreen from './src/SuggestionsScreen';
import ValorationsScreen from './src/ValorationsScreen';
import { createDrawerNavigator, createAppContainer } from 'react-navigation';
import Sidebar from './src/Sidebar'
import React from 'react';

const drawer = createDrawerNavigator(
    {
        BookDetails: { screen: BookDetailsScreen },
        Books: { screen: BooksScreen },
        Details: { screen: DetailsScreen },
        EditBook: { screen: EditBookScreen },
        FreeThemes: { screen: FreeThemesScreen },
        Genres: { screen: GenresScreen },
        Home: { screen: HomeScreen },
        NewBook: { screen: NewBookScreen },
        NewSuggestion: { screen: NewSuggestionScreen },
        NewUser: { screen: NewUserScreen },
        PendingBooks: { screen: PendingBooksScreen },
        Profile: { screen: ProfileScreen },
        ReadedBooks: { screen: ReadedBooksScreen },
        RecommendedBooks: { screen: RecommendedBooksScreen },
        StartSession: { screen: StartSessionScreen },
        Suggestions: { screen: SuggestionsScreen },
        Valorations: { screen: ValorationsScreen }
    }, 
    {
        initialRouteName: 'Home',
        contentComponent: Sidebar,
        drawerWidth: 300
    }
);

export default createAppContainer(drawer);