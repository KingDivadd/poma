const nodemailer = require('nodemailer');
const sendEmail = (subject, note, email) => {

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.USERNAME,
            pass: process.env.PASSWORD
        }
    });

    const htmlContent = `
    <html> 
        <body>
            <h4> Hi ${note.user_name} </h4>
            <h3> ${note.info}  </h3>
        </body>
    </html>
    `
    const mailOptions = {
        from: {
            name: "poma",
            address: 'iroegbu.dg@gmail.com'
        },
        to: `${email}`,
        subject: `${subject}`,
        html: htmlContent,
        text: `${note}`
    };

    transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log(`Email sent to ${email} with res code ${info.response}`.cyan.bold);
        }
    });

}
module.exports = sendEmail