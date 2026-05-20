const state = {
  view: "payments",
  activeSubscriptionId: null,
  nextCardNumber: 1,
  nextSubscriptionNumber: 1,
  cards: [
    {
      id: "card_visa_9258",
      brand: "Visa",
      last4: "9258",
      exp: "08/2025",
      isDefault: true
    },
    {
      id: "card_visa_4242",
      brand: "Visa",
      last4: "4242",
      exp: "06/2026",
      isDefault: false
    }
  ],
  subscriptions: [
    {
      id: "sub_france_ign",
      name: "Suscripción Francia IGN Géoportail",
      status: "Activado",
      type: "Mensual",
      renewalLabel: "Fecha de renovación",
      renewalDate: "20-06-2026",
      devices: "3 de 5",
      price: "4,99 € / Mensual",
      paymentMethodId: "card_visa_4242",
      canRenew: true,
      art: "map"
    },
    {
      id: "sub_trial_pro",
      name: "SUSCRIPCIÓN TRIAL PRO",
      status: "Activo",
      type: "Prueba gratuita",
      renewalLabel: "Fecha de caducidad",
      renewalDate: "30-01-2027",
      devices: "2 de 5",
      price: "",
      paymentMethodId: null,
      canRenew: false,
      art: "badge"
    }
  ]
};

const els = {
  viewButtons: document.querySelectorAll("[data-view-button]"),
  views: {
    subscriptions: document.querySelector("#subscriptions-view"),
    payments: document.querySelector("#payments-view")
  },
  subscriptionList: document.querySelector("#subscription-list"),
  paymentList: document.querySelector("#payment-list"),
  addCardForm: document.querySelector("#add-card-form"),
  paymentModal: document.querySelector("#payment-modal"),
  paymentModalSubtitle: document.querySelector("#payment-modal-subtitle"),
  modalCardList: document.querySelector("#modal-card-list"),
  modalNewCard: document.querySelector("#modal-new-card"),
  showNewCard: document.querySelector("#show-new-card"),
  messageModal: document.querySelector("#message-modal"),
  messageTitle: document.querySelector("#message-modal-title"),
  messageBody: document.querySelector("#message-modal-body"),
  messageActions: document.querySelector("#message-modal-actions"),
  toastRegion: document.querySelector("#toast-region")
};

function cardLabel(card) {
  if (!card) {
    return "Sin tarjeta asociada";
  }

  return `${card.brand} **** ${card.last4} cad. ${card.exp}`;
}

function getCard(cardId) {
  return state.cards.find((card) => card.id === cardId);
}

function getDefaultCard(excludedCardId = null) {
  return state.cards.find((card) => card.isDefault && card.id !== excludedCardId);
}

function getLinkedSubscriptions(cardId) {
  return state.subscriptions.filter((subscription) => subscription.paymentMethodId === cardId && subscription.canRenew);
}

function renderAll() {
  renderNavigation();
  renderSubscriptions();
  renderPayments();
}

function renderNavigation() {
  els.viewButtons.forEach((button) => {
    button.classList.toggle("is-active", button.dataset.viewButton === state.view);
  });

  Object.entries(els.views).forEach(([viewName, viewElement]) => {
    viewElement.classList.toggle("is-visible", viewName === state.view);
  });
}

function renderSubscriptions() {
  if (!state.subscriptions.length) {
    els.subscriptionList.innerHTML = `<p class="empty-state">No tienes suscripciones activas.</p>`;
    return;
  }

  els.subscriptionList.innerHTML = state.subscriptions.map((subscription) => {
    const associatedCard = getCard(subscription.paymentMethodId);
    const actions = subscription.canRenew
      ? `
        <button class="action-link" type="button">Más información</button>
        <span aria-hidden="true">|</span>
        <button class="action-link" type="button" data-cancel-subscription="${subscription.id}">Cancelar suscripción</button>
        <button class="change-payment-button added-highlight" type="button" data-change-payment="${subscription.id}">Cambiar tarjeta</button>
        <div class="price">${subscription.price}</div>
      `
      : `<button class="action-link" type="button">Más información</button>`;

    return `
      <article class="subscription-item">
        <h2>${subscription.name}</h2>
        <div class="item-divider"></div>
        <div class="subscription-body">
          ${renderSubscriptionArt(subscription.art)}
          <div class="subscription-details">
            <div class="detail-row"><strong>Estado:</strong> ${subscription.status}</div>
            <div class="detail-row"><strong>Suscripción:</strong> ${subscription.type}</div>
            <div class="detail-row"><strong>${subscription.renewalLabel}:</strong> ${subscription.renewalDate}</div>
            <div class="detail-row associated-card added-highlight"><strong>Tarjeta vinculada:</strong> <span>${cardLabel(associatedCard)}</span></div>
            <div class="detail-row"><strong>Activaciones en dispositivos:</strong> ${subscription.devices} | <button class="inline-link" type="button">Lista de dispositivos</button></div>
          </div>
          <div class="subscription-actions">
            ${actions}
          </div>
        </div>
      </article>
    `;
  }).join("");
}

