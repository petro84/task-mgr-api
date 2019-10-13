const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'larrypetroski@gmail.com',
        subject: 'Welcome!',
        text: `Welcom to the app, ${name}. Any questions feel free to send me an email.`
    })
}

const sendCancelation = (email, name) => {
    sgMail.send({
        to: email,
        from: 'larrypetroski@gmail.com',
        subject: 'Peace Out!',
        text: `Sorry to see you go, ${name}. No one is perfect!`
    })
}

module.exports = {
    sendWelcomeEmail,
    sendCancelation
}