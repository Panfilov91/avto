const STORAGE_KEY = "ordersRegistry.v1";
const STATUS_ORDER = ["Scheduled", "In Progress", "Completed", "Cancelled"];

const DEFAULT_ORDERS = [
  {
    id: "ORD-1001",
    client: "Acme Logistics",
    vehicle: "Freightliner Cascadia",
    status: "Scheduled",
    scheduledDate: "2023-11-01",
    completedDate: "",
    total: 12450.0,
    lift: "Lift A",
    hasCalendarBooking: true,
    notes: "Preventive maintenance visit."
  },
  {
    id: "ORD-1002",
    client: "Blue Harbor Fleet",
    vehicle: "Kenworth T680",
    status: "In Progress",
    scheduledDate: "2023-11-04",
    completedDate: "",
    total: 8420.5,
    lift: "Lift C",
    hasCalendarBooking: false,
    notes: "Hydraulic inspection."
  },
  {
    id: "ORD-1003",
    client: "Canyon Movers",
    vehicle: "Volvo VNL 760",
    status: "Completed",
    scheduledDate: "2023-10-22",
    completedDate: "2023-10-24",
    total: 15675.25,
    lift: "Lift B",
    hasCalendarBooking: false,
    notes: "Full brake replacement."
  },
  {
    id: "ORD-1004",
    client: "Acme Logistics",
    vehicle: "International LT",
    status: "Completed",
    scheduledDate: "2023-09-18",
    completedDate: "2023-09-20",
    total: 9650,
    lift: "Lift D",
    hasCalendarBooking: false,
    notes: "Transmission rebuild."
  },
  {
    id: "ORD-1005",
    client: "Summit Construction",
    vehicle: "Mack Anthem",
    status: "Scheduled",
    scheduledDate: "2023-11-15",
    completedDate: "",
    total: 11200,
    lift: "Lift A",
    hasCalendarBooking: true,
    notes: "Lift component installation."
  },
  {
    id: "ORD-1006",
    client: "Green City Transit",
    vehicle: "Gillig Low Floor",
    status: "Cancelled",
    scheduledDate: "2023-10-12",
    completedDate: "",
    total: 0,
    lift: "Lift E",
    hasCalendarBooking: false,
    notes: "Cancelled while awaiting parts."
  },
  {
    id: "ORD-1007",
    client: "Canyon Movers",
    vehicle: "Volvo VNL 860",
    status: "In Progress",
    scheduledDate: "2023-11-07",
    completedDate: "",
    total: 13480,
    lift: "Lift B",
    hasCalendarBooking: true,
    notes: "Chassis reinforcement."
  },
  {
    id: "ORD-1008",
    client: "Blue Harbor Fleet",
    vehicle: "Peterbilt 579",
    status: "Completed",
    scheduledDate: "2023-10-02",
    completedDate: "2023-10-04",
    total: 15400,
    lift: "Lift C",
    hasCalendarBooking: false,
    notes: "Full diagnostics and alignment."
  }
];

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD"
});

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "short",
  day: "numeric"
});

const state = {
  orders: [],
  filters: {
    statuses: new Set(),
    startDate: "",
    endDate: "",
    client: "all",
    lift: "all",
    search: ""
  },
  sort: {
    key: "orderNumber",
    direction: "asc"
  },
  activeOrderId: null
};

const elements = {
  summaryCards: document.getElementById("summaryCards"),
  searchInput: document.getElementById("searchInput"),
  clearFiltersBtn: document.getElementById("clearFiltersBtn"),
  statusChips: document.getElementById("statusChips"),
  startDate: document.getElementById("startDate"),
  endDate: document.getElementById("endDate"),
  clientFilter: document.getElementById("clientFilter"),
  liftFilter: document.getElementById("liftFilter"),
  ordersTableBody: document.getElementById("ordersTableBody"),
  emptyState: document.getElementById("emptyState"),
  modal: document.getElementById("orderModal"),
  orderForm: document.getElementById("orderForm"),
  orderNumberInput: document.getElementById("orderNumberInput"),
  clientInput: document.getElementById("clientInput"),
  vehicleInput: document.getElementById("vehicleInput"),
  statusInput: document.getElementById("statusInput"),
  scheduledDateInput: document.getElementById("scheduledDateInput"),
  completedDateInput: document.getElementById("completedDateInput"),
  totalInput: document.getElementById("totalInput"),
  liftInput: document.getElementById("liftInput"),
  calendarBookingInput: document.getElementById("calendarBookingInput"),
  notesInput: document.getElementById("notesInput"),
  statusChipTemplate: document.getElementById("statusChipTemplate")
};

init();

function init() {
  state.orders = loadOrders();
  bindEvents();
  render();
}

function loadOrders() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    } catch (error) {
      localStorage.removeItem(STORAGE_KEY);
    }
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_ORDERS));
  return JSON.parse(JSON.stringify(DEFAULT_ORDERS));
}

function saveOrders() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.orders));
}

function bindEvents() {
  elements.searchInput.addEventListener("input", (event) => {
    state.filters.search = event.target.value;
    render();
  });

  elements.clearFiltersBtn.addEventListener("click", () => {
    resetFilters();
    render();
  });

  elements.startDate.addEventListener("change", (event) => {
    state.filters.startDate = event.target.value;
    render();
  });

  elements.endDate.addEventListener("change", (event) => {
    state.filters.endDate = event.target.value;
    render();
  });

  elements.clientFilter.addEventListener("change", (event) => {
    state.filters.client = event.target.value;
    render();
  });

  elements.liftFilter.addEventListener("change", (event) => {
    state.filters.lift = event.target.value;
    render();
  });

  elements.statusChips.addEventListener("click", (event) => {
    const chip = event.target.closest("button[data-status]");
    if (!chip) return;
    const status = chip.dataset.status;
    if (status === "all") {
      state.filters.statuses.clear();
    } else if (state.filters.statuses.has(status)) {
      state.filters.statuses.delete(status);
    } else {
      state.filters.statuses.add(status);
    }
    render();
  });

  document.querySelectorAll(".table__sort").forEach((button) => {
    button.addEventListener("click", () => {
      const { sortKey } = button.dataset;
      if (!sortKey) return;
      if (state.sort.key === sortKey) {
        state.sort.direction = state.sort.direction === "asc" ? "desc" : "asc";
      } else {
        state.sort.key = sortKey;
        state.sort.direction = "asc";
      }
      render();
    });
  });

  elements.ordersTableBody.addEventListener("click", (event) => {
    const actionButton = event.target.closest("button[data-action]");
    if (!actionButton) return;
    const { action, id } = actionButton.dataset;
    if (!action || !id) return;

    if (action === "view") {
      openModal(id);
    } else if (action === "duplicate") {
      duplicateOrder(id);
    } else if (action === "delete") {
      deleteOrder(id);
    }
  });

  elements.modal.addEventListener("click", (event) => {
    if (event.target.dataset.dismiss === "modal") {
      closeModal();
    }
  });

  elements.orderForm.addEventListener("submit", (event) => {
    event.preventDefault();
    saveModalChanges();
  });

  document.querySelectorAll("[data-dismiss='modal']").forEach((dismissButton) => {
    dismissButton.addEventListener("click", () => closeModal());
  });

  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !elements.modal.hasAttribute("hidden")) {
      closeModal();
    }
  });
}

function resetFilters() {
  state.filters.statuses.clear();
  state.filters.startDate = "";
  state.filters.endDate = "";
  state.filters.client = "all";
  state.filters.lift = "all";
  state.filters.search = "";
  elements.searchInput.value = "";
  elements.startDate.value = "";
  elements.endDate.value = "";
  elements.clientFilter.value = "all";
  elements.liftFilter.value = "all";
}

function render() {
  updateDropdownOptions();
  updateStatusChips();
  const filteredOrders = getFilteredOrders();
  renderOrdersTable(filteredOrders);
  renderSummary(filteredOrders);
  updateEmptyState(filteredOrders.length === 0);
  updateSortStates();
}

function getFilteredOrders() {
  const { statuses, startDate, endDate, client, lift, search } = state.filters;
  const searchValue = search.trim().toLowerCase();

  const filtered = state.orders.filter((order) => {
    if (searchValue) {
      const haystack = `${order.id} ${order.client}`.toLowerCase();
      if (!haystack.includes(searchValue)) {
        return false;
      }
    }

    if (client !== "all" && order.client !== client) {
      return false;
    }

    if (lift !== "all" && order.lift !== lift) {
      return false;
    }

    if (startDate) {
      if (!order.scheduledDate || new Date(order.scheduledDate) < new Date(startDate)) {
        return false;
      }
    }

    if (endDate) {
      if (!order.scheduledDate || new Date(order.scheduledDate) > new Date(endDate)) {
        return false;
      }
    }

    if (statuses.size > 0 && !statuses.has(order.status)) {
      return false;
    }

    return true;
  });

  return sortOrders(filtered);
}

function getOrdersWithoutStatusFilter() {
  const { startDate, endDate, client, lift, search } = state.filters;
  const searchValue = search.trim().toLowerCase();

  return state.orders.filter((order) => {
    if (searchValue) {
      const haystack = `${order.id} ${order.client}`.toLowerCase();
      if (!haystack.includes(searchValue)) {
        return false;
      }
    }

    if (client !== "all" && order.client !== client) {
      return false;
    }

    if (lift !== "all" && order.lift !== lift) {
      return false;
    }

    if (startDate) {
      if (!order.scheduledDate || new Date(order.scheduledDate) < new Date(startDate)) {
        return false;
      }
    }

    if (endDate) {
      if (!order.scheduledDate || new Date(order.scheduledDate) > new Date(endDate)) {
        return false;
      }
    }

    return true;
  });
}

function sortOrders(orders) {
  const { key, direction } = state.sort;
  const sorted = [...orders];

  const multiplier = direction === "asc" ? 1 : -1;

  sorted.sort((a, b) => {
    let aValue;
    let bValue;

    switch (key) {
      case "orderNumber":
        aValue = extractOrderNumber(a.id);
        bValue = extractOrderNumber(b.id);
        break;
      case "scheduledDate":
        aValue = a.scheduledDate ? new Date(a.scheduledDate).getTime() : Number.MAX_SAFE_INTEGER;
        bValue = b.scheduledDate ? new Date(b.scheduledDate).getTime() : Number.MAX_SAFE_INTEGER;
        break;
      case "total":
        aValue = Number(a.total) || 0;
        bValue = Number(b.total) || 0;
        break;
      default:
        aValue = a[key];
        bValue = b[key];
    }

    if (aValue < bValue) return -1 * multiplier;
    if (aValue > bValue) return 1 * multiplier;
    return 0;
  });

  return sorted;
}

function extractOrderNumber(orderId) {
  const match = /([0-9]+)/.exec(orderId);
  return match ? parseInt(match[1], 10) : Number.MAX_SAFE_INTEGER;
}

function updateDropdownOptions() {
  const clients = Array.from(new Set(state.orders.map((order) => order.client))).sort((a, b) =>
    a.localeCompare(b)
  );
  const lifts = Array.from(new Set(state.orders.map((order) => order.lift))).sort((a, b) =>
    a.localeCompare(b)
  );

  populateSelect(elements.clientFilter, clients, state.filters.client, "All clients");
  populateSelect(elements.liftFilter, lifts, state.filters.lift, "All lifts");
}

function populateSelect(selectEl, values, activeValue, placeholder) {
  const previous = activeValue;
  const options = [
    `<option value="all">${placeholder}</option>`
  ].concat(values.map((value) => `<option value="${value}">${value}</option>`));
  selectEl.innerHTML = options.join("");

  if (previous !== "all" && !values.includes(previous)) {
    if (selectEl === elements.clientFilter) {
      state.filters.client = "all";
    } else if (selectEl === elements.liftFilter) {
      state.filters.lift = "all";
    }
    selectEl.value = "all";
    return;
  }

  selectEl.value = previous;
}

function updateStatusChips() {
  const container = elements.statusChips;
  container.innerHTML = "";
  const template = elements.statusChipTemplate;
  const fragment = document.createDocumentFragment();

  const ordersWithoutStatus = getOrdersWithoutStatusFilter();
  const totalCount = ordersWithoutStatus.length;

  const allChip = template.content.firstElementChild.cloneNode(true);
  allChip.dataset.status = "all";
  allChip.querySelector(".status-chip__label").textContent = "All";
  allChip.querySelector(".status-chip__count").textContent = totalCount;
  allChip.setAttribute("aria-pressed", state.filters.statuses.size === 0 ? "true" : "false");
  if (state.filters.statuses.size === 0) {
    allChip.classList.add("status-chip--active");
  }
  fragment.appendChild(allChip);

  const statusCounts = calculateStatusCounts(ordersWithoutStatus);

  statusCounts.forEach(({ status, count }) => {
    const chip = template.content.firstElementChild.cloneNode(true);
    chip.dataset.status = status;
    chip.querySelector(".status-chip__label").textContent = status;
    chip.querySelector(".status-chip__count").textContent = count;
    const isActive = state.filters.statuses.has(status);
    chip.setAttribute("aria-pressed", isActive ? "true" : "false");
    if (isActive) {
      chip.classList.add("status-chip--active");
    }
    fragment.appendChild(chip);
  });

  container.appendChild(fragment);
}

function calculateStatusCounts(orders) {
  const counts = new Map();
  orders.forEach((order) => {
    counts.set(order.status, (counts.get(order.status) || 0) + 1);
  });

  const allStatuses = sortStatuses(Array.from(new Set([...counts.keys(), ...STATUS_ORDER])));

  return allStatuses.map((status) => ({
    status,
    count: counts.get(status) || 0
  }));
}

function sortStatuses(statuses) {
  return [...statuses].sort((a, b) => {
    const indexA = STATUS_ORDER.indexOf(a);
    const indexB = STATUS_ORDER.indexOf(b);
    if (indexA === -1 && indexB === -1) return a.localeCompare(b);
    if (indexA === -1) return 1;
    if (indexB === -1) return -1;
    return indexA - indexB;
  });
}