function renderSubscriptionArt(kind) {
  if (kind === "badge") {
    return `
      <div class="subscription-art badge-art" aria-hidden="true">
        <span class="badge-circle"></span>
      </div>
    `;
  }

  return `
    <div class="subscription-art map-art" aria-hidden="true">
      <span></span>
      <span></span>
      <span></span>
      <span></span>
    </div>
  `;
}

function renderPayments() {
  if (!state.cards.length) {
    els.paymentList.innerHTML = `<p>No tienes tarjetas guardadas.</p>`;
    return;
  }

  els.paymentList.innerHTML = state.cards.map((card) => {
    const linkedSubscriptions = getLinkedSubscriptions(card.id);
    const linkedText = linkedSubscriptions.length
      ? `
        <span class="linked-note">
          Usada en: ${linkedSubscriptions.map((subscription) => subscription.name).join(", ")}
          <button class="inline-link" type="button" data-go-subscriptions>Ver Mis suscripciones</button>
        </span>
      `
      : "";
    const defaultStatus = card.isDefault ? `<span class="status-pill">Predeterminada</span>` : "";

    return `
      <article class="payment-row">
        <div class="payment-main">
          <span class="card-icon" aria-hidden="true"></span>
          <div>
            <span class="card-name">${card.brand}</span>
            <span class="card-meta"> **** ${card.last4} cad. ${card.exp}</span>
            ${defaultStatus}
            ${linkedText}
          </div>
        </div>
        <div class="payment-actions">
          <button class="danger-button" type="button" data-delete-card="${card.id}">Eliminar</button>
          <button class="secondary-button" type="button" data-set-default="${card.id}" ${card.isDefault ? "disabled" : ""}>Seleccionar como predeterminado</button>
        </div>
      </article>
    `;
  }).join("");
}

function switchView(viewName) {
  state.view = viewName;
  renderNavigation();
}

function openPaymentModal(subscriptionId) {
  const subscription = state.subscriptions.find((item) => item.id === subscriptionId);
  state.activeSubscriptionId = subscriptionId;
  els.paymentModalSubtitle.textContent = `Elige una tarjeta guardada o añade una nueva para ${subscription.name}.`;
  els.modalNewCard.hidden = true;
  renderModalCards(subscriptionId);
  els.paymentModal.hidden = false;
}

function closePaymentModal() {
  state.activeSubscriptionId = null;
  els.paymentModal.hidden = true;
}

function renderModalCards(subscriptionId) {
  const subscription = state.subscriptions.find((item) => item.id === subscriptionId);

  els.modalCardList.innerHTML = state.cards.map((card) => {
    const isCurrent = subscription.paymentMethodId === card.id;
    return `
      <article class="modal-card-row">
        <div class="payment-main">
          <span class="card-icon" aria-hidden="true"></span>
          <div>
            <span class="card-name">${card.brand}</span>
            <span class="card-meta"> **** ${card.last4} cad. ${card.exp}</span>
            ${card.isDefault ? `<span class="status-pill">Predeterminada</span>` : ""}
          </div>
        </div>
        <button class="primary-button" type="button" data-assign-card="${card.id}" ${isCurrent ? "disabled" : ""}>${isCurrent ? "Asignada" : "Usar esta tarjeta"}</button>
      </article>
    `;
  }).join("");
}

function assignCardToSubscription(cardId, subscriptionId = state.activeSubscriptionId) {
  const subscription = state.subscriptions.find((item) => item.id === subscriptionId);
  const card = getCard(cardId);

  subscription.paymentMethodId = cardId;
  closePaymentModal();
  renderAll();
  showToast(`La próxima renovación de ${subscription.name} se cobrará en ${cardLabel(card)}.`);
}

