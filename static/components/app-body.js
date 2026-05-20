import { html, css, LitElement } from "https://unpkg.com/lit@2.8.0?module";
import "./app-demo.js";
import "./app-audio-select.js";
import "./app-model-select.js";
import "./app-feature-select.js";
import "./app-submit-button.js";
import "./app-doctor-select.js";

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
        <app-audio-select slot="audio"></app-audio-select>
        <app-model-select slot="model"></app-model-select>
        <app-doctor-select slot="doctor"></app-doctor-select>
        <app-submit-button slot="actions"></app-submit-button>
        <app-feature-select slot="features"></app-feature-select>
      </app-demo>
    </article>`;
  }
}

customElements.define("app-body", AppBody);
