const Agenda = require("agenda");
const config = require("../config");
const connectionOpts = {
  db: {
    address: config.DB_URI,
    collection: "Jobs",
    options: { useNewUrlParser: true },
  },
};
const agenda = new Agenda(connectionOpts);
const jobTypes = process.env.JOB_TYPES ? process.env.JOB_TYPES.split(",") : [];

(async () => {
  console.log("sheduler started");
  console.log(jobTypes);
  if (jobTypes.length) {
    await agenda.start();
    await agenda.every("1 minutes", "checkTransaction");
  }
})();

agenda.define("checkTransaction", function (job, done) {
  console.log("checkTransaction Called...");

  func(job, done);
});
agenda.define("Power", function (job, done) {
  console.log("Agenda Power Called...");
  job.alert = alert;
  func(job, done);
});
agenda.on("ready", async () => {
  //agenda.start();
  await agenda.start();
  console.log("Starting agenda scheduler...");
});

module.exports = agenda;
