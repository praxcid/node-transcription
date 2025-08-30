import { css, html, LitElement } from "//cdn.skypack.dev/lit@v2.8.0";
class AppHeader extends LitElement {
  static styles = css`
    h1 {
      font-size: inherit;
      font-weight: inherit;
      margin: 0;
    }

    nav {
      background: linear-gradient(
          3.95deg,
          #101014 3.44%,
          rgba(0, 0, 0, 0) 174.43%
        ),
        linear-gradient(
          270deg,
          #208f68 0.7%,
          #27336a 24.96%,
          #0c0310 50.78%,
          #370c4d 76.47%,
          #95125c 100%
        );
      color: white;
    }

    .nav-margin {
      height: 100px;
      max-width: 1536px;
      display: flex;
      flex-direction: row;
      flex-wrap: nowrap;
      justify-content: center;
      align-items: center;
      align-content: stretch;
      padding-left: 2rem;
      padding-right: 2rem;
    }

    .nav-logo {
      display: inline;
      height: 2rem;
      margin-bottom: -5px;
      margin-right: 1rem;
    }

    .nav-heading {
      display: inline;
    }

    .nav-brand {
      color: white;
      align-items: center;
      display: flex;
      height: 4rem;
      font-size: 1.5rem;
    }
  `;

  render() {
    return html`<nav>
      <div class="nav-margin">
        <div class="nav-brand">
          <div>Paragon Deepgram Transcriber</div>
        </div>
      </div>
    </nav>`;
  }
}

customElements.define("app-header", AppHeader);
