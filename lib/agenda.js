const Agenda = require("agenda");
const config = require("../config");

const connectionOpts = {
  db: {
    address: config.DB_URI,
    collection: "jobs",
    options: { useNewUrlParser: true, useUnifiedTopology: true },
  },
};

const agenda = new Agenda(connectionOpts);

const jobTypes = process.env.JOB_TYPES
  ? process.env.JOB_TYPES.split(",")
  : ["checkTransaction"];

agenda.define("checkTransaction", async (job, done) => {
  console.log("checkTransaction Called...");
  // Add your job logic here
  done();
});

(async () => {
  console.log("Scheduler started");
  console.log("Job types:", jobTypes);

  if (jobTypes.length) {
    await agenda.start();

    // Schedule jobs with valid intervals
    for (const jobType of jobTypes) {
      await agenda.every("1 minute", jobType); // Ensure the interval is valid
      console.log(`Scheduled '${jobType}' job to run 1 minute`);
    }
  }

  // Set how often Agenda checks for jobs to process
  agenda.processEvery("1 minute"); // Check for jobs every minute
})();

// Error handling
agenda.on("error", (err) => {
  console.error("Agenda error:", err);
});

module.exports = agenda;
