# Resumen de comportamiento

## Objetivo

El usuario debe poder gestionar sus tarjetas guardadas sin encontrarse con etiquetas bloqueantes poco claras. La interfaz debe explicar la causa de cada limitacion y ofrecer un camino accionable: cambiar tarjeta, seleccionar predeterminada, ir a suscripciones o cancelar renovacion.

## Pantallas

### Mis tarjetas guardadas

Muestra cada tarjeta en una fila con:

- Marca, ultimos 4 digitos y caducidad.
- Etiqueta "Predeterminada" solo cuando aplica.
- Nota "Usada en: {suscripcion}" cuando la tarjeta esta asociada a una renovacion.
- Acceso "Ver Mis suscripciones" junto a la nota de uso.
- Botones por fila: "Eliminar" y "Seleccionar como predeterminado".

No se muestran etiquetas "No borrable".

### Mis suscripciones

Muestra cada suscripcion con:

- Estado.
- Tipo de suscripcion.
- Fecha de renovacion o caducidad.
- Tarjeta asociada, bajo la fecha.
- Activaciones en dispositivos.
- Acciones "Mas informacion", "Cancelar renovacion" y "Cambiar metodo de pago" cuando hay renovacion.

## Cambiar metodo de pago

Entrada:

- Boton "Cambiar metodo de pago" en una suscripcion.

Comportamiento:

1. Se abre una ventana modal.
2. La modal lista las tarjetas guardadas.
3. El usuario puede seleccionar una tarjeta existente.
4. El usuario puede pulsar "Añadir nueva" y guardar una tarjeta nueva.
5. La tarjeta seleccionada o creada se asigna a la suscripcion.
6. Se muestra confirmacion: "La proxima renovacion de {suscripcion} se cobrara en {tarjeta}."

## Seleccionar tarjeta predeterminada

Entrada:

- Boton "Seleccionar como predeterminado" junto a una tarjeta no predeterminada.

Comportamiento:

1. La tarjeta elegida pasa a ser predeterminada.
2. La etiqueta "Predeterminada" se mueve a esa tarjeta.
3. La tarjeta anterior deja de ser predeterminada.
4. La tarjeta predeterminada se puede usar como fallback si se elimina una tarjeta vinculada a una suscripcion.

## Eliminar tarjeta

Entrada:

- Boton "Eliminar" junto a una tarjeta.

### Caso 1: tarjeta sin suscripciones vinculadas

La tarjeta se elimina directamente.

Mensaje:

> Tarjeta eliminada.

### Caso 2: tarjeta vinculada a suscripcion y existe otra predeterminada

La tarjeta se elimina y la suscripcion vinculada pasa a usar la tarjeta predeterminada.

Mensaje:

> Se ha eliminado la tarjeta, y la suscripcion vinculada se ha asociado a la tarjeta predeterminada.

Si hay varias suscripciones vinculadas, el mensaje debe usar plural:

> Se ha eliminado la tarjeta, y las suscripciones vinculadas se han asociado a la tarjeta predeterminada.

### Caso 3: tarjeta vinculada a suscripcion y no existe otra predeterminada

La tarjeta no se elimina.

Mensaje:

> Esta tarjeta esta vinculada a un pago recurrente. Para eliminarla, primero debes asignar otra tarjeta o cancelar la suscripcion.

Acciones del mensaje:

- "Ir Mis suscripciones": lleva a la pagina de suscripciones.
- "Cerrar": cierra el mensaje y mantiene al usuario en la pagina actual.

## Cancelar renovacion

Entrada:

- Boton "Cancelar renovacion" en una suscripcion.

Comportamiento esperado:

1. El sistema debe confirmar el alcance antes de aplicar el cambio.
2. El copy debe distinguir cancelar renovacion de cancelar acceso inmediato.
3. Una vez cancelada la renovacion, la tarjeta deja de estar bloqueada por ese pago recurrente si no queda ninguna otra relacion activa.

El prototipo actual solo simula la entrada a este flujo.

## Reglas de UX

- Evitar etiquetas de bloqueo sin contexto.
- Mantener visibles las acciones principales junto al elemento afectado.
- Mostrar siempre una salida accionable cuando una accion no pueda completarse.
- Informar cambios automaticos, especialmente cuando una suscripcion cambia de tarjeta por fallback.
- Usar "tarjeta asociada" en suscripciones para que el usuario entienda que el pago recurrente tiene una tarjeta concreta.

## Reglas tecnicas asumidas

- Cada tarjeta puede saber si es predeterminada.
- Cada suscripcion renovable puede tener una tarjeta asociada.
- El sistema puede detectar si una tarjeta esta asociada a una o varias suscripciones.
- El sistema puede reasignar una suscripcion a la tarjeta predeterminada antes o durante la eliminacion de la tarjeta actual.
- Tras cada operacion, la interfaz refresca tarjetas y suscripciones.

## Criterios de aceptacion

- Desde Mis suscripciones se puede cambiar la tarjeta de una suscripcion.
- Desde la modal de cambio se puede elegir tarjeta existente o añadir nueva.
- Desde Mis tarjetas guardadas se puede marcar una tarjeta como predeterminada.
- Desde Mis tarjetas guardadas se puede eliminar una tarjeta libre.
- Al eliminar una tarjeta vinculada con otra predeterminada disponible, la tarjeta se borra y la suscripcion se reasigna.
- Al eliminar una tarjeta vinculada sin predeterminada disponible, aparece el mensaje contextual con acceso a Mis suscripciones.
- No aparece el texto "No borrable" en la experiencia propuesta.

