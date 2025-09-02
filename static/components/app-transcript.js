import { html, css, LitElement } from "//cdn.skypack.dev/lit@v2.8.0";

class AppTranscript extends LitElement {
  static properties = {
    result: {},
    transcript: {},
    summary: {},
    topics: {},
    diarize: {},
    fileName: {},
    modelName: {},
  };
  static styles = css`
    section {
      background: #2e3c4d;
      height: fit-content;
      width: 896px;
      margin-bottom: 10px;
      padding: 1.25rem;
      border-radius: 0.0625rem;
      border: solid #3d4f66 1px;
    }

    topics-section {
      display: flex;
      padding-right: 6px;
    }

    .diarize-section {
      padding-bottom: 6px;
    }
  `;
  constructor() {
    super();
    this.transcript = "";
    this.summary = "";
    this.topics = [];
    this.diarize = "";
    this.fileName = "";
    this.modelName = "";
  }

  update(changedProps) {
    if (changedProps.has("result")) {
      this.setResults();
    }
    super.update(changedProps);
  }

  expandContractions(text) {
    const contractions = {
      "ain't": "am not",
      "aren't": "are not",
      "can't": "cannot",
      "can't've": "cannot have",
      "'cause": "because",
      "could've": "could have",
      "couldn't": "could not",
      "couldn't've": "could not have",
      "didn't": "did not",
      "doesn't": "does not",
      "don't": "do not",
      "hadn't": "had not",
      "hadn't've": "had not have",
      "hasn't": "has not",
      "haven't": "have not",
      "he'd": "he would",
      "he'd've": "he would have",
      "he'll": "he will",
      "he'll've": "he will have",
      "he's": "he is",
      "how'd": "how did",
      "how'd'y": "how do you",
      "how'll": "how will",
      "how's": "how is",
      "I'd": "I would",
      "I'd've": "I would have",
      "I'll": "I will",
      "I'll've": "I will have",
      "I'm": "I am",
      "I've": "I have",
      "isn't": "is not",
      "it'd": "it would",
      "it'd've": "it would have",
      "it'll": "it will",
      "it'll've": "it will have",
      "it's": "it is",
      "let's": "let us",
      "ma'am": "madam",
      "mayn't": "may not",
      "might've": "might have",
      "mightn't": "might not",
      "mightn't've": "might not have",
      "must've": "must have",
      "mustn't": "must not",
      "mustn't've": "must not have",
      "needn't": "need not",
      "needn't've": "need not have",
      "o'clock": "of the clock",
      "oughtn't": "ought not",
      "oughtn't've": "ought not have",
      "shan't": "shall not",
      "sha'n't": "shall not",
      "shan't've": "shall not have",
      "she'd": "she would",
      "she'd've": "she would have",
      "she'll": "she will",
      "she'll've": "she will have",
      "she's": "she is",
      "should've": "should have",
      "shouldn't": "should not",
      "shouldn't've": "should not have",
      "so've": "so have",
      "so's": "so is",
      "that'd": "that would",
      "that'd've": "that would have",
      "that's": "that is",
      "there'd": "there would",
      "there'd've": "there would have",
      "there's": "there is",
      "they'd": "they would",
      "they'd've": "they would have",
      "they'll": "they will",
      "they'll've": "they will have",
      "they're": "they are",
      "they've": "they have",
      "to've": "to have",
      "wasn't": "was not",
      "we'd": "we would",
      "we'd've": "we would have",
      "we'll": "we will",
      "we'll've": "we will have",
      "we're": "we are",
      "we've": "we have",
      "weren't": "were not",
      "what'll": "what will",
      "what'll've": "what will have",
      "what're": "what are",
      "what's": "what is",
      "what've": "what have",
      "when's": "when is",
      "when've": "when have",
      "where'd": "where did",
      "where's": "where is",
      "where've": "where have",
      "who'll": "who will",
      "who'll've": "who will have",
      "who's": "who is",
      "who've": "who have",
      "why's": "why is",
      "why've": "why have",
      "will've": "will have",
      "won't": "will not",
      "won't've": "will not have",
      "would've": "would have",
      "wouldn't": "would not",
      "wouldn't've": "would not have",
      "y'all": "you all",
      "y'all'd": "you all would",
      "y'all'd've": "you all would have",
      "y'all're": "you all are",
      "y'all've": "you all have",
      "you'd": "you would",
      "you'd've": "you would have",
      "you'll": "you will",
      "you'll've": "you will have",
      "you're": "you are",
      "you've": "you have",
    };
    const contractionRegex = new RegExp(
      `\\b(${Object.keys(contractions).join("|")})\\b`,
      "gi"
    );
    return text.replace(contractionRegex, (match) => contractions[match.toLowerCase()]);
  }

