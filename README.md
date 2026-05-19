# CCManager

Revision de la gestion de tarjetas guardadas en el espacio personal de usuarios de twonav.com.

## Objetivo

Permitir que una persona usuaria pueda gestionar sus tarjetas guardadas sin quedar bloqueada por estados internos de Stripe o de suscripciones:

- Borrar una tarjeta guardada desde "Mis tarjetas guardadas".
- Entender por que una tarjeta no se puede borrar todavia.
- Cambiar la tarjeta asociada a un pago recurrente.
- Cancelar la autorrenovacion cuando sea el paso necesario antes de borrar una tarjeta vinculada.

## Contexto inicial

Las capturas de referencia estan en [Capturas](Capturas/). Muestran estos estados:

- Tarjeta sin uso recurrente ni marca de predeterminada: se puede eliminar y marcar como predeterminada.
- Tarjeta marcada como metodo por defecto: aparece como "No borrable".
- Tarjeta vinculada a un pago recurrente: aparece como "No borrable" e informa de la suscripcion relacionada.
- Tooltips actuales explican la causa, pero no ofrecen una accion directa para resolverla.

## Documentacion del proyecto

- [Analisis inicial](docs/01-analisis-inicial.md)
- [Flujos propuestos](docs/02-flujos-propuestos.md)
- [Backlog inicial](docs/03-backlog-inicial.md)

## Prototipo

- [Prototype HTML](prototype.html)
- [Flow UX](ux-flow.html)
- [Resumen de comportamiento](docs/04-resumen-comportamiento.md)

## Fuentes tecnicas de Stripe

- Detach de PaymentMethod: https://docs.stripe.com/api/payment_methods/detach
- Actualizar metodo de pago para suscripciones: https://docs.stripe.com/payments/checkout/subscriptions/update-payment-details
- Modificar suscripciones: https://docs.stripe.com/billing/subscriptions/change
