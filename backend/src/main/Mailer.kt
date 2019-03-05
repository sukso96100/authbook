package xyz.youngbin.authbook

import java.util.Properties;
import javax.mail.Message;
import javax.mail.Session;
import javax.mail.Transport;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;
// https://eclipse-ee4j.github.io/javamail/docs/api/

object Mailer{
    lateinit var mailProps: Properties
    lateinit var sender: InternetAddress
    lateinit var smtpUsername: String
    lateinit var smtpPassword: String
    lateinit var host: String
    
    fun initMailer(host: String, port: Int, 
            smtpUsername: String, smtpPassword: String,
            senderAddr: String, senderName: String){
        
        Mailer.mailProps = System.getProperties()
    	Mailer.mailProps.put("mail.transport.protocol", "smtp")
    	Mailer.mailProps.put("mail.smtp.port", port) 
    	Mailer.mailProps.put("mail.smtp.starttls.enable", "true")
    	Mailer.mailProps.put("mail.smtp.auth", "true")
        
        Mailer.sender = InternetAddress(senderAddr, senderName)
        Mailer.smtpUsername = smtpUsername
        Mailer.smtpPassword = smtpPassword
        Mailer.host = host
    }
    
    fun sendMail(receiverAddr: String, receiverName: String, subject: String, body: String): Boolean{
        var isMailSent = false
        // Create a Session object to represent a mail session with the specified properties. 
    	val session = Session.getDefaultInstance(Mailer.mailProps)

        // Create a message with the specified information. 
        val msg = MimeMessage(session)
        msg.setFrom(Mailer.sender)
        msg.setRecipient(Message.RecipientType.TO, InternetAddress(receiverAddr, receiverName))
        msg.setSubject(subject)
        msg.setContent(body,"text/html")
        
        // Add a configuration set header. Comment or delete the 
        // next line if you are not using a configuration set
        // msg.setHeader("X-SES-CONFIGURATION-SET", CONFIGSET)
            
        // Create a transport.
        val transport = session.getTransport()
                    
        // Send the message.
        try{
            println("Sending...")
            
            // Connect to Amazon SES using the SMTP username and password you specified above.
            transport.connect(Mailer.host, Mailer.smtpUsername, Mailer.smtpPassword)
        	
            // Send the email.
            transport.sendMessage(msg, msg.getAllRecipients())
            println("Email sent!")
            isMailSent = true
        }catch (ex: Exception) {
            println("The email was not sent.")
            println("Error message: " + ex.message)
            isMailSent = false
        }finally{
            // Close and terminate the connection.
            transport.close()
        }

        return isMailSent
    }

    fun sendVerification(user: User, type: VerificationTypes, code: String, requestedAt: String): Boolean{
        lateinit var subjectTemplate: String
        lateinit var bodyTemplate: String

        when(type){
            VerificationTypes.Email -> {
                subjectTemplate = "Your authbook email verification code"
                bodyTemplate = """
                Hello, ${user.displayName}.

                You have signed up or changed email address at ${requestedAt}.
                To finish the process, Please use the following verification code.

                ${code}

                If you didn't sign up or change email,
                Please just ignore this mail.

                Thank you.
                """
            }
            VerificationTypes.Password -> {
                subjectTemplate = "Your authbook verification code for password recovery"
                bodyTemplate = """
                Hello, ${user.displayName}.

                You have to recover your password ${requestedAt}.
                To finish the process, Please use the following verification code.

                ${code}

                If you didn't request password recovery,
                Please just ignore this mail.

                Thank you.
                """
            }
        }

        return Mailer.sendMail(user.email, user.displayName, subjectTemplate, bodyTemplate)
    }
}