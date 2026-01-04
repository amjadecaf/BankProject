package ma.formations.multiconnector.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    public void sendNewClientCredentials(String toEmail, String firstname, String lastname, 
                                        String username, String password) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(toEmail);
            message.setSubject("Bienvenue à CAF Amjade & BATTAL Mohammed Othmane Bank");
            
            String emailBody = String.format(
                "Bonjour %s %s,\n\n" +
                "Bienvenue à CAF Amjade & BATTAL Mohammed Othmane Bank!\n\n" +
                "Votre compte client a été créé avec succès. Voici vos identifiants de connexion:\n\n" +
                "Nom d'utilisateur: %s\n" +
                "Mot de passe: %s\n\n" +
                "Pour des raisons de sécurité, nous vous recommandons de changer votre mot de passe lors de votre première connexion.\n\n" +
                "Cordialement,\n" +
                "L'équipe CAF Amjade & BATTAL Mohammed Othmane Bank",
                firstname, lastname, username, password
            );
            
            message.setText(emailBody);
            mailSender.send(message);
        } catch (Exception e) {
            throw new RuntimeException("Erreur lors de l'envoi de l'email: " + e.getMessage());
        }
    }
}
