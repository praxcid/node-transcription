import { html, css, LitElement } from "//cdn.skypack.dev/lit@v2.8.0";
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
    results: { state: true },
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
  `;

  constructor() {
    super();
    this.selectedModel = "";
    this.files = [];
    this.fileUrl = "";
    this.selectedFeatures = {};
    this.error = "";
    this.done = true;
    this.working = false;
    this.results = [];
  }

  async submitRequest() {
    if (this.files.length === 0 && !this.fileUrl) {
      this.error = "Please select a file or provide a URL.";
      return;
    }

    this.done = false;
    this.working = true;
    this.results = [];
    this.error = "";
    this.requestUpdate();

    const apiOrigin = "http://localhost:8080";

    const processFile = async (file) => {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("model", this.selectedModel.model);
      formData.append("tier", this.selectedModel.tier);
      formData.append("features", JSON.stringify(this.selectedFeatures));

      try {
        const response = await fetch(`${apiOrigin}/api`, {
          method: "POST",
          body: formData,
        });

        const { err, transcription } = await response.json();
        if (err) throw new Error(err);

        this.results = [...this.results, { file: file.name, result: transcription.results }];
        this.requestUpdate();
      } catch (error) {
        console.log(error);
        this.error = `Error processing ${file.name}: ${error.message}`;
        this.requestUpdate();
      }
    };

    for (const file of this.files) {
      await processFile(file);
    }

    this.working = false;
    this.done = true;
    this.requestUpdate();

    setTimeout(() => {
      if (this._button && this._button[0]) {
        const top = this._button[0].getBoundingClientRect().top + window.scrollY;
        window.scrollTo({ top, behavior: "smooth" });
      }
    }, 500);
  }

  isLoading() {
    if (this.working) {
      return html` <app-spinner></app-spinner>`;
    } else {
      return null;
    }
  }

  get _button() {
    return (this.___button ??=
      this.renderRoot?.querySelectorAll("button") ?? null);
  }

  _modelSelectListener(e) {
    this.selectedModel = e.detail[0];
  }

  _fileSelectListener(e) {
    this.files = Array.from(e.detail);
    this.fileUrl = "";
    this.requestUpdate();
  }
  _fileURLSelectListener(e) {
    this.fileUrl = e.detail;
    this.files = [];
    this.requestUpdate();
  }
  _featureSelectListener(e) {
    this.selectedFeatures = e.detail;
    this.requestUpdate();
  }

  render() {
    return html`
      <div
        @fileselect=${this._fileSelectListener}
        @modelselect=${this._modelSelectListener}
        @fileURLselect=${this._fileURLSelectListener}
        @featureselect=${this._featureSelectListener}
        @submit=${this.submitRequest}
        class="app-demo"
      >
        <slot></slot>
      </div>
      <div class="transcript">
        ${this.isLoading()}
        ${this.results.map(
          (item) => html`
            <h4>${item.file}</h4>
            <app-transcript .result=${item.result}></app-transcript>
          `
        )}
      </div>
    `;
  }
}

customElements.define("app-demo", AppDemo);
