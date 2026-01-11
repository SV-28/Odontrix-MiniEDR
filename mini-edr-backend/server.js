const express = require("express");
const cors = require("cors");
require("dotenv").config();

const patientsRouter = require("./routes/patients");
const appointmentsRouter = require("./routes/appointments");
const dentistsRouter = require("./routes/dentists");
const encountersRouter = require("./routes/encounters");
const vitalsRouter = require("./routes/vitals");
const toothFindingsRouter = require("./routes/toothfindings");
const pastHistoryRouter = require("./routes/pasthistory");
const radiographsRouter = require("./routes/radiographs");
const diagnosisRouter = require("./routes/diagnosis");
const treatmentRouter = require("./routes/treatment");
const prescriptionsRouter = require("./routes/prescriptions");
const aiPredict = require("./routes/ai_predict");
const searchRouter = require("./routes/search");
const analyticsRouter = require("./routes/analytics");

const app = express();   // 

app.use(cors());
app.use(express.json());

// now register routers
app.use("/api/patients", patientsRouter);
app.use("/api/appointments", appointmentsRouter);
app.use("/api/dentists", dentistsRouter);
app.use("/api/encounters", encountersRouter);
app.use("/api/vitals", vitalsRouter);
app.use("/api/toothfindings", toothFindingsRouter);
app.use("/api/pasthistory", pastHistoryRouter);
app.use("/api/radiographs", radiographsRouter);
app.use("/api/diagnosis", diagnosisRouter);
app.use("/api/treatment", treatmentRouter);
app.use("/api/prescriptions", prescriptionsRouter);
app.use("/api/search", searchRouter);
app.use("/api/predict", aiPredict);
app.use("/analytics", require("./routes/analytics"));

app.get("/health", (req, res) => res.send("Backend running"));

const PORT = process.env.PORT || 5050;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
