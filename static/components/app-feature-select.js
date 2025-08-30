import { html, css, LitElement } from "//cdn.skypack.dev/lit@v2.8.0";

class AppFeatureSelect extends LitElement {
  static properties = {
    features: {},
    displayedFeatures: {},
    selectedFeatures: {},
    currentCategory: {},
  };

  static styles = css`
    * {
      box-sizing: border-box;
    }

    .app-feature-select {
      display: flex;
      justify-content: center;
      border-radius: 0.0625rem;
    }

    .tabcontent {
      background: #2e3c4d;
      padding: 1.25rem;
      border-radius: 0.0625rem;
      height: fit-content;
      min-height: 300px;
      width: 70%;
      border: solid #3d4f66 1px;
    }

    .tabcontent input {
      /* additional input styles may go here */
    }

    .tabcontent label {
      font-weight: 600;
    }

    .tabcontent p {
      color: #ededf2;
    }
  `;

  constructor() {
    super();
  this.displayedFeatures = [];
  // Default Smart Format to enabled
  this.selectedFeatures = { smart_format: true };
    this.currentCategory = "";
    this.features = [
      {
        category: "FORMATTING",
        name: "Smart Format",
        description:
          "Smart Format improves readability by applying additional FORMATTING. When enabled, the following features will be automatically applied: Punctuation, Numerals, Paragraphs, Dates, Times, and Alphanumerics.",
        key: "smart_format",
        dataType: "boolean",
      },
      {
        category: "FORMATTING",
        name: "Punctuation",
        description:
          "Indicates whether to add punctuation and capitalization to the transcript.",
        key: "punctuate",
        dataType: "boolean",
      },
      {
        category: "FORMATTING",
        name: "Paragraphs",
        description:
          "Indicates whether Deepgram will split audio into paragraphs to improve transcript readability. When paragraphs is set to true, punctuate will also be set to true.",
        key: "paragraphs",
        dataType: "boolean",
      },
      {
        category: "FORMATTING",
        name: "Numerals",
        description:
          "Indicates whether to convert numbers from written format (e.g. one) to numerical format (e.g. 1).",
        key: "numerals",
        dataType: "boolean",
      },
      {
        category: "FORMATTING",
        name: "Diarization",
        description: "Indicates whether to recognize speaker changes.",
        key: "diarize",
        dataType: "boolean",
      },
    ];
  }

  firstUpdated() {
    // Initialize displayed features
    this.filterFeatures("FORMATTING");
  }

  filterFeatures(item) {
    this.displayedFeatures = [];
    this.features.filter((i) => {
      if (i.category === item) {
        this.displayedFeatures.push(i);
      }
    });
  }

  selectFeature(e) {
    if (this.selectedFeatures.hasOwnProperty(e.target.name)) {
      const featureToDelete = e.target.name;
      delete this.selectedFeatures[featureToDelete];
    } else {
      this.selectedFeatures[e.target.name] = true;
    }

    const options = {
      detail: this.selectedFeatures,
      bubbles: true,
      composed: true,
    };

    this.dispatchEvent(new CustomEvent("featureselect", options));
  }

  render() {
    return html`<div class="app-feature-select">
      <div id="FORMATTING" class="tabcontent">
        <section>
          ${this.displayedFeatures.map(
            (feature) => html`
              <div>
                <input
                  type="checkbox"
                  id="${feature.key}"
                  name="${feature.key}"
                  ?checked=${feature.key === "smart_format" || this.selectedFeatures[feature.key]}
                  @change=${this.selectFeature}
                />
                <label for="${feature.key}">${feature.name}</label>
                <p>${feature.description}</p>
              </div>
            `
          )}
        </section>
      </div>
    </div>`;
  }
}

customElements.define("app-feature-select", AppFeatureSelect);
