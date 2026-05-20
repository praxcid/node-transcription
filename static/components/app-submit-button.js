import { html, css, LitElement } from "https://unpkg.com/lit@2.8.0?module";

class AppSubmitButton extends LitElement {
  static properties = {
    showReset: { type: Boolean },
  };

  constructor() {
    super();
    this.showReset = false;
  }

  static styles = css`
    .submit-button {
      margin-top: 0.25rem;
      padding-top: 1.25rem;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    }

    .submit-button button {
      border: none;
      font-size: 16px;
      font-weight: 600;
      border-radius: 0.0625rem;
      background: linear-gradient(95deg, #1796c1 20%, #15bdae 40%, #13ef95 95%);
      height: 45px;
      width: 250px;
      cursor: pointer;
    }

    .reset-button {
      margin-top: 0.75rem;
      display: flex;
      justify-content: center;
    }

    .reset-button button {
      border: 1px solid #3d4f66;
      background: transparent;
      color: #ededf2;
      font-size: 15px;
      font-weight: 600;
      border-radius: 0.0625rem;
      height: 45px;
      width: 250px;
      cursor: pointer;
      transition: background 0.15s, border-color 0.15s, color 0.15s;
    }

    .reset-button button:hover {
      background: #2e3c4d;
      border-color: #13ef95;
      color: #13ef95;
    }
  `;

  _dispatchSubmit() {
    this.dispatchEvent(new CustomEvent("submit", { bubbles: true, composed: true }));
  }

  _dispatchReset() {
    this.dispatchEvent(new CustomEvent("resetrequest", { bubbles: true, composed: true }));
  }

  render() {
    return html`
      <div class="submit-button">
        <button @click=${this._dispatchSubmit}>Transcribe</button>
      </div>
      ${this.showReset ? html`
        <div class="reset-button">
          <button @click=${this._dispatchReset}>Start Over</button>
        </div>
      ` : null}
    `;
  }
}

customElements.define("app-submit-button", AppSubmitButton);
