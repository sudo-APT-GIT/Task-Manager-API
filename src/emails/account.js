const sgMail = require('@sendgrid/mail')


sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'paishreya1412@gmail.com',
        subject: 'Welcome to Tasks App',
        text: `Welcome to the app, ${name}.Let me know how you get along with the app.`
    })
}

const sendCancellationEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'paishreya1412@gmail.com',
        subject: 'Goodbye!',
        text: `Goodbye, ${name}. We hope to see you again!`
    })
}

module.exports = {
    sendWelcomeEmail,
    sendCancellationEmail
}