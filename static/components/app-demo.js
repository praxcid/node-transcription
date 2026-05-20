import { html, css, LitElement } from "https://unpkg.com/lit@2.8.0?module";
import "./app-transcript.js";
import "./app-spinner.js";

class AppDemo extends LitElement {
  static properties = {
    error: {},
    done: {},
    working: {},
    selectedModel: {},
    files: { state: true },
    fileUrl: {},
    selectedFeatures: {},
    keyterms: { state: true },
    results: { state: true },
    currentFileIndex: { state: true },
    currentFileName: { state: true },
    abortController: { state: true },
  };

  static styles = css`
    .app-demo {
      display: flex;
      flex-direction: column;
      margin-left: auto;
      margin-right: auto;
      max-width: 80rem;
      padding: 2rem;
    }

    .transcript {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    }

    .start-over-bar {
      display: flex;
      justify-content: center;
      padding: 2rem 0 3rem;
    }

    .start-over-btn {
      border: 1px solid #3d4f66;
      background: transparent;
      color: #ededf2;
      font-size: 15px;
      font-weight: 600;
      border-radius: 0.0625rem;
      height: 45px;
      padding: 0 2rem;
      cursor: pointer;
      transition: background 0.15s, border-color 0.15s;
    }

    .start-over-btn:hover {
      background: #2e3c4d;
      border-color: #13ef95;
      color: #13ef95;
    }

    .file-status-list {
      display: flex;
      flex-direction: column;
      gap: 0.4rem;
      padding-bottom: 1.25rem;
    }

    .file-status-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      background: #2e3c4d;
      border: 1px solid #3d4f66;
      border-radius: 0.25rem;
      padding: 0.55rem 1rem;
      font-size: 0.875rem;
    }

    .file-status-name {
      flex: 1;
      color: #ededf2;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .badge {
      font-size: 0.7rem;
      font-weight: 700;
      border-radius: 0.2rem;
      padding: 0.15rem 0.55rem;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      flex-shrink: 0;
    }

    .badge-waiting {
      background: #1e2a38;
      color: #8899aa;
      border: 1px solid #3d4f66;
    }

    .badge-processing {
      background: #0e2a1e;
      color: #13ef95;
      border: 1px solid #13ef95;
    }

    .badge-done {
      background: #0e2a1e;
      color: #13ef95;
      border: 1px solid #13ef95;
    }

    .badge-error {
      background: #2a1212;
      color: #f87171;
      border: 1px solid #6b2737;
    }

    .badge-aborted {
      background: #2a1f10;
      color: #fbbf24;
      border: 1px solid #78521a;
    }

    .status-spinner {
      width: 14px;
      height: 14px;
      border: 2px solid #1e3a28;
      border-top-color: #13ef95;
      border-radius: 50%;
      animation: spin 0.7s linear infinite;
      flex-shrink: 0;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .abort-btn {
      border: 1px solid #6b2737;
      background: transparent;
      color: #f87171;
      font-size: 0.7rem;
      font-weight: 600;
      border-radius: 0.2rem;
      height: 26px;
      padding: 0 0.6rem;
      cursor: pointer;
      flex-shrink: 0;
      transition: background 0.15s, border-color 0.15s;
    }

    .abort-btn:hover {
      background: #3d1a22;
      border-color: #f87171;
    }

    .retry-btn {
      border: 1px solid #3d4f66;
      background: transparent;
      color: #ededf2;
      font-size: 0.7rem;
      font-weight: 600;
      border-radius: 0.2rem;
      height: 26px;
      padding: 0 0.6rem;
      cursor: pointer;
      flex-shrink: 0;
      transition: background 0.15s, border-color 0.15s, color 0.15s;
    }

    .retry-btn:hover {
      background: #2e3c4d;
      border-color: #13ef95;
      color: #13ef95;
    }
  `;

  constructor() {
    super();
    this.selectedModel = "";
    this.files = [];
    this.fileUrl = "";
    this.selectedFeatures = {};
    this.keyterms = [];
    this.error = "";
    this.done = true;
    this.working = false;
    this.results = [];
    this.currentFileIndex = -1;
    this.currentFileName = "";
    this.abortController = null;
  }

  submitRequest = async () => {
    if (this.files.length === 0 && !this.fileUrl) {
      this.error = "Please select a file or provide a URL.";
      return;
    }

    this.done = false;
    this.working = true;
    this.results = [];
    this.error = "";
    this.currentFileIndex = -1;
    this.currentFileName = "";
    this.requestUpdate();

    const apiOrigin = window.location.origin;

    for (let i = 0; i < this.files.length; i++) {
      const file = this.files[i];
      this.currentFileIndex = i;
      this.currentFileName = file.name;
      this.abortController = new AbortController();
      this.requestUpdate();

      const formData = new FormData();
      formData.append("file", file);
      formData.append("model", this.selectedModel.model);
      formData.append("features", JSON.stringify(this.selectedFeatures));
      if (this.keyterms.length) formData.append("keyterms", JSON.stringify(this.keyterms));

      try {
        const response = await fetch(`${apiOrigin}/api`, {
          method: "POST",
          body: formData,
          signal: this.abortController.signal,
        });

        const { err, transcription } = await response.json();
        if (err) throw new Error(err);

        this.results = [...this.results, { file: file.name, result: transcription.results, status: "done" }];
        this.requestUpdate();
      } catch (error) {
        if (error.name === "AbortError") {
          this.results = [...this.results, { file: file.name, result: null, status: "aborted", errorMsg: "Aborted by user." }];
          this.requestUpdate();
          break;
        }
        console.log(error);
        this.results = [...this.results, { file: file.name, result: null, status: "error", errorMsg: error.message }];
        this.requestUpdate();
      }
    }

    this.working = false;
    this.done = true;
    this.currentFileIndex = -1;
    this.currentFileName = "";
    this.abortController = null;
    this.requestUpdate();

    const submitButton = this.querySelector("app-submit-button");
    if (submitButton) submitButton.showReset = true;

    setTimeout(() => {
      if (this._button && this._button[0]) {
        const top = this._button[0].getBoundingClientRect().top + window.scrollY;
        window.scrollTo({ top, behavior: "smooth" });
      }
    }, 500);
  }

  abortProcessing() {
    if (this.abortController) {
      this.abortController.abort();
    }
  }

  retryFile = async (fileName) => {
    const file = this.files.find((f) => f.name === fileName);
    if (!file) return;

    const idx = this.results.findIndex((r) => r.file === fileName);
    if (idx === -1) return;

    this.results = this.results.map((r, i) =>
      i === idx ? { ...r, status: "retrying", errorMsg: "" } : r
    );
    this.requestUpdate();

    const apiOrigin = window.location.origin;
    const controller = new AbortController();
    const formData = new FormData();
    formData.append("file", file);
    formData.append("model", this.selectedModel.model);
    formData.append("features", JSON.stringify(this.selectedFeatures));
    if (this.keyterms.length) formData.append("keyterms", JSON.stringify(this.keyterms));

    try {
      const response = await fetch(`${apiOrigin}/api`, {
        method: "POST",
        body: formData,
        signal: controller.signal,
      });

      const { err, transcription } = await response.json();
      if (err) throw new Error(err);

      this.results = this.results.map((r, i) =>
        i === idx ? { file: fileName, result: transcription.results, status: "done" } : r
      );
    } catch (error) {
      this.results = this.results.map((r, i) =>
        i === idx ? { ...r, status: "error", errorMsg: error.message } : r
      );
    }
    this.requestUpdate();
  }

  resetDemo() {
    this.files = [];
    this.fileUrl = "";
    this.results = [];
    this.error = "";
    this.keyterms = [];

    const audioSelect = this.querySelector("app-audio-select");
    if (audioSelect) audioSelect.selectedFiles = [];

    const featureSelect = this.querySelector("app-feature-select");
    if (featureSelect) featureSelect.keyterms = "";

    const doctorSelect = this.querySelector("app-doctor-select");
    if (doctorSelect) { doctorSelect.selectedDoctorName = ""; doctorSelect.autoSelectId = ""; }

    const submitButton = this.querySelector("app-submit-button");
    if (submitButton) submitButton.showReset = false;

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  renderFileStatuses() {
    if (!this.working && this.results.length === 0) return null;

    return html`
      <div class="file-status-list">
        ${this.files.map((file, i) => {
          const result = this.results.find((r) => r.file === file.name);
          let indicator = null;
          let badge = null;
          let action = null;

          if (result) {
            if (result.status === "done") {
              badge = html`<span class="badge badge-done">Done</span>`;
            } else if (result.status === "error") {
              badge = html`<span class="badge badge-error">Error</span>`;
              action = html`<button class="retry-btn" @click=${() => this.retryFile(file.name)}>Retry</button>`;
            } else if (result.status === "aborted") {
              badge = html`<span class="badge badge-aborted">Aborted</span>`;
              action = html`<button class="retry-btn" @click=${() => this.retryFile(file.name)}>Retry</button>`;
            } else if (result.status === "retrying") {
              indicator = html`<div class="status-spinner"></div>`;
              badge = html`<span class="badge badge-processing">Retrying</span>`;
            }
          } else if (this.working && i === this.currentFileIndex) {
            indicator = html`<div class="status-spinner"></div>`;
            badge = html`<span class="badge badge-processing">Processing</span>`;
            action = html`<button class="abort-btn" @click=${this.abortProcessing}>Abort</button>`;
          } else {
            badge = html`<span class="badge badge-waiting">Waiting</span>`;
          }

          return html`
            <div class="file-status-item">
              ${indicator}
              <span class="file-status-name">${file.name}</span>
              ${badge}
              ${action}
            </div>
          `;
        })}
      </div>
    `;
  }

  get _button() {
    return (this.___button ??=
      this.renderRoot?.querySelectorAll("button") ?? null);
  }

  _modelSelectListener = (e) => {
    this.selectedModel = e.detail;
    const isMedical = e.detail?.model?.includes("medical") ?? false;
    const featureSelect = this.querySelector("app-feature-select");
    if (featureSelect) featureSelect.medicalMode = isMedical;
    const doctorSelect = this.querySelector("app-doctor-select");
    if (doctorSelect) doctorSelect.medicalMode = isMedical;
    if (!isMedical) this.keyterms = [];
  }

  _keytermSelectListener = (e) => {
    this.keyterms = e.detail;
  }

  _fileSelectListener = (e) => {
    this.files = Array.from(e.detail);
    this.fileUrl = "";
    this._autoSelectDoctor();
    this.requestUpdate();
  }

  _autoSelectDoctor() {
    const doctorSelect = this.querySelector("app-doctor-select");
    if (!doctorSelect) return;
    const firstFile = this.files[0];
    if (firstFile) {
      const nameWithoutExt = firstFile.name.replace(/\.[^.]+$/, "");
      doctorSelect.autoSelectId = nameWithoutExt.slice(0, 6).toUpperCase();
    } else {
      doctorSelect.autoSelectId = "";
    }
  }
  _fileURLSelectListener = (e) => {
    this.fileUrl = e.detail;
    this.files = [];
    this.requestUpdate();
  }
  _featureSelectListener = (e) => {
    this.selectedFeatures = e.detail;
    this.requestUpdate();
  }

  render() {
    const doneResults = this.results.filter((r) => r.status === "done");

    return html`
      <div
        @fileselect=${this._fileSelectListener}
        @modelselect=${this._modelSelectListener}
        @fileURLselect=${this._fileURLSelectListener}
        @featureselect=${this._featureSelectListener}
        @keytermselect=${this._keytermSelectListener}
        @resetrequest=${this.resetDemo}
        @submit=${this.submitRequest}
        class="app-demo"
      >
        <slot name="audio"></slot>
        <slot name="model"></slot>
        <slot name="doctor"></slot>
        ${this.renderFileStatuses()}
        <slot name="actions"></slot>
        <slot name="features"></slot>
      </div>
      <div class="transcript">
        ${doneResults.map((item) => html`
          <h4>${item.file}</h4>
          <app-transcript
            .result=${item.result}
            .fileName=${item.file}
            .modelName=${this.selectedModel.name}
          ></app-transcript>
        `)}
        ${this.done && doneResults.length > 0 ? html`
          <div class="start-over-bar">
            <button class="start-over-btn" @click=${this.resetDemo}>Start Over</button>
          </div>
        ` : null}
      </div>
    `;
  }
}

customElements.define("app-demo", AppDemo);
