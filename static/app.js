import { html, css, LitElement } from "https://unpkg.com/lit@2.8.0?module";

console.log("Starting app.js load");

import "./components/app-header.js";
import "./components/app-body.js";

console.log("Components imported");

class App extends LitElement {
  static styles = css`
    :host {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
    }
  `;

  render() {
    console.log("App render called");
    return html`
      <app-header></app-header>
      <app-body></app-body>
    `;
  }
}

console.log("Defining deepgram-starter-ui component");
customElements.define("deepgram-starter-ui", App);

console.log("App module loaded successfully");
window.addEventListener("error", (e) => console.error("Global error:", e));
window.addEventListener("unhandledrejection", (e) => console.error("Unhandled promise rejection:", e));
