const { SendEmailCommand } = require("@aws-sdk/client-ses");
const { sesClient } = require("./sesClient.js");

const createSendEmailCommand = (toAddress, fromAddress, subject, body) => {
  return new SendEmailCommand({
    Destination: {
      ToAddresses: [toAddress],
    },
    Message: {
      Body: {
        Html: {
          Charset: "UTF-8",
          Data: `<h3>${body}</h3>`,
        },
        Text: {
          Charset: "UTF-8",
          Data: body,
        },
      },
      Subject: {
        Charset: "UTF-8",
        Data: subject,
      },
    },
    Source: fromAddress,
  });
};

const run = async (toEmailId, subject, body) => {
  const sendEmailCommand = createSendEmailCommand(
    toEmailId.trim(),                     // ✅ TO email
    "bharatmanithota@gmail.com",         // ✅ FROM email (must be verified)
    subject || "No Subject",       // safety
    body || "No content"           // safety
  );

  try {
    return await sesClient.send(sendEmailCommand);
  } catch (error) {
    console.error("Email error:", error);
    throw error;
  }
};

module.exports = { run };
