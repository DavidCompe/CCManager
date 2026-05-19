# Analisis inicial

## Problema

En el espacio personal de twonav.com, una tarjeta puede quedar visible para el usuario pero no borrable. La interfaz actual distingue el estado con etiquetas como "Es por defecto" y "No borrable", pero no guia al usuario hacia la accion necesaria para desbloquear el borrado.

El caso critico es una tarjeta asociada a pagos recurrentes. Si el usuario quiere eliminarla, primero debe resolver el vinculo con la renovacion automatica: cambiar la tarjeta del pago recurrente o cancelar la autorrenovacion.

Tambien existe un bloqueo cuando la tarjeta es el metodo por defecto del cliente aunque no este vinculada a ninguna suscripcion concreta.

## Estados observados en capturas

| Estado | UI actual | Problema UX |
| --- | --- | --- |
| Tarjeta sin vinculo recurrente ni default | Muestra acciones "Eliminar" y "Seleccionar como predeterminado" | Correcto como caso base. |
| Tarjeta por defecto | Etiquetas "Es por defecto" y "No borrable" | El usuario no tiene una accion clara para cambiar o quitar la condicion de default. |
| Tarjeta vinculada a pago recurrente | Etiqueta "No borrable" y texto con la suscripcion vinculada | Informa del bloqueo, pero no ofrece cambio de tarjeta ni cancelacion de autorrenovacion desde el flujo. |
| Tooltip "No borrable" generico | "Esta tarjeta esta vinculada a una suscripcion o es tu metodo de pago por defecto. Añade otra tarjeta para poder eliminarla." | Mezcla dos causas distintas y propone solo una solucion parcial. |
| Tooltip "Es por defecto" | Explica que se usa para pagos recurrentes sin otro metodo asignado | Es informativo, pero no accionable. |

## Objetivos de producto

- Dar siempre una salida al usuario que quiere borrar una tarjeta.
- Evitar borrar o desvincular una tarjeta que todavia se necesita para una renovacion activa sin que el usuario tome una decision explicita.
- Permitir cambiar la tarjeta de una suscripcion o pago recurrente, especialmente si la actual ha caducado, se ha perdido o el usuario ya no quiere usarla.
- Separar visualmente las causas del bloqueo: "por defecto", "vinculada a suscripcion" o ambas.

## Restricciones y supuestos tecnicos

- Stripe permite desvincular un `PaymentMethod` de un `Customer` mediante detach, pero una vez desvinculado no se puede reutilizar ni volver a asociar ese mismo objeto.
- Stripe permite definir el metodo de pago por defecto a nivel de cliente (`customer.invoice_settings.default_payment_method`) o a nivel de suscripcion (`subscription.default_payment_method`).
- El metodo de pago definido en una suscripcion tiene prioridad sobre el metodo por defecto del cliente para futuras facturas de esa suscripcion.
- Cambiar metodos de pago de suscripciones es una actualizacion de configuracion y, segun Stripe, no genera prorrateos ni cambia el importe del ciclo actual.
- Falta validar en el backend actual de TwoNav si las "suscripciones" de la UI son objetos Stripe Billing nativos, contratos propios sincronizados con Stripe, o una mezcla.

## Riesgos

- Si se cancela autorrenovacion como paso previo al borrado, el usuario podria interpretar que cancela el servicio completo. El copy debe diferenciar "cancelar renovacion automatica" de "perder acceso ahora".
- Si una tarjeta por defecto se elimina sin definir otra, futuras facturas o pagos recurrentes que dependan del default podrian fallar.
- Si una suscripcion tiene facturas abiertas, pagos fallidos o requiere SCA/3DS, el cambio de tarjeta puede necesitar un flujo adicional de autenticacion.
- El estado local de la web y el estado real de Stripe pueden divergir; conviene refrescar datos tras cada operacion critica.

## Preguntas abiertas

- Que endpoint y modelo usa actualmente twonav.com para listar tarjetas guardadas?
- Las suscripciones mostradas en "Mis suscripciones" tienen `subscription.default_payment_method` propio o dependen del default del cliente?
- Se permite que un usuario tenga suscripciones activas sin autorrenovacion?
- Si solo queda una tarjeta y es default, debe poder borrarse cuando no haya pagos recurrentes activos?
- Se quiere integrar el portal de cliente de Stripe o mantener la experiencia dentro de TwoNav?
- Que idiomas debe cubrir el primer prototipo: ES solo, o ES/EN/FR desde el inicio?

