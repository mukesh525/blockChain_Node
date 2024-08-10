const { User, Notify, getMessage } = require("../../models/user");
const {
  sendPush,
  sendPushMany,
  deleteS3Images,
  getTimeDiffrence,
  getNotificationStatus,
} = require("../../utils/utils");
const { vsprintf } = require("sprintf-js");
const { Contest, Contestant } = require("../../models/contests");

module.exports = (agenda) => {
  agenda.define("contestEnd", async (job, done) => {
    const { contestId } = job.attrs.data;
    let enable = await getNotificationStatus("contestEnd");
    if (!enable) return;

    let contest = await Contest.findOne({ _id: contestId });
    if (contest & contest.status) {
      console.log("contestEnd", contestId);
      let message = vsprintf(getMessage("contestEnd"), [contest.title]);
      let snotify = new Notify({
        type: "contestEnd",
        message: message,
        contestId: contestId,
      });
      await User.updateMany({}, { $addToSet: { notification: snotify } });
      let users = await User.find(
        {},
        { createdAt: 1, device_token: 1, email: 1 }
      );
      //let usersID = users.map((data) => data._id);

      // let activeUsers = users.filter((user) => {
      //   const diffTime = Math.abs(new Date() - user.createdAt);
      //   const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      //   if (diffDays < 14) return user;
      // });

      let tokens = [];
      users.map((user) => {
        if (user.device_token && user.device_token.length > 80) {
          tokens.push(user.device_token);
        }
      });
      console.log("Total tokens=>", tokens.length);
      sendMessageMany(
        tokens,
        message,
        (err, response) => {
          if (response) console.log(response);
          if (err) console.log(err);
        },
        { type: "contestEnd", contestId: contestId }
      );

      // tokens.map((token) => {
      //   sendPush(
      //     token,
      //     message,
      //     1,
      //     (err, response) => {
      //       //            if (response.success > 0) console.log(response);
      //       if (err) console.log(err);
      //     },
      //     { type: "contestEnd", contestId: contestId }
      //   );
      // });

      console.log("contestEnd", snotify);
    }
    done();
  });
};
