# Backlog inicial

## Descubrimiento tecnico

- Identificar endpoints actuales para listar, añadir, marcar como predeterminada y eliminar tarjetas.
- Confirmar si las tarjetas se guardan como Stripe `PaymentMethod`, `Source` legacy o ambos.
- Mapear donde se guarda la relacion tarjeta-suscripcion en TwoNav.
- Confirmar si el estado "No borrable" viene de Stripe, del backend propio o de una regla de frontend.
- Revisar el flujo actual de cancelacion de autorrenovacion.

## Requisitos funcionales

- Mostrar por cada tarjeta si es predeterminada, si esta vinculada a renovaciones y a cuales.
- Permitir eliminar tarjetas libres.
- Permitir cambiar el metodo por defecto antes de eliminar una tarjeta default.
- Permitir cambiar la tarjeta de una suscripcion/recurrente.
- Permitir cancelar autorrenovacion desde el flujo de desbloqueo de eliminacion.
- Refrescar estado tras cada cambio para evitar decisiones con datos obsoletos.

## Requisitos UX

- Reemplazar "No borrable" como mensaje principal por una explicacion accionable.
- Diferenciar "predeterminada" de "usada por renovacion".
- Mostrar el nombre de la suscripcion que bloquea la tarjeta.
- Confirmar consecuencias antes de cancelar autorrenovacion.
- Confirmar eliminacion con marca, ultimos 4 digitos y caducidad.

## Casos de prueba

- Eliminar tarjeta no predeterminada sin suscripciones.
- Intentar eliminar tarjeta predeterminada con otra tarjeta disponible.
- Intentar eliminar tarjeta predeterminada sin otra tarjeta disponible y sin suscripciones activas.
- Cambiar tarjeta de una suscripcion mensual activa.
- Cambiar tarjeta caducada por tarjeta nueva.
- Cancelar autorrenovacion y eliminar tarjeta despues.
- Tarjeta usada por varias suscripciones.
- Fallo de Stripe al cambiar metodo de pago.
- SetupIntent o Checkout abandonado antes de completarse.

## Proximos entregables sugeridos

- Mapa de estados de tarjeta y suscripcion.
- Prototipo HTML de la nueva pantalla "Mis tarjetas guardadas".
- Prototipo del modal "Resolver para eliminar tarjeta".
- Especificacion tecnica de endpoints necesarios.
- Matriz de copy ES/EN/FR para mensajes y tooltips.

