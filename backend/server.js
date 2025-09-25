// server.js
const express = require("express");
const cors = require("cors");
const multer = require("multer");

const { uploadBuffer, compressIfNeeded } = require("./storage");
const { runDiagnostics } = require("./diagnostics");
const { notifyAdmin } = require("./mailer");

const app = express();

// ----- Env -----
const PORT = parseInt(process.env.PORT, 10) || 8080; // <-- Cloud Run injects PORT
const HOST = "0.0.0.0";                               // <-- must bind to all interfaces
const APP_ENV = process.env.APP_ENV || "production";
const BUCKET = process.env.BUCKET;

// ----- Middleware -----
app.set("trust proxy", true); // Cloud Run sits behind a proxy
app.use(cors({ origin: "*" })); // TODO: restrict origins in prod
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// ----- Health endpoints -----
app.get("/health", (req, res) =>
  res.json({ ok: true, env: APP_ENV, bucket: BUCKET || null })
);
// optional readiness probe
app.get("/readyz", (req, res) => res.status(200).send("ready"));

// ----- Multer: in-memory storage -----
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 8 * 1024 * 1024 }, // 8MB/file cap before compression
});

// ----- Routes -----

// Create unit + upload 3 photos
app.post(
  "/units",
  upload.fields([
    { name: "photo_imei", maxCount: 1 },
    { name: "photo_odo", maxCount: 1 },
    { name: "photo_rego", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const { imei, phone, rego, odo, jobId, installerId, notes } = req.body || {};
      if (!imei || !phone || !rego || !odo) {
        return res
          .status(400)
          .json({ ok: false, error: "Missing form fields (imei, phone, rego, odo required)" });
      }

      const files = req.files || {};
      const imeiPhoto = files.photo_imei?.[0];
      const odoPhoto = files.photo_odo?.[0];
      const regoPhoto = files.photo_rego?.[0];
      if (!imeiPhoto || !odoPhoto || !regoPhoto) {
        return res
          .status(400)
          .json({ ok: false, error: "All three photos are required: IMEI, ODO, REGO/VIN" });
      }

      const unitId = `unit_${Date.now()}`;

      // Compress & upload photos
      const [c1, c2, c3] = await Promise.all([
        compressIfNeeded(imeiPhoto.buffer, imeiPhoto.mimetype),
        compressIfNeeded(odoPhoto.buffer, odoPhoto.mimetype),
        compressIfNeeded(regoPhoto.buffer, regoPhoto.mimetype),
      ]);

      const [u1, u2, u3] = await Promise.all([
        uploadBuffer(c1.buffer, `units/${unitId}/photos/imei.jpg`, c1.contentType),
        uploadBuffer(c2.buffer, `units/${unitId}/photos/odo.jpg`, c2.contentType),
        uploadBuffer(c3.buffer, `units/${unitId}/photos/rego.jpg`, c3.contentType),
      ]);

      // TODO: persist to DB (skipped). Echo back the unit object for now.
      const unit = {
        unitId,
        imei,
        phone,
        rego,
        odo,
        jobId: jobId || null,
        installerId: installerId || null,
        notes: notes || "",
        photos: { imei: u1.gcsPath, odo: u2.gcsPath, rego: u3.gcsPath },
      };

      return res.json({ ok: true, unit });
    } catch (err) {
      console.error("POST /units error:", err);
      res.status(500).json({ ok: false, error: "Server error" });
    }
  }
);

// Run diagnostics after creation
app.post("/diagnostics/run", async (req, res) => {
  try {
    const { imei, phone } = req.body || {};
    if (!imei || !phone)
      return res.status(400).json({ ok: false, error: "imei and phone required" });

    const result = await runDiagnostics(imei, phone);
    res.json(result);
  } catch (err) {
    console.error("POST /diagnostics/run error:", err);
    res.status(500).json({ ok: false, passed: false, reasons: ["Server error"] });
  }
});

// Save a test log (and notify admin if failed)
app.post("/units/:unitId/test-log", async (req, res) => {
  try {
    const { unitId } = req.params;
    const { passed, reasons, notes } = req.body || {};
    if (typeof passed !== "boolean")
      return res.status(400).json({ ok: false, error: "passed boolean required" });

    // TODO: persist log (skipped)
    if (!passed) {
      const msg = `Unit ${unitId} failed diagnostics.\nReasons: ${
        (reasons || []).join(", ") || "N/A"
      }\nNotes: ${notes || ""}`;
      await notifyAdmin(`Diagnostics failed for ${unitId}`, msg);
    }

    res.json({ ok: true, unitId, passed, reasons: reasons || [], notes: notes || "" });
  } catch (err) {
    console.error("POST /units/:unitId/test-log error:", err);
    res.status(500).json({ ok: false, error: "Server error" });
  }
});

// ----- 404 + error handlers -----
app.use((req, res) => {
  res.status(404).json({ ok: false, error: "Not Found", path: req.originalUrl });
});

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, _next) => {
  console.error("[error]", err);
  res.status(err.status || 500).json({ ok: false, error: err.message || "Server error" });
});

// ----- Start server (Cloud Run requires this shape) -----
app.listen(PORT, HOST, () => {
  console.log(`installer-api listening on http://${HOST}:${PORT} (env=${APP_ENV}, bucket=${BUCKET || "none"})`);
});
