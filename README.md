# Backlog de Videojuegos

Esta aplicación está pensada para poder gestionar tu catálogo de videojuegos y obtener gráficas acerca de tu libreria.

*   **URL Demo en Vercel (Frontend):** https://proyecto2swdeploy.vercel.app/
*   **URL Pública en Render (Backend):** https://proyecto2sw.onrender.com

## Capturas de Pantalla de la Aplicación

### Interfaz en Modo Claro

### Interfaz en Modo Oscuro

### Panel de Gráficas


## Mi Gráfica Original

Hice un gráfico de líneas que muestra el Estado Actual del Backlog. El gráfico te muestra si tu backlog está siendo jugado realmente. Por ejemplo, si Pendientes está muy arriba de Completados, es necesario empezar a jugar antes de comprar más juegos.

![screenshots/graficaestadobacklog.png](screenshots/graficaestadobacklog.png)

## Mis 3 Decisiones Técnicas

- Organicé 9 acciones en `itemsReducer.js`, las que tocan los datos (`HIDRATAR`, `AGREGAR`, `ELIMINAR`, `CAMBIAR_ESTADO`), y las de la UI (`FILTRAR_CATEGORIA`, `FILTRAR_ESTADO`, `SET_BUSQUEDA`, `LIMPIAR_FILTROS`). Así el código queda limpio y fácil de cambiar.

- La acción más complicada fue `CAMBIAR_ESTADO` ya que quería mantener el reducer sin efectos secundarios. Empecé utilizando `new Date().toISOString()` dentro del reducer pero no funcionaba. La solución fue calcular la fecha en el componente y pasarla en el payload.

- La gráfica más complicada fue la de Actividad en los Últimos 7 Días, ya que era necesario convertir las fechas ISO en un formato que entienda Recharts. Hice un mapa con los 7 días, se recorren los items, se extrae la fecha de cada uno y se cuentan las interacciones por día.