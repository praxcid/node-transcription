import { html, css, LitElement } from "https://unpkg.com/lit@2.8.0?module";
import "./app-demo.js";
import "./app-audio-select.js";
import "./app-model-select.js";
import "./app-feature-select.js";
import "./app-submit-button.js";

class AppBody extends LitElement {
  static styles = css`
    :host {
      display: flex;
      flex-direction: column;
      flex-grow: 1;
    }

    .body {
      flex-grow: 1;
      display: flex;
      flex-direction: column;
    }
  `;

  render() {
    return html`<article class="body">
      <app-demo>
        <app-audio-select></app-audio-select>
        <app-model-select></app-model-select>
        <app-submit-button></app-submit-button>
        <app-feature-select></app-feature-select>
      </app-demo>
    </article>`;
  }
}

customElements.define("app-body", AppBody);
