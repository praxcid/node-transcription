import { html, css, LitElement } from "//cdn.skypack.dev/lit@v2.8.0";

class AppSubmitButton extends LitElement {
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
  `;

  _dispatchSubmit() {
    const options = {
      bubbles: true,
      composed: true,
    };
    this.dispatchEvent(new CustomEvent("submit", options));
  }

  render() {
    return html`
      <div class="submit-button">
        <button @click=${this._dispatchSubmit}>Transcribe</button>
      </div>
    `;
  }
}

customElements.define("app-submit-button", AppSubmitButton);
