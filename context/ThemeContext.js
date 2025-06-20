import { createContext, useState } from 'react';
import { Appearance } from 'react-native'; // detect light/ dark mode
import { Colors } from '../constants/Colors';

// context allows for sharing of global data (theme in this case) accross the app w/out having to pass props manually to every level
export const ThemeContext = createContext({}); //create context object - global container

// ThemeProvider is react wrapper component
export const ThemeProvider = ({ children }) => {
    const [colorScheme, setColorScheme] = useState(Appearance.getColorScheme()) // get current color scheme and change it to light or dark

    const theme = colorScheme === 'dark' ? Colors.dark : Colors.light

    return (
       // .Provider makes colorScheme, setColorScheme and theme available to any component inside 
        <ThemeContext.Provider value={{
            colorScheme, setColorScheme, theme
        }}>
            {children}
        </ThemeContext.Provider>
    )
}