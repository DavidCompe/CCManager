# Flujos propuestos

## 1. Borrar tarjeta libre

Condicion: la tarjeta no es predeterminada y no esta vinculada a pagos recurrentes.

1. El usuario selecciona "Eliminar".
2. La interfaz muestra confirmacion con los ultimos 4 digitos y la fecha de caducidad.
3. Backend valida de nuevo que no es default ni esta vinculada.
4. Backend ejecuta detach/eliminacion.
5. La lista se refresca y muestra confirmacion.

Mensaje sugerido: "Tarjeta eliminada."

## 2. Borrar tarjeta predeterminada sin pagos recurrentes vinculados

Condicion: la tarjeta es default del cliente, pero no hay suscripciones que dependan explicitamente de ella.

Opcion recomendada si hay otra tarjeta guardada:

1. El usuario selecciona "Eliminar".
2. La interfaz explica que antes debe elegir otra tarjeta por defecto.
3. El usuario selecciona una tarjeta alternativa.
4. Backend actualiza el metodo por defecto del cliente.
5. Backend elimina la tarjeta original.

Opcion si no hay otra tarjeta guardada:

1. El usuario selecciona "Eliminar".
2. La interfaz informa de que no quedara ningun metodo de pago guardado.
3. Backend valida que no hay pagos recurrentes activos que dependan del default.
4. Backend limpia el default si el sistema lo permite y elimina la tarjeta.

Mensaje sugerido: "Para eliminar esta tarjeta, primero cambia el metodo por defecto."

## 3. Borrar tarjeta vinculada a pago recurrente

Condicion: la tarjeta esta asignada a una o mas suscripciones o renovaciones automaticas.

La pantalla no debe quedarse solo en "No borrable"; debe ofrecer dos caminos:

- Cambiar tarjeta del pago recurrente.
- Cancelar autorrenovacion y mantener acceso hasta fin de periodo, si el producto lo permite.

Flujo con cambio de tarjeta:

1. El usuario selecciona "Resolver para eliminar".
2. La interfaz muestra las suscripciones que usan esa tarjeta.
3. El usuario elige una tarjeta existente o añade una nueva.
4. Backend actualiza el `default_payment_method` de cada suscripcion afectada o el default del cliente, segun corresponda.
5. La tarjeta original deja de estar vinculada.
6. El usuario puede eliminarla en el mismo flujo.

Flujo con cancelacion de autorrenovacion:

1. El usuario selecciona "Cancelar autorrenovacion".
2. La interfaz confirma alcance: no se cobra de nuevo, se mantiene acceso hasta la fecha ya pagada.
3. Backend marca la suscripcion como no renovable.
4. La tarjeta deja de bloquear el borrado si no queda ningun otro vinculo.
5. El usuario confirma la eliminacion de la tarjeta.

Mensaje sugerido: "Esta tarjeta se usa para renovar: {nombre de suscripcion}. Cambia la tarjeta o cancela la autorrenovacion para poder eliminarla."

## 4. Cambiar tarjeta de una suscripcion

Punto de entrada ideal:

- Desde "Mis tarjetas guardadas", en tarjetas bloqueadas por recurrentes.
- Desde "Mis suscripciones", en cada suscripcion con pago recurrente.

Flujo:

1. El usuario abre "Cambiar tarjeta".
2. Selecciona una tarjeta guardada o añade una nueva.
3. Si añade una nueva, se completa SetupIntent/Checkout en modo setup o el flujo equivalente actual.
4. Backend asigna la tarjeta a la suscripcion concreta.
5. La interfaz muestra la nueva tarjeta asociada a esa suscripcion.

Mensaje sugerido: "La proxima renovacion de {nombre} se cobrara en Visa **** 1234."

## 5. Estados visuales recomendados

Evitar una etiqueta unica "No borrable" como estado final. Separar causa y accion:

| Estado | Etiqueta | Accion primaria |
| --- | --- | --- |
| Libre | Sin etiqueta de bloqueo | Eliminar |
| Predeterminada | "Predeterminada" | Cambiar predeterminada |
| Usada por renovacion | "Usada en renovacion" | Cambiar tarjeta |
| Predeterminada y usada por renovacion | "Predeterminada" + "Usada en renovacion" | Resolver renovaciones |

La accion "Eliminar" puede quedar visible pero deshabilitada con tooltip solo si existe junto a una accion habilitada que desbloquee el caso.

