import { html, css, LitElement } from "https://unpkg.com/lit@2.8.0?module";

const FALLBACK_MODELS = [
  { model: "nova-3-medical", name: "Nova 3 Medical", type: "Medical", architecture: "nova-3", languages: ["en"], batch: true, streaming: true },
  { model: "nova-3-general", name: "Nova 3 General", type: "General", architecture: "nova-3", languages: ["en", "es", "fr", "de", "ja", "ko", "pt", "ru", "zh"], batch: true, streaming: true },
];

const TYPE_ORDER = ["Medical", "General"];

function deriveType(canonicalName, architecture) {
  const suffix = canonicalName.replace(`${architecture}-`, "");
  if (!suffix || suffix === canonicalName) return "General";
  return suffix.charAt(0).toUpperCase() + suffix.slice(1);
}

class AppModelSelect extends LitElement {
  static properties = {
    models: {},
    selectedModel: {},
    selectedModelInfo: { state: true },
    loading: { state: true },
    error: { state: true },
  };
  static styles = css`
    .app-model-select {
      margin-top: 0.4rem;
      width: 80rem;
      display: flex;
      justify-content: center;
      padding-inline-start: 0px;
    }

    .select-container {
      display: flex;
      flex-direction: column;
    }

    select {
      padding: 0 16px;
      width: 100%;
      font-size: 14px;
      box-shadow: 0 20px 25px -5px black, 0 8px 10px -6px black;
      color: white;
      height: 51px;
      margin-bottom: 1rem;
      border-radius: 0.0625rem;
      background: #2e3c4d;
      border: solid #3d4f66 1px;
      -moz-appearance: none;
      -webkit-appearance: none;
      appearance: none;
      background-image: url("assets/select.svg");
      background-repeat: no-repeat, repeat;
      background-position: right 0.7em top 50%, 0 0;
      background-size: 14px auto, 150%;
    }

    label {
      margin-bottom: 0.25rem;
      text-align: center;
      display: block;
      transform: translateY(-4px);
    }

    .model-info {
      margin-top: -0.5rem;
      margin-bottom: 1rem;
      padding: 0.75rem 1rem;
      background: #2e3c4d;
      border: solid #3d4f66 1px;
      border-radius: 0.0625rem;
      font-size: 0.8rem;
      color: #ededf2;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0.35rem 1.5rem;
    }

    .model-info-row {
      display: contents;
    }

    .model-info-label {
      color: #8899aa;
      white-space: nowrap;
    }

    .model-info-value {
      color: #ededf2;
      word-break: break-word;
    }

    .cap-badge {
      display: inline-block;
      padding: 0.1rem 0.4rem;
      border-radius: 0.25rem;
      font-size: 0.7rem;
      font-weight: 600;
      margin-right: 0.25rem;
      background: #1796c1;
      color: white;
    }
  `;

  constructor() {
    super();
    this.selectedModel = "";
    this.selectedModelInfo = null;
    this.models = [];
    this.loading = true;
    this.error = "";
  }

  get _select() {
    return (this.___select ??=
      this.renderRoot?.querySelector("select") ?? null);
  }

  async firstUpdated() {
    await this._loadModels();
    this.renderRoot.querySelector("select").selectedIndex = 0;
    this._dispatchSelectModel();
  }

  async _loadModels() {
    try {
      const res = await fetch("/api/models");
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const sttModels = (data.stt ?? []).filter((m) => m.architecture === "nova-3").map((m) => ({
        model: m.canonical_name,
        name: m.name,
        type: deriveType(m.canonical_name, m.architecture ?? ""),
        architecture: m.architecture ?? "",
        languages: m.languages ?? [],
        batch: m.batch ?? false,
        streaming: m.streaming ?? false,
        version: m.version ?? "",
      }));
      const latestMap = new Map();
      for (const m of sttModels) {
        const existing = latestMap.get(m.model);
        if (!existing || m.version > existing.version) latestMap.set(m.model, m);
      }
      const latest = [...latestMap.values()];
      this.models = latest.length ? latest : FALLBACK_MODELS;
    } catch {
      this.error = "Could not load models from API — using defaults.";
      this.models = FALLBACK_MODELS;
    } finally {
      this.loading = false;
    }
  }

  _dispatchSelectModel = () => {
    const selectedValue = this._select?.value;
    const modelObj = this.models.find((m) => m.model === selectedValue) ?? null;

    this.selectedModel = modelObj;
    this.selectedModelInfo = modelObj;

    if (modelObj) {
      console.log('app-model-select: dispatching', modelObj);
      const options = {
        detail: modelObj,
        bubbles: true,
        composed: true,
      };
      this.dispatchEvent(new CustomEvent("modelselect", options));
    }
  }

  _renderGroupedOptions() {
    const groups = new Map();
    for (const model of this.models) {
      const type = model.type ?? "Other";
      if (!groups.has(type)) groups.set(type, []);
      groups.get(type).push(model);
    }

    const sorted = [
      ...TYPE_ORDER.filter((t) => groups.has(t)),
      ...[...groups.keys()].filter((t) => !TYPE_ORDER.includes(t)).sort(),
    ];

    return sorted.map((type) => html`
      <optgroup label="${type}">
        ${groups.get(type).map((m) => html`<option value="${m.model}">${m.name}</option>`)}
      </optgroup>
    `);
  }

  _renderInfoPanel() {
    const m = this.selectedModelInfo;
    if (!m) return null;

    const LANG_FILTER = ["en", "en-AU", "en-GB"];
    const LANG_LABELS = { en: "English", "en-AU": "Australian", "en-GB": "British" };
    const allLangs = m.languages ?? [];
    const filteredLangs = LANG_FILTER.filter((code) => allLangs.includes(code));
    const langDisplay = filteredLangs.length
      ? filteredLangs.map((code) => LANG_LABELS[code]).join(", ")
      : "—";

    return html`
      <div class="model-info">
        <div class="model-info-row">
          <span class="model-info-label">Architecture</span>
          <span class="model-info-value">${m.architecture || "—"}</span>
        </div>
        <div class="model-info-row">
          <span class="model-info-label">Languages</span>
          <span class="model-info-value">${langDisplay}</span>
        </div>
        ${m.version ? html`
        <div class="model-info-row">
          <span class="model-info-label">Version</span>
          <span class="model-info-value">${m.version}</span>
        </div>` : null}
        <div class="model-info-row">
          <span class="model-info-label">Capabilities</span>
          <span class="model-info-value">
            ${m.batch ? html`<span class="cap-badge">Batch</span>` : null}
            ${m.streaming ? html`<span class="cap-badge">Streaming</span>` : null}
          </span>
        </div>
      </div>
    `;
  }

  render() {
    return html`<div class="app-model-select">
      <div class="select-container">
        <label>Model:</label>
        ${this.error ? html`<p style="color: orange; font-size: 0.8rem; margin: 0 0 0.25rem;">${this.error}</p>` : null}
        <div class="styled-select">
          <select @change=${this._dispatchSelectModel} ?disabled=${this.loading}>
            ${this.loading
              ? html`<option>Loading models…</option>`
              : this._renderGroupedOptions()}
          </select>
        </div>
        ${this._renderInfoPanel()}
      </div>
    </div>`;
  }
}

customElements.define("app-model-select", AppModelSelect);
