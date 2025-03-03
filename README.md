# PolyBeats

**PolyBeats** es un visualizador interactivo para representar polirritmias con polígonos regulares. Esta manera de visualizar las polirritmias se popularizó mucho en algunos bateristas creadores de contenido de Instagram, ya que es una manera muy visual y que ayuda a entender que son las polirritmias en música. Cada polígono genera cierta cantidad de sonidos dependiendo de la cantidad de vertices que lo formen. Se pueden sobreponer hasta 5 poligonos distintos, eligiendo la cantidad de vertices del 0 al 32, a partir de allí ya es como quieras combinar las posibilidades.

## Características
- **Visualización dinámica** de polirritmias con polígonos.  
- **Control de tempo** ajustable de 10 a 360 BPM.  
- **Selección de subdivisiones rítmicas** de 1 a 32 lados por polígono.  
- **Sonido sincronizado** con la animación utilizando Tone.js.  
- **Efecto de destello** cuando cada bola alcanza un vértice.  
- **Diseño minimalista e intuitivo** para experimentar ritmos de manera visual y sonora.  

## Estructura del Proyecto
```
polybeats
│── index.html       # Página principal
│── style.css        # Estilos del visualizador
│── audio.js         # Generación de sonidos
│── script.js        # Lógica de animación y renderizado
│── utils.js       # Funciones auxiliares
│── README.md        # Este archivo de documentación
```

## Cómo Ejecutarlo
1. **Descarga o clona el repositorio:**
   ```bash
   git clone https://github.com/gerarddela/polybeats.git
   cd polybeats
   ```
2. **Abre `index.html` en tu navegador** para comenzar a visualizar las polirritmias.
3. **Interactúa con la interfaz**:
   - Ajusta el tempo con el slider de BPM.
   - Cambia la subdivisión de cada polígono con los botones de colores.
   - Pulsa "Iniciar" para visualizar y escuchar los ritmos en acción.

## Tecnologías Usadas
- **HTML5 Canvas** para la representación gráfica.
- **JavaScript (ES6+)** para la lógica de animación.
- **Tone.js** para la síntesis y reproducción de sonido.
- **CSS3** para la estética y la experiencia de usuario.

## Próximas Mejoras
- Mejora de bugs y errores.
- Mejora de la estética y funcionalidad.
- Nuevos sonidos y opciones de personalización.

---

**Desarrollado por:** [Gerard de la Fuente](https://github.com/gerarddela)  
**Explora y experimenta con polirritmias de una forma visual y sonora con PolyBeats!**
