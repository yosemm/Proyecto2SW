import { createContext, useState, useEffect } from 'react';

export const ThemeContext = createContext();

export function ThemeProvider({ children }) {

    const [tema, setTema] = useState(
        () => localStorage.getItem('tema') || 'claro'
    );

    useEffect(() => {
        document.body.setAttribute('data-theme', tema);
        localStorage.setItem('tema', tema);
    }, [tema]);

    const cambiarTema = () => {
        setTema((prevTema) => (prevTema === 'claro' ? 'oscuro' : 'claro'));
    };

    return (
        <ThemeContext.Provider value={{
            tema, cambiarTema
        }}>
            {children}
        </ThemeContext.Provider>
    );
}