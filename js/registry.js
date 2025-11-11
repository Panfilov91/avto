/**
 * Registry Module
 * Manages the vehicle registry display and interactions
 */

const Registry = {
  currentFilter: {
    search: '',
    status: '',
    workload: ''
  },

  /**
   * Initialize registry
   */
  init() {
    const searchInput = document.getElementById('registry-search');
    const statusFilter = document.getElementById('status-filter');
    const workloadFilter = document.getElementById('workload-filter');

    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.currentFilter.search = e.target.value;
        this.render();
      });
    }

    if (statusFilter) {
      statusFilter.addEventListener('change', (e) => {
        this.currentFilter.status = e.target.value;
        this.render();
      });
    }

    if (workloadFilter) {
      workloadFilter.addEventListener('change', (e) => {
        this.currentFilter.workload = e.target.value;
        this.render();
      });
    }

    this.render();
  },

  /**
   * Get filtered vehicles
   * @returns {Array}
   */
  getFilteredVehicles() {
    let vehicles;

    // First apply search filter
    if (this.currentFilter.search) {
      vehicles = Storage.searchVehicles(this.currentFilter.search);
    } else {
      vehicles = Storage.getVehicles();
    }

    // Then apply status filter
    if (this.currentFilter.status) {
      vehicles = vehicles.filter(v => v.status === this.currentFilter.status);
    }

    // Then apply workload filter
    if (this.currentFilter.workload) {
      vehicles = vehicles.filter(v => v.workload === this.currentFilter.workload);
    }

    return vehicles;
  },

  /**
   * Render registry table
   */
  render() {
    const tbody = document.getElementById('registry-body');
    const emptyState = document.getElementById('registry-empty');
    const vehicles = this.getFilteredVehicles();

    if (!tbody) return;

    tbody.innerHTML = '';

    if (vehicles.length === 0) {
      emptyState.style.display = 'block';
      return;
    }

    emptyState.style.display = 'none';

    vehicles.forEach(vehicle => {
      const row = document.createElement('tr');
      row.tabIndex = 0;

      row.innerHTML = `
        <td>${this.escapeHtml(vehicle.plate)}</td>
        <td>${this.escapeHtml(vehicle.phone)}</td>
        <td>
          <span class="vehicle-status-badge ${vehicle.status}">
            ${vehicle.status.charAt(0).toUpperCase() + vehicle.status.slice(1)}
          </span>
        </td>
        <td>
          <span class="workload-badge ${vehicle.workload}">
            ${vehicle.workload.charAt(0).toUpperCase() + vehicle.workload.slice(1)}
          </span>
        </td>
        <td>
          <div class="action-buttons">
            <button class="btn-sm" data-action="edit" data-id="${vehicle.id}" aria-label="Edit vehicle ${this.escapeHtml(vehicle.plate)}">Edit</button>
            <button class="btn-sm" data-action="delete" data-id="${vehicle.id}" aria-label="Delete vehicle ${this.escapeHtml(vehicle.plate)}">Delete</button>
          </div>
        </td>
      `;

      // Add keyboard navigation
      row.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          const actionBtn = row.querySelector('[data-action="edit"]');
          if (actionBtn) {
            actionBtn.click();
          }
        }
      });

      tbody.appendChild(row);
    });

    // Add event listeners to action buttons
    this.attachActionListeners();
  },

  /**
   * Attach event listeners to action buttons
   */
  attachActionListeners() {
    const tbody = document.getElementById('registry-body');

    tbody.querySelectorAll('[data-action="edit"]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = parseInt(e.target.dataset.id, 10);
        this.editVehicle(id);
      });
    });

    tbody.querySelectorAll('[data-action="delete"]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = parseInt(e.target.dataset.id, 10);
        this.deleteVehicle(id);
      });
    });
  },

  /**
   * Edit vehicle (load into form)
   * @param {number} id
   */
  editVehicle(id) {
    const vehicle = Storage.getVehicleById(id);
    if (!vehicle) return;

    const form = document.getElementById('vehicle-form');
    const formSection = document.getElementById('forms');
    const navBtns = document.querySelectorAll('.nav-btn');

    // Populate form
    form.querySelector('#plate').value = vehicle.plate;
    form.querySelector('#phone').value = vehicle.phone;
    form.querySelector('#status').value = vehicle.status;
    form.querySelector('#workload').value = vehicle.workload;
    form.querySelector('#notes').value = vehicle.notes || '';

    // Store the ID for update
    form.dataset.editingId = id;

    // Switch to forms section
    this.switchSection('forms', navBtns);

    // Scroll to form
    formSection.scrollIntoView({ behavior: 'smooth' });

    Notification.show('Vehicle loaded for editing', 'info');
  },

  /**
   * Delete vehicle
   * @param {number} id
   */
  deleteVehicle(id) {
    const vehicle = Storage.getVehicleById(id);
    if (!vehicle) return;

    Confirmation.show(
      `Delete vehicle ${vehicle.plate}?`,
      `This action cannot be undone.`,
      () => {
        Storage.deleteVehicle(id);
        this.render();
        Notification.show(`Vehicle ${vehicle.plate} deleted`, 'success');
      }
    );
  },

  /**
   * Switch section (navigation)
   * @param {string} sectionId
   * @param {NodeList} navBtns
   */
  switchSection(sectionId, navBtns) {
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    document.getElementById(sectionId).classList.add('active');

    navBtns.forEach(btn => {
      if (btn.dataset.section === sectionId) {
        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');
      } else {
        btn.classList.remove('active');
        btn.setAttribute('aria-selected', 'false');
      }
    });
  },

  /**
   * Escape HTML to prevent XSS
   * @param {string} text
   * @returns {string}
   */
  escapeHtml(text) {
    const map = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
  },

  /**
   * Reset filters
   */
  resetFilters() {
    this.currentFilter = {
      search: '',
      status: '',
      workload: ''
    };

    document.getElementById('registry-search').value = '';
    document.getElementById('status-filter').value = '';
    document.getElementById('workload-filter').value = '';

    this.render();
  }
};
