"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = sendEmail;
const nodemailer_1 = __importDefault(require("nodemailer"));
const transporter = nodemailer_1.default.createTransport({
    service: 'gmail',
    auth: {
        user: 'sr.duran10@gmail.com',
        pass: 'WDT921018' // generada desde tu cuenta Google
    }
});
function sendEmail(subject, body) {
    const mailOptions = {
        from: 'BotMyWallet <tuCorreo@gmail.com>',
        to: 'tuCorreo@gmail.com',
        subject,
        text: body
    };
    transporter.sendMail(mailOptions, (err, info) => {
        if (err)
            console.error('⛔ Error Gmail:', err);
        else
            console.log('📤 Email enviado:', info.response);
    });
}