function createStoredCard() {
  const newCard = {
    id: `card_new_${Date.now()}`,
    brand: "Visa",
    last4: String(6800 + state.nextCardNumber).slice(-4),
    exp: "12/2028",
    isDefault: state.cards.length === 0
  };

  state.nextCardNumber += 1;
  state.cards.push(newCard);

  return newCard;
}

function addStoredCard({ assignToActiveSubscription = false } = {}) {
  const newCard = createStoredCard();

  if (assignToActiveSubscription && state.activeSubscriptionId) {
    assignCardToSubscription(newCard.id);
    return;
  }

  renderAll();
  showToast(`Tarjeta ${cardLabel(newCard)} guardada.`);
}

function getPrototypeRenewalDate() {
  const renewalDate = new Date();
  renewalDate.setMonth(renewalDate.getMonth() + 1);

  return renewalDate.toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  }).replaceAll("/", "-");
}

function addTrialSubscription() {
  const defaultCard = getDefaultCard() || state.cards[0] || createStoredCard();
  const subscriptionNumber = state.nextSubscriptionNumber;

  state.nextSubscriptionNumber += 1;
  state.subscriptions.unshift({
    id: `sub_proto_${Date.now()}_${subscriptionNumber}`,
    name: `Suscripción de prueba ${subscriptionNumber}`,
    status: "Activo",
    type: "Mensual",
    renewalLabel: "Fecha de renovación",
    renewalDate: getPrototypeRenewalDate(),
    devices: "1 de 5",
    price: "0,00 € / Prueba",
    paymentMethodId: defaultCard ? defaultCard.id : null,
    canRenew: true,
    art: subscriptionNumber % 2 === 0 ? "map" : "badge"
  });

  renderAll();
  switchView("subscriptions");
  openMessageModal({
    title: "Proto",
    body: "En este prototipo este botón añade directamente una suscripción al usuario, para que se puedan probar los flujos de tarjetas.",
    actions: [
      {
        label: "Entendido",
        variant: "primary",
        handler: closeMessageModal
      }
    ]
  });
}

function setDefaultCard(cardId) {
  state.cards.forEach((card) => {
    card.isDefault = card.id === cardId;
  });

  renderAll();
  showToast(`${cardLabel(getCard(cardId))} es ahora tu tarjeta predeterminada.`);
}

function deleteCard(cardId) {
  const card = getCard(cardId);
  const linkedSubscriptions = getLinkedSubscriptions(cardId);
  const fallbackDefault = getDefaultCard(cardId);

  if (linkedSubscriptions.length && !fallbackDefault) {
    openMessageModal({
      title: "No se puede eliminar todavía",
      body: "Esta tarjeta está vinculada a un pago recurrente. Para eliminarla, primero debes asignar otra tarjeta o cancelar la suscripción.",
      actions: [
        {
          label: "Ir Mis suscripciones",
          variant: "primary",
          handler: () => {
            closeMessageModal();
            switchView("subscriptions");
          }
        },
        {
          label: "Cerrar",
          variant: "secondary",
          handler: closeMessageModal
        }
      ]
    });
    return;
  }

  if (linkedSubscriptions.length && fallbackDefault) {
    linkedSubscriptions.forEach((subscription) => {
      subscription.paymentMethodId = fallbackDefault.id;
    });

    removeCard(cardId);
    renderAll();
    openMessageModal({
      title: "Tarjeta eliminada",
      body: linkedSubscriptions.length === 1
        ? `Se ha eliminado la tarjeta, y la suscripción vinculada se ha asociado a la tarjeta predeterminada: ${cardLabel(fallbackDefault)}.`
        : `Se ha eliminado la tarjeta, y las suscripciones vinculadas se han asociado a la tarjeta predeterminada: ${cardLabel(fallbackDefault)}.`,
      actions: [
        {
          label: "Cerrar",
          variant: "primary",
          handler: closeMessageModal
        }
      ]
    });
    return;
  }

  if (card.isDefault) {
    const fallbackCard = state.cards.find((item) => item.id !== cardId);
    removeCard(cardId);

    if (fallbackCard) {
      fallbackCard.isDefault = true;
      renderAll();
      showToast(`Tarjeta eliminada. ${cardLabel(fallbackCard)} queda como predeterminada.`);
      return;
    }

    renderAll();
    showToast("Tarjeta eliminada. Ya no tienes tarjetas guardadas.");
    return;
  }

  removeCard(cardId);
  renderAll();
  showToast("Tarjeta eliminada.");
}

