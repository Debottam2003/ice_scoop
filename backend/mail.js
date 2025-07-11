import nodemailer from "nodemailer";

// Configure nodemailer transport
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'debsoumya60812@gmail.com',
        pass: 'tags yrqq pbxv qtrw',
    }
});

export default transporter;
