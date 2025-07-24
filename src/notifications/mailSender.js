import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'sr.duran10@gmail.com',
    pass: 'WDT921018'  // generada desde tu cuenta Google
  }
});

export function sendEmail(subject, body) {
  const mailOptions = {
    from: 'BotMyWallet <tuCorreo@gmail.com>',
    to: 'tuCorreo@gmail.com',
    subject,
    text: body
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) console.error('⛔ Error Gmail:', err);
    else console.log('📤 Email enviado:', info.response);
  });
}