function removeCard(cardId) {
  state.cards = state.cards.filter((card) => card.id !== cardId);
}

function confirmCancelSubscription(subscriptionId) {
  const subscription = state.subscriptions.find((item) => item.id === subscriptionId);

  if (!subscription) {
    return;
  }

  openMessageModal({
    title: "Cancelar suscripción",
    body: `¿Seguro que quieres cancelar ${subscription.name}? La suscripción desaparecerá de la lista y la tarjeta vinculada quedará liberada.`,
    actions: [
      {
        label: "Cancelar suscripción",
        variant: "danger",
        handler: () => cancelSubscription(subscriptionId)
      },
      {
        label: "Volver",
        variant: "secondary",
        handler: closeMessageModal
      }
    ]
  });
}

function cancelSubscription(subscriptionId) {
  const subscription = state.subscriptions.find((item) => item.id === subscriptionId);

  if (!subscription) {
    closeMessageModal();
    return;
  }

  state.subscriptions = state.subscriptions.filter((item) => item.id !== subscriptionId);
  closeMessageModal();
  renderAll();
  showToast(`${subscription.name} cancelada. La tarjeta vinculada queda liberada.`);
}

function openMessageModal({ title, body, actions }) {
  els.messageTitle.textContent = title;
  els.messageBody.textContent = body;
  els.messageActions.innerHTML = "";

  actions.forEach((action) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = action.variant === "primary"
      ? "primary-button"
      : action.variant === "danger"
        ? "danger-button"
        : "secondary-button";
    button.textContent = action.label;
    button.addEventListener("click", action.handler);
    els.messageActions.appendChild(button);
  });

  els.messageModal.hidden = false;
}

function closeMessageModal() {
  els.messageModal.hidden = true;
}

function showToast(message) {
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = message;
  els.toastRegion.appendChild(toast);

  window.setTimeout(() => {
    toast.remove();
  }, 4600);
}

document.addEventListener("click", (event) => {
  const viewButton = event.target.closest("[data-view-button]");
  const changePaymentButton = event.target.closest("[data-change-payment]");
  const cancelSubscriptionButton = event.target.closest("[data-cancel-subscription]");
  const assignCardButton = event.target.closest("[data-assign-card]");
  const deleteCardButton = event.target.closest("[data-delete-card]");
  const setDefaultButton = event.target.closest("[data-set-default]");
  const goSubscriptionsButton = event.target.closest("[data-go-subscriptions]");
  const addTrialSubscriptionButton = event.target.closest("[data-add-trial-subscription]");

  if (viewButton) {
    switchView(viewButton.dataset.viewButton);
  }

  if (changePaymentButton) {
    openPaymentModal(changePaymentButton.dataset.changePayment);
  }

  if (cancelSubscriptionButton) {
    confirmCancelSubscription(cancelSubscriptionButton.dataset.cancelSubscription);
  }

  if (assignCardButton) {
    assignCardToSubscription(assignCardButton.dataset.assignCard);
  }

  if (deleteCardButton) {
    deleteCard(deleteCardButton.dataset.deleteCard);
  }

  if (setDefaultButton) {
    setDefaultCard(setDefaultButton.dataset.setDefault);
  }

  if (goSubscriptionsButton) {
    switchView("subscriptions");
  }

  if (addTrialSubscriptionButton) {
    addTrialSubscription();
  }

  if (event.target.matches("[data-close-modal]") || event.target === els.paymentModal) {
    closePaymentModal();
  }

  if (event.target.matches("[data-close-message]") || event.target === els.messageModal) {
    closeMessageModal();
  }
});

els.showNewCard.addEventListener("click", () => {
  els.modalNewCard.hidden = false;
});

els.addCardForm.addEventListener("submit", (event) => {
  event.preventDefault();
  addStoredCard();
  event.currentTarget.reset();
});

els.modalNewCard.addEventListener("submit", (event) => {
  event.preventDefault();
  addStoredCard({ assignToActiveSubscription: true });
  event.currentTarget.reset();
});

renderAll();