  setResults() {
    if (
      this.result &&
      this.result.channels &&
      this.result.channels[0] &&
      this.result.channels[0].alternatives &&
      this.result.channels[0].alternatives[0]
    ) {
      const alt = this.result.channels[0].alternatives[0];

      // Prefer formatted paragraphs from Deepgram if available
      let transcriptText = "";
      const paras = alt?.paragraphs;
      if (paras) {
        if (Array.isArray(paras.paragraphs) && paras.paragraphs.length) {
          transcriptText = paras.paragraphs
            .map((p) => {
              // Prefer sentences text if available, else paragraph text
              if (Array.isArray(p.sentences) && p.sentences.length) {
                return p.sentences.map((s) => s.text).filter(Boolean).join(" ");
              }
              return (p.text || p.transcript || "").trim();
            })
            .filter(Boolean)
            .join("\n\n");
        } else if (typeof paras.transcript === "string") {
          transcriptText = paras.transcript;
        }
      }

      // Fallback to the plain transcript if no paragraph info present
      if (!transcriptText && typeof alt.transcript === "string") {
        transcriptText = alt.transcript;
      }

      // Light readability tweaks
      if (transcriptText) {
        // If dictation wasn’t applied but user said “new line”, render a real break
        // Also strip an optional trailing punctuation (e.g., the spoken "New line.") and spaces
        transcriptText = transcriptText.replace(/\bnew\s*line\b[.!?]?\s*/gi, "\n\n");
        // Add two spaces after periods for Word export readability
        transcriptText = transcriptText.replace(/\.\s/g, ".  ");
        // Cleanup: remove stray leading period+spaces artifacts at start of lines
        transcriptText = transcriptText.replace(/^\.+\s{0,2}/gm, "");
      }

      if (this.modelName === "Deepgram Nova 3 Medical") {
        transcriptText = this.expandContractions(transcriptText);
      }

      if (transcriptText) {
        this.transcript = transcriptText;
        this.requestUpdate();
      }
    }
    if (
      this.result &&
      this.result.channels &&
      this.result.channels[0] &&
      this.result.channels[0].alternatives &&
      this.result.channels[0].alternatives[0].summaries
    ) {
      let summaryText =
        this.result.channels[0].alternatives[0].summaries[0].summary.replace(
          /\. /g,
          ".  "
        );
      if (this.modelName === "Deepgram Nova 3 Medical") {
        summaryText = this.expandContractions(summaryText);
      }
      this.summary = summaryText;
      this.requestUpdate();
    }
    if (
      this.result &&
      this.result.channels &&
      this.result.channels[0] &&
      this.result.channels[0].alternatives &&
      this.result.channels[0].alternatives[0] &&
      this.result.channels[0].alternatives[0].topics
    ) {
      let topicCategories;
      this.result.channels[0].alternatives[0].topics.forEach((topic) => {
        topicCategories = topic.topics;
        topicCategories.forEach((t) => {
          this.topics.push(t.topic);
        });
      });
    }

    if (this.result && this.result.utterances) {
      this.diarize = formatConversation(this.result.utterances);

      const expandContractionsInDiarize = this.expandContractions.bind(this);
      const modelName = this.modelName;

      function formatConversation(response) {
        const utterances = response;
        const conversation = [];

        let currentSpeaker = -1;
        let currentUtterance = "";

        for (const utterance of utterances) {
          if (utterance.speaker !== currentSpeaker) {
            if (currentUtterance !== "") {
              conversation.push(currentUtterance);
            }

            let transcript = utterance.transcript.replace(/\. /g, ".  ");
            if (modelName === "Deepgram Nova 3 Medical") {
              transcript = expandContractionsInDiarize(transcript);
            }
            currentSpeaker = utterance.speaker;
            currentUtterance = `Speaker ${currentSpeaker}: ${transcript}`;
          } else {
            let transcript = utterance.transcript.replace(/\. /g, ".  ");
            if (modelName === "Deepgram Nova 3 Medical") {
              transcript = expandContractionsInDiarize(transcript);
            }
            currentUtterance += ` ${transcript}`;
          }
        }

        if (currentUtterance !== "") {
          conversation.push(currentUtterance);
        }

        return conversation;
      }
    }
  }

  downloadTranscript() {
    const blob = new Blob([this.transcript], {
      type: "application/msword",
    });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `${this.fileName.split(".")[0]}_transcript.doc`;
    a.click();
  }

  displayResults() {
    if (this.transcript.length > 0) {
      return html`
        <button @click=${this.downloadTranscript}>Download Transcript</button>
        <section style="white-space: pre-wrap;">Transcript: ${this.transcript}</section>
        ${
          this.summary
            ? html` <section>Summary: ${this.summary}</section>`
            : null
        }
        ${
          this.topics.length > 0
            ? html` <section>
              Topics:
              ${
                this.topics &&
                this.topics.map((topic) => html`<div>${topic}</div>`)
              }
            </section>`
            : null
        }
        ${
          this.diarize
            ? html`<section>
              ${
                this.diarize &&
                this.diarize.map((speaker) => {
                  return html`<div class="diarize-section">${speaker}</div>`;
                })
              }
            </section>`
            : null
        }
      `;
    } else {
      return null;
    }
  }

  render() {
    return html`<div>${this.displayResults()}</div>`;
  }
}

customElements.define("app-transcript", AppTranscript);