function renderOrdersTable(orders) {
  const fragment = document.createDocumentFragment();

  orders.forEach((order) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${order.id}</td>
      <td>${order.client}</td>
      <td>${order.vehicle}</td>
      <td><span class="status-pill" data-status="${order.status}">${order.status}</span></td>
      <td>${formatDate(order.scheduledDate)}</td>
      <td>${formatDate(order.completedDate)}</td>
      <td>${formatCurrency(order.total)}</td>
      <td>${order.lift}</td>
      <td>
        <div class="row-actions">
          <button class="button button--inline" type="button" data-action="view" data-id="${order.id}">View/Edit</button>
          <button class="button button--inline" type="button" data-action="duplicate" data-id="${order.id}">Duplicate</button>
          <button class="button button--inline button--danger" type="button" data-action="delete" data-id="${order.id}">Delete</button>
        </div>
      </td>
    `;
    fragment.appendChild(row);
  });

  elements.ordersTableBody.innerHTML = "";
  elements.ordersTableBody.appendChild(fragment);
}

function renderSummary(filteredOrders) {
  const container = elements.summaryCards;
  container.innerHTML = "";

  const fragment = document.createDocumentFragment();
  const totalRevenue = filteredOrders.reduce((sum, order) => sum + (Number(order.total) || 0), 0);
  const statuses = sortStatuses(
    Array.from(new Set([...state.orders.map((order) => order.status), ...STATUS_ORDER]))
  );

  fragment.appendChild(createSummaryCard("Filtered orders", filteredOrders.length));

  statuses.forEach((status) => {
    const count = filteredOrders.filter((order) => order.status === status).length;
    fragment.appendChild(createSummaryCard(`${status}`, count));
  });

  fragment.appendChild(createSummaryCard("Total revenue", formatCurrency(totalRevenue), "summary-card--accent"));

  container.appendChild(fragment);
}

function createSummaryCard(label, value, extraClass = "") {
  const card = document.createElement("div");
  card.className = `summary-card ${extraClass}`.trim();

  const labelEl = document.createElement("span");
  labelEl.className = "summary-card__label";
  labelEl.textContent = label;

  const valueEl = document.createElement("span");
  valueEl.className = "summary-card__value";
  valueEl.textContent = value;

  card.append(labelEl, valueEl);
  return card;
}

function formatCurrency(value) {
  const numericValue = Number(value) || 0;
  return currencyFormatter.format(numericValue);
}

function formatDate(value) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return dateFormatter.format(date);
}

function updateEmptyState(isEmpty) {
  elements.emptyState.hidden = !isEmpty;
  const table = elements.ordersTableBody.closest("table");
  if (table) {
    table.style.display = isEmpty ? "none" : "";
  }
}

function updateSortStates() {
  document.querySelectorAll(".table__sort").forEach((button) => {
    const { sortKey } = button.dataset;
    const isActive = sortKey === state.sort.key;
    button.dataset.active = isActive ? "true" : "false";
    button.dataset.direction = isActive ? state.sort.direction : "";
  });
}

function openModal(orderId) {
  const order = state.orders.find((item) => item.id === orderId);
  if (!order) return;

  state.activeOrderId = orderId;
  populateStatusSelect();

  elements.orderNumberInput.value = order.id;
  elements.clientInput.value = order.client;
  elements.vehicleInput.value = order.vehicle;
  elements.statusInput.value = order.status;
  elements.scheduledDateInput.value = order.scheduledDate || "";
  elements.completedDateInput.value = order.completedDate || "";
  elements.totalInput.value = order.total;
  elements.liftInput.value = order.lift;
  elements.calendarBookingInput.checked = Boolean(order.hasCalendarBooking);
  elements.notesInput.value = order.notes || "";

  elements.modal.removeAttribute("hidden");
  document.body.style.overflow = "hidden";
}

function closeModal() {
  elements.modal.setAttribute("hidden", "hidden");
  document.body.style.overflow = "";
  state.activeOrderId = null;
  elements.orderForm.reset();
}

function populateStatusSelect() {
  const statuses = sortStatuses(
    Array.from(new Set([...STATUS_ORDER, ...state.orders.map((order) => order.status)]))
  );
  elements.statusInput.innerHTML = statuses
    .map((status) => `<option value="${status}">${status}</option>`)
    .join("");
}

function saveModalChanges() {
  const orderId = state.activeOrderId;
  if (!orderId) return;

  const orderIndex = state.orders.findIndex((item) => item.id === orderId);
  if (orderIndex === -1) return;

  const nextOrder = {
    ...state.orders[orderIndex],
    client: elements.clientInput.value.trim(),
    vehicle: elements.vehicleInput.value.trim(),
    status: elements.statusInput.value,
    scheduledDate: elements.scheduledDateInput.value,
    completedDate: elements.completedDateInput.value,
    total: Number(elements.totalInput.value) || 0,
    lift: elements.liftInput.value.trim(),
    hasCalendarBooking: elements.calendarBookingInput.checked,
    notes: elements.notesInput.value.trim()
  };

  state.orders.splice(orderIndex, 1, nextOrder);
  saveOrders();
  closeModal();
  render();
}

function duplicateOrder(orderId) {
  const sourceOrder = state.orders.find((item) => item.id === orderId);
  if (!sourceOrder) return;

  const clone = JSON.parse(JSON.stringify(sourceOrder));
  clone.id = generateNextOrderId();
  clone.status = "Scheduled";
  clone.hasCalendarBooking = false;
  clone.completedDate = "";
  clone.notes = sourceOrder.notes ? `${sourceOrder.notes} (duplicated)` : "";

  state.orders.unshift(clone);
  saveOrders();
  render();
}

function deleteOrder(orderId) {
  const orderIndex = state.orders.findIndex((item) => item.id === orderId);
  if (orderIndex === -1) return;

  const order = state.orders[orderIndex];
  if (order.hasCalendarBooking) {
    alert(`Order ${order.id} is linked to an active calendar booking. Remove the booking before deleting this order.`);
    return;
  }

  const confirmation = confirm(`Delete order ${order.id}? This action cannot be undone.`);
  if (!confirmation) return;

  state.orders.splice(orderIndex, 1);
  saveOrders();
  render();
}

function generateNextOrderId() {
  const maxNumber = state.orders.reduce((max, order) => {
    const numeric = extractOrderNumber(order.id);
    return Math.max(max, numeric);
  }, 1000);
  const nextNumber = maxNumber + 1;
  return `ORD-${String(nextNumber).padStart(4, "0")}`;
}
