import { html, css, LitElement } from "https://unpkg.com/lit@2.8.0?module";

const STORAGE_KEY = "transcription_doctors";

class AppDoctorSelect extends LitElement {
  static properties = {
    medicalMode: { type: Boolean },
    autoSelectId: {},
    doctors: { state: true },
    selectedDoctorName: { state: true },
    showAddDoctor: { state: true },
    newDoctorName: { state: true },
    newDoctorId: { state: true },
    showAddKeyterm: { state: true },
    newKeyterm: { state: true },
    autoMatchStatus: { state: true },
  };

  static styles = css`
    :host {
      display: block;
    }

    .doctor-wrap {
      padding: 0 0 1.25rem;
    }

    .section-label {
      font-size: 0.7rem;
      font-weight: 700;
      color: #8899aa;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      margin-bottom: 0.5rem;
    }

    .row {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      flex-wrap: wrap;
    }

    .select {
      flex: 1;
      min-width: 0;
      height: 38px;
      background: #1e2a38;
      border: 1px solid #3d4f66;
      border-radius: 0.25rem;
      color: #ededf2;
      font-size: 0.875rem;
      padding: 0 0.75rem;
      cursor: pointer;
      appearance: auto;
    }

    .select:focus {
      outline: none;
      border-color: #13ef95;
    }

    .btn {
      height: 38px;
      padding: 0 1rem;
      border-radius: 0.25rem;
      font-size: 0.8rem;
      font-weight: 600;
      cursor: pointer;
      white-space: nowrap;
      transition: background 0.15s, border-color 0.15s, color 0.15s;
    }

    .btn-ghost {
      border: 1px solid #3d4f66;
      background: transparent;
      color: #ededf2;
    }

    .btn-ghost:hover {
      border-color: #13ef95;
      color: #13ef95;
    }

    .btn-danger {
      border: 1px solid #6b2737;
      background: transparent;
      color: #f87171;
    }

    .btn-danger:hover {
      background: #3d1a22;
      border-color: #f87171;
    }

    .btn-primary {
      border: none;
      background: linear-gradient(95deg, #1796c1 20%, #15bdae 40%, #13ef95 95%);
      color: #0a1628;
    }

    .btn-sm {
      height: 32px;
      padding: 0 0.75rem;
      border-radius: 0.25rem;
      font-size: 0.75rem;
      font-weight: 600;
      cursor: pointer;
      white-space: nowrap;
      transition: background 0.15s, border-color 0.15s, color 0.15s;
    }

    .add-row {
      display: flex;
      align-items: flex-end;
      gap: 0.5rem;
      margin-top: 0.5rem;
      flex-wrap: wrap;
    }

    .add-field {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .add-field-label {
      font-size: 0.68rem;
      color: #8899aa;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }

    .add-field-id {
      width: 7rem;
    }

    .add-field-name {
      flex: 1;
      min-width: 10rem;
    }

    .input {
      width: 100%;
      height: 38px;
      background: #1e2a38;
      border: 1px solid #3d4f66;
      border-radius: 0.25rem;
      color: #ededf2;
      font-size: 0.875rem;
      padding: 0 0.75rem;
      box-sizing: border-box;
    }

    .input:focus {
      outline: none;
      border-color: #13ef95;
    }

    .input::placeholder {
      color: #556677;
    }

    .input-id {
      font-family: monospace;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .add-actions {
      display: flex;
      gap: 0.4rem;
      padding-bottom: 1px;
    }

    .auto-match {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      font-size: 0.75rem;
      margin-top: 0.4rem;
    }

    .auto-match-found {
      color: #13ef95;
    }

    .auto-match-notfound {
      color: #fbbf24;
    }

    .id-badge {
      font-family: monospace;
      font-size: 0.7rem;
      font-weight: 700;
      background: #1e2a38;
      border: 1px solid #3d4f66;
      border-radius: 0.2rem;
      padding: 0.1rem 0.4rem;
      color: #8899aa;
      letter-spacing: 0.05em;
    }

    .keyterms-wrap {
      margin-top: 0.75rem;
      background: #1e2a38;
      border: 1px solid #3d4f66;
      border-radius: 0.25rem;
      padding: 0.75rem;
    }

    .keyterms-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 0.6rem;
    }

    .chips {
      display: flex;
      flex-wrap: wrap;
      gap: 0.4rem;
      align-items: center;
    }

    .chip {
      display: inline-flex;
      align-items: center;
      gap: 0.3rem;
      background: #2e3c4d;
      border: 1px solid #3d4f66;
      border-radius: 999px;
      padding: 0.2rem 0.4rem 0.2rem 0.65rem;
      font-size: 0.78rem;
      color: #ededf2;
    }

    .chip-remove {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 16px;
      height: 16px;
      border: none;
      background: transparent;
      color: #8899aa;
      cursor: pointer;
      font-size: 1rem;
      line-height: 1;
      border-radius: 50%;
      padding: 0;
      transition: color 0.15s;
    }

    .chip-remove:hover {
      color: #f87171;
    }

    .keyterm-add-row {
      display: flex;
      align-items: center;
      gap: 0.4rem;
      margin-top: 0.5rem;
    }

    .keyterm-input {
      flex: 1;
      height: 32px;
      background: #2e3c4d;
      border: 1px solid #3d4f66;
      border-radius: 0.25rem;
      color: #ededf2;
      font-size: 0.8rem;
      padding: 0 0.6rem;
    }

    .keyterm-input:focus {
      outline: none;
      border-color: #13ef95;
    }

    .keyterm-input::placeholder {
      color: #556677;
    }

    .empty-state {
      font-size: 0.78rem;
      color: #556677;
      font-style: italic;
    }
  `;

