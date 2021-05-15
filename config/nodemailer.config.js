const mailer = require("nodemailer");

module.exports = (email, subject, message) => {
  const smtpTransport = mailer.createTransport({
    host: "smtp.sendgrid.net",
    port: 587,
    secure: false, //SSL/TLS
    auth: {
      user: "apikey",
      pass: process.env.SENDGRID_API_KEY,
    },
  });

  const mail = {
    from: "pedro.resch@ironhack.com",
    to: email,
    subject: subject,
    // text: message,
    html: message,
  };

  return new Promise((resolve, reject) => {
    smtpTransport
      .sendMail(mail)
      .then((response) => {
        smtpTransport.close();
        return resolve(response);
      })
      .catch((error) => {
        smtpTransport.close();
        return reject(error);
      });
  });
};
