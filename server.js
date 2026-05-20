const { Deepgram } = require("@deepgram/sdk");
const config = require("./config.json");
const express = require("express");
const fetch = require("node-fetch");
const multer = require("multer");
const path = require("path");

const port = process.env.API_PORT || 8080;
const deepgram = new Deepgram(config.dgKey);
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const app = express();

app.use(express.static(path.join(__dirname, "static")));

app.get("/api/models", async (req, res) => {
  try {
    const response = await fetch("https://api.deepgram.com/v1/models", {
      headers: { Authorization: `Token ${config.dgKey}` },
    });
    if (!response.ok) throw new Error(`Deepgram responded with ${response.status}`);
    const data = await response.json();
    res.send(data);
  } catch (err) {
    res.status(500).send({ err: err.message });
  }
});

app.post("/api", upload.single("file"), async (req, res) => {
  const { body, file } = req;
  const { url, features, model, version, keyterms } = body;
  const dgFeatures = JSON.parse(features);

  // Normalize feature flags to avoid conflicting or missing dependent options.
  // Make a shallow copy so we can adjust without mutating the parsed object used elsewhere.
  const dgOptions = { ...dgFeatures };

  // If paragraphs is requested, ensure punctuate is also set (Deepgram expects punctuation for paragraphs).
  if (dgOptions.paragraphs && !Object.prototype.hasOwnProperty.call(dgOptions, 'punctuate')) {
    dgOptions.punctuate = true;
  }

  // If smart_format is explicitly enabled, remove specific formatting flags to let the service handle them.
  if (dgOptions.smart_format) {
    delete dgOptions.punctuate;
    delete dgOptions.paragraphs;
    delete dgOptions.numerals;
  }

  let dgRequest = null;

  try {
    // validate the URL for a URL request
    if (url) {
      dgRequest = { url };
    }

    // get file buffer for a file request
    if (file) {
      const { mimetype, buffer } = file;
      dgRequest = { buffer, mimetype };
    }

    if (!dgRequest) {
      throw Error(
        "Error: You need to choose a file to transcribe your own audio."
      );
    }

    // send request to deepgram
    // Log the features and model being sent for debugging
    // Build request options. Some Deepgram API versions expect formatting flags nested
    // under a `formatting` object. Include both to maximize compatibility.
    const keytermList = keyterms ? JSON.parse(keyterms) : [];
    const requestOptions = {
      ...dgOptions,
      ...(Object.keys(dgOptions).length ? { formatting: dgOptions } : {}),
      paragraphs: true,
      model,
      ...(version ? { version } : {}),
      ...(keytermList.length ? { keyterm: keytermList } : {}),
    };

    console.log('Deepgram request options:', requestOptions);
    const transcription = await deepgram.transcription.preRecorded(dgRequest, requestOptions);

    // return results
    res.send({ model, version, dgRequest, dgFeatures, transcription });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err, dgRequest, {
      ...dgFeatures,
      version,
      model,
    });

    // handle error
    res.status(500).send({ err: err.message ? err.message : err });
  }
});

app.listen(port, "0.0.0.0", () =>
  console.log(`Starter app running at http://localhost:${port}`)
);
