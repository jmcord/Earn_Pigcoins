import matplotlib.pyplot as plt
import matplotlib.patches as patches

# Crear una figura y un conjunto de ejes
fig, ax = plt.subplots()

# Dibujar el cuerpo
cuerpo = patches.Ellipse((0.5, 0.5), 0.8, 0.6, edgecolor='black', facecolor='green')
ax.add_patch(cuerpo)

# Dibujar los ojos
ojo_izquierdo = patches.Circle((0.4, 0.6), 0.05, color='black')
ojo_derecho = patches.Circle((0.6, 0.6), 0.05, color='black')
ax.add_patch(ojo_izquierdo)
ax.add_patch(ojo_derecho)

# Dibujar las mejillas sonrientes
mejilla_izquierda = patches.Ellipse((0.35, 0.4), 0.1, 0.06, angle=0, color='pink')
mejilla_derecha = patches.Ellipse((0.65, 0.4), 0.1, 0.06, angle=0, color='pink')
ax.add_patch(mejilla_izquierda)
ax.add_patch(mejilla_derecha)

# Dibujar la nariz
nariz = patches.RegularPolygon((0.5, 0.5), numVertices=6, radius=0.05, color='black')
ax.add_patch(nariz)

# Dibujar las orejas
oreja_izquierda = patches.Ellipse((0.2, 0.7), 0.1, 0.2, angle=45, color='green')
oreja_derecha = patches.Ellipse((0.8, 0.7), 0.1, 0.2, angle=-45, color='green')
ax.add_patch(oreja_izquierda)
ax.add_patch(oreja_derecha)

# Dibujar la cola
cola = patches.FancyArrowPatch((0.2, 0.2), (0.1, 0.3), color='pink', mutation_scale=20)
ax.add_patch(cola)

# Dibujar la boca sonriente
boca = patches.Arc((0.5, 0.4), width=0.2, height=0.1, angle=0, theta1=200, theta2=340, color='black', linestyle='-', lw=2)
ax.add_patch(boca)

# Configurar ejes
ax.set_xlim(0, 1)
ax.set_ylim(0, 1)
ax.set_aspect('equal', adjustable='box')
ax.axis('off')

# Mostrar el dibujo del cerdo
plt.show()
