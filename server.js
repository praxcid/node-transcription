const config = require("./config.json");
const express = require("express");
const fetch = require("node-fetch");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const DOCTORS_FILE = path.join(__dirname, "doctors.json");

function loadDoctors() {
  try {
    return JSON.parse(fs.readFileSync(DOCTORS_FILE, "utf8"));
  } catch {
    return [];
  }
}

function saveDoctors(doctors) {
  fs.writeFileSync(DOCTORS_FILE, JSON.stringify(doctors, null, 2));
}

const port = process.env.API_PORT || 8080;
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const app = express();

app.use(express.static(path.join(__dirname, "static")));
app.use(express.json());

app.get("/api/doctors", (req, res) => {
  res.json(loadDoctors());
});

app.put("/api/doctors", (req, res) => {
  const doctors = req.body;
  if (!Array.isArray(doctors)) return res.status(400).json({ err: "Expected an array" });
  saveDoctors(doctors);
  res.json({ ok: true });
});

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

    const keytermList = keyterms ? JSON.parse(keyterms) : [];

    // Build query params manually so keyterm is repeated per term (?keyterm=a&keyterm=b)
    const params = new URLSearchParams();
    params.set('model', model);
    if (version) params.set('version', version);
    for (const [k, v] of Object.entries(dgOptions)) {
      if (v !== undefined && v !== null) params.set(k, String(v));
    }
    params.set('paragraphs', 'true');
    keytermList.forEach((term) => params.append('keyterm', term));

    const dgApiUrl = `https://api.deepgram.com/v1/listen?${params}`;
    const dgHeaders = { Authorization: `Token ${config.dgKey}` };

    const dgFetchOpts = dgRequest.url
      ? { method: 'POST', headers: { ...dgHeaders, 'Content-Type': 'application/json' }, body: JSON.stringify({ url: dgRequest.url }) }
      : { method: 'POST', headers: { ...dgHeaders, 'Content-Type': dgRequest.mimetype }, body: dgRequest.buffer };

    console.log('Deepgram request URL:', dgApiUrl);
    const dgRes = await fetch(dgApiUrl, dgFetchOpts);
    if (!dgRes.ok) {
      const errBody = await dgRes.text();
      throw new Error(`Deepgram ${dgRes.status}: ${errBody}`);
    }
    const transcription = await dgRes.json();

    const dgRequestLog = dgRequest.url ? { url: dgRequest.url } : { mimetype: dgRequest.mimetype };
    res.send({ model, version, dgRequest: dgRequestLog, dgFeatures, transcription });
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
