import { html, css, LitElement } from "https://unpkg.com/lit@2.8.0?module";

class AppModelSelect extends LitElement {
  static properties = {
    models: {},
    selectedModel: {},
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
  `;

  constructor() {
    super();
    this.selectedModel = "";
    this.models = [
      {
        model: "nova-3-medical",
        name: "Deepgram Nova 3 Medical",
      },
      {
        model: "nova-3-general",
        name: "Deepgram Nova 3 General",
      },
    ];
  }

  get _select() {
    return (this.___select ??=
      this.renderRoot?.querySelector("select") ?? null);
  }

  firstUpdated() {
    this.renderRoot.querySelector("select").selectedIndex = 0;
    this._dispatchSelectModel();
  }

  _dispatchSelectModel = () => {
    const selectedValue = this._select?.value;
    const modelObj = this.models.find((m) => m.model === selectedValue) ?? null;

    // Keep selectedModel as the model object for easier use by consumers
    this.selectedModel = modelObj;

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

  render() {
    return html`<div class="app-model-select">
      <div class="select-container">
        <label>Model:</label>
        <div class="styled-select">
          <select @change=${this._dispatchSelectModel}>
            ${this.models.map(
              (model) => html`<option value="${model.model}">${model.name}</option>`
            )}
          </select>
        </div>
      </div>
    </div>`;
  }
}

customElements.define("app-model-select", AppModelSelect);