  constructor() {
    super();
    this.medicalMode = false;
    this.autoSelectId = "";
    this.doctors = this._load();
    this.selectedDoctorName = "";
    this.showAddDoctor = false;
    this.newDoctorName = "";
    this.newDoctorId = "";
    this.showAddKeyterm = false;
    this.newKeyterm = "";
    this.autoMatchStatus = null;
  }

  updated(changedProps) {
    if (changedProps.has("autoSelectId") && this.medicalMode) {
      this._handleAutoSelect();
    }
  }

  _handleAutoSelect() {
    if (!this.autoSelectId) {
      this.autoMatchStatus = null;
      return;
    }
    const id = this.autoSelectId.toUpperCase();
    const match = this.doctors.find((d) => d.id && d.id.toUpperCase() === id);
    if (match) {
      this.selectedDoctorName = match.name;
      this.showAddKeyterm = false;
      this.newKeyterm = "";
      this.autoMatchStatus = "found";
      this._dispatchKeyterms();
    } else {
      this.selectedDoctorName = "";
      this.autoMatchStatus = "notfound";
      this._dispatchKeyterms();
    }
  }

  _load() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    } catch {
      return [];
    }
  }

  _save() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.doctors));
  }

  get selectedDoctor() {
    return this.doctors.find((d) => d.name === this.selectedDoctorName) ?? null;
  }

  _selectDoctor(e) {
    this.selectedDoctorName = e.target.value;
    this.autoMatchStatus = null;
    this.showAddKeyterm = false;
    this.newKeyterm = "";
    this._dispatchKeyterms();
  }

  _dispatchKeyterms() {
    const keyterms = this.selectedDoctor ? this.selectedDoctor.keyterms : [];
    this.dispatchEvent(new CustomEvent("keytermselect", {
      detail: keyterms,
      bubbles: true,
      composed: true,
    }));
  }

  _addDoctor() {
    const name = this.newDoctorName.trim();
    const id = this.newDoctorId.trim().toUpperCase();
    if (!name || this.doctors.some((d) => d.name === name)) return;
    this.doctors = [...this.doctors, { name, id, keyterms: [] }];
    this._save();
    this.newDoctorName = "";
    this.newDoctorId = "";
    this.showAddDoctor = false;
    this.selectedDoctorName = name;
    this.autoMatchStatus = null;
    this._dispatchKeyterms();
  }

  _removeDoctor(name) {
    if (!confirm(`Remove ${name}?`)) return;
    this.doctors = this.doctors.filter((d) => d.name !== name);
    this._save();
    if (this.selectedDoctorName === name) {
      this.selectedDoctorName = "";
      this.autoMatchStatus = null;
      this._dispatchKeyterms();
    }
  }

  _addKeyterm() {
    const term = this.newKeyterm.trim();
    if (!term || !this.selectedDoctor) return;
    if (this.selectedDoctor.keyterms.includes(term)) {
      this.newKeyterm = "";
      return;
    }
    this.doctors = this.doctors.map((d) =>
      d.name === this.selectedDoctorName
        ? { ...d, keyterms: [...d.keyterms, term] }
        : d
    );
    this._save();
    this.newKeyterm = "";
    this._dispatchKeyterms();
  }

  _removeKeyterm(term) {
    this.doctors = this.doctors.map((d) =>
      d.name === this.selectedDoctorName
        ? { ...d, keyterms: d.keyterms.filter((k) => k !== term) }
        : d
    );
    this._save();
    this._dispatchKeyterms();
  }

  _onNewDoctorKey(e) {
    if (e.key === "Enter") this._addDoctor();
    if (e.key === "Escape") { this.showAddDoctor = false; this.newDoctorName = ""; this.newDoctorId = ""; }
  }

  _onNewKeytermKey(e) {
    if (e.key === "Enter") this._addKeyterm();
    if (e.key === "Escape") { this.showAddKeyterm = false; this.newKeyterm = ""; }
  }

  _renderAutoMatchBadge() {
    if (!this.autoSelectId) return null;
    if (this.autoMatchStatus === "found") {
      return html`
        <div class="auto-match auto-match-found">
          &#10003; Auto-selected from file ID <span class="id-badge">${this.autoSelectId}</span>
        </div>
      `;
    }
    if (this.autoMatchStatus === "notfound") {
      return html`
        <div class="auto-match auto-match-notfound">
          &#9888; No doctor matched file ID <span class="id-badge">${this.autoSelectId}</span>
        </div>
      `;
    }
    return null;
  }

  render() {
    if (!this.medicalMode) return null;

    const doc = this.selectedDoctor;

    return html`
      <div class="doctor-wrap">
        <div class="section-label">Doctor</div>

        <div class="row">
          <select class="select" @change=${this._selectDoctor} .value=${this.selectedDoctorName}>
            <option value="">— Select a doctor —</option>
            ${this.doctors.map((d) => html`
              <option value=${d.name}>
                ${d.id ? `[${d.id}] ` : ""}${d.name}
              </option>
            `)}
          </select>
          <button class="btn btn-ghost" @click=${() => { this.showAddDoctor = !this.showAddDoctor; this.newDoctorName = ""; this.newDoctorId = ""; }}>
            + New Doctor
          </button>
          ${this.selectedDoctorName ? html`
            <button class="btn btn-danger" @click=${() => this._removeDoctor(this.selectedDoctorName)}>
              Remove
            </button>
          ` : null}
        </div>

        ${this._renderAutoMatchBadge()}

        ${this.showAddDoctor ? html`
          <div class="add-row">
            <div class="add-field add-field-id">
              <span class="add-field-label">File ID (6 chars)</span>
              <input
                class="input input-id"
                type="text"
                maxlength="6"
                placeholder="e.g. DR0012"
                .value=${this.newDoctorId}
                @input=${(e) => this.newDoctorId = e.target.value.toUpperCase()}
                @keydown=${this._onNewDoctorKey}
                autofocus
              />
            </div>
            <div class="add-field add-field-name">
              <span class="add-field-label">Doctor Name</span>
              <input
                class="input"
                type="text"
                placeholder="e.g. Dr. Smith"
                .value=${this.newDoctorName}
                @input=${(e) => this.newDoctorName = e.target.value}
                @keydown=${this._onNewDoctorKey}
              />
            </div>
            <div class="add-actions">
              <button class="btn btn-primary btn-sm" @click=${this._addDoctor}>Add</button>
              <button class="btn btn-ghost btn-sm" @click=${() => { this.showAddDoctor = false; this.newDoctorName = ""; this.newDoctorId = ""; }}>Cancel</button>
            </div>
          </div>
        ` : null}

        ${doc ? html`
          <div class="keyterms-wrap">
            <div class="keyterms-header">
              <span class="section-label" style="margin-bottom:0">
                Keyterms for ${doc.name}${doc.id ? html` <span class="id-badge">${doc.id}</span>` : null}
              </span>
              <span class="empty-state">${doc.keyterms.length} / 100</span>
            </div>
            <div class="chips">
              ${doc.keyterms.length === 0 ? html`<span class="empty-state">No keyterms yet.</span>` : null}
              ${doc.keyterms.map((term) => html`
                <span class="chip">
                  ${term}
                  <button class="chip-remove" title="Remove" @click=${() => this._removeKeyterm(term)}>×</button>
                </span>
              `)}
            </div>
            ${this.showAddKeyterm ? html`
              <div class="keyterm-add-row">
                <input
                  class="keyterm-input"
                  type="text"
                  placeholder="Add keyterm..."
                  .value=${this.newKeyterm}
                  @input=${(e) => this.newKeyterm = e.target.value}
                  @keydown=${this._onNewKeytermKey}
                  autofocus
                />
                <button class="btn btn-primary btn-sm" @click=${this._addKeyterm}>Add</button>
                <button class="btn btn-ghost btn-sm" @click=${() => { this.showAddKeyterm = false; this.newKeyterm = ""; }}>Cancel</button>
              </div>
            ` : html`
              <div class="keyterm-add-row">
                <button class="btn btn-ghost btn-sm" @click=${() => this.showAddKeyterm = true}>+ Add Keyterm</button>
              </div>
            `}
          </div>
        ` : null}
      </div>
    `;
  }
}

customElements.define("app-doctor-select", AppDoctorSelect);
