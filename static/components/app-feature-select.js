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
      margin-top: 2rem;
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
    // Default Smart Format and Dictation to enabled
    this.selectedFeatures = { smart_format: true, dictation: true };
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
      {
        category: "FORMATTING",
        name: "Dictation",
        description:
          "Indicates whether to add dictation commands to the transcript.",
        key: "dictation",
        dataType: "boolean",
      },
    ];
  }

  firstUpdated() {
    // Initialize displayed features
    this.filterFeatures("FORMATTING");

    // Dispatch initial features
    const options = {
      detail: this.selectedFeatures,
      bubbles: true,
      composed: true,
    };
    this.dispatchEvent(new CustomEvent("featureselect", options));
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
    const featureName = e.target.name;
    const isChecked = e.target.checked;

    if (isChecked) {
      this.selectedFeatures[featureName] = e.target.value === "on" ? true : e.target.value;
    } else {
      delete this.selectedFeatures[featureName];
    }

    if (featureName === "smart_format") {
      if (isChecked) {
        // when smart_format is on, let it control these features
        delete this.selectedFeatures.punctuate;
        delete this.selectedFeatures.paragraphs;
        delete this.selectedFeatures.numerals;
      }
    }

    const options = {
      detail: this.selectedFeatures,
      bubbles: true,
      composed: true,
    };

    this.dispatchEvent(new CustomEvent("featureselect", options));
    this.requestUpdate();
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
                  ?checked=${this.selectedFeatures[feature.key]}
                  @change=${this.selectFeature}
                  ?disabled=${this.selectedFeatures.smart_format &&
                  ["punctuate", "paragraphs", "numerals"].includes(feature.key)}
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
