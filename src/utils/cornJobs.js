const cron = require("node-cron");
const { subDays, startOfDay, endOfDay } = require("date-fns");
const ConnectionRequestModel = require("../models/connectionRequest");
const sendEmail = require("./sendEmail");

cron.schedule("0 8 * * *", async () => {
  try {
    const yesterday = subDays(new Date(), 0);
    const yesterdayStart = startOfDay(yesterday);
    const yesterdayEnd = endOfDay(yesterday);

    const pendingRequests = await ConnectionRequestModel.find({
      status: "interested",
      createdAt: {
        $gte: yesterdayStart,
        $lt: yesterdayEnd
      }
    })
      .populate("fromUserId")
      .populate("toUserId");

    const listOfEmails = [
      ...new Set(pendingRequests.map(req => req.toUserId.emailId))
    ];

    console.log(listOfEmails);

    for (const email of listOfEmails) {
      try {
         const cleanEmail = email.trim().toLowerCase();
        const res = await sendEmail.run(
      cleanEmail,                              // ✅ ONLY email here
      "New Friend Requests Pending",           // ✅ subject
      "You have new friend requests waiting. Please login to DevTinder." // ✅ body
    );
        console.log(res);
      } catch (err) {
        console.error("Email error:", err);
      }
    }

  } catch (err) {
    console.error("Cron job error:", err);
  }
});
