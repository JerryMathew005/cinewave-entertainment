package com.cinewave.service;

import com.cinewave.entity.ContactMessage;
import jakarta.mail.internet.MimeMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);

    private final ObjectProvider<JavaMailSender> mailSenderProvider;

    @Value("${spring.mail.username:}")
    private String mailUsername;

    @Value("${cinewave.mail.from:noreply@cinewave.com}")
    private String mailFrom;

    @Value("${cinewave.admin.email:jerrymathew987@gmail.com}")
    private String adminEmail;

    public EmailService(ObjectProvider<JavaMailSender> mailSenderProvider) {
        this.mailSenderProvider = mailSenderProvider;
    }

    public boolean isConfigured() {
        return mailUsername != null && !mailUsername.trim().isEmpty() && mailSenderProvider.getIfAvailable() != null;
    }

    public void sendPasswordResetOtp(String toEmail, String otp) {
        if (!isConfigured()) {
            logger.info("SMTP email service is not active. Reset OTP generated for: {}", maskEmail(toEmail));
            return;
        }

        try {
            JavaMailSender mailSender = mailSenderProvider.getIfAvailable();
            if (mailSender == null) return;

            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(mailFrom);
            helper.setTo(toEmail);
            helper.setSubject("CineWave Entertainment — Your Password Reset Code");

            String html = """
                <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 540px; margin: 0 auto; padding: 24px; background-color: #0A192F; color: #FFFFFF; border-radius: 12px;">
                    <div style="text-align: center; margin-bottom: 24px;">
                        <h1 style="color: #38BDF8; font-size: 24px; margin: 0;">CineWave Entertainment</h1>
                        <p style="color: #94A3B8; font-size: 14px; margin-top: 4px;">Movie Ticket Booking Management System</p>
                    </div>
                    <div style="background-color: #0F2744; border-radius: 10px; padding: 24px; border: 1px solid rgba(56, 189, 248, 0.2);">
                        <h2 style="color: #FFFFFF; font-size: 18px; margin-top: 0;">Password Reset Request</h2>
                        <p style="color: #CBD5E1; font-size: 14px; line-height: 1.6;">
                            We received a request to reset the password for your CineWave account. Use the one-time verification code below to complete your reset:
                        </p>
                        <div style="text-align: center; margin: 28px 0;">
                            <div style="display: inline-block; background: linear-gradient(135deg, #0284C7 0%, #0369A1 100%); color: #FFFFFF; font-size: 32px; font-weight: 800; letter-spacing: 8px; padding: 14px 28px; border-radius: 8px; box-shadow: 0 0 15px rgba(56, 189, 248, 0.4);">
                                %s
                            </div>
                        </div>
                        <p style="color: #F59E0B; font-size: 13px; margin: 0;">
                            ⏱ This code expires in <strong>10 minutes</strong> and can only be used once.
                        </p>
                        <p style="color: #94A3B8; font-size: 12px; margin-top: 16px; border-top: 1px solid rgba(255, 255, 255, 0.1); padding-top: 12px;">
                            If you did not request this password reset, you can safely ignore this message. Your password will remain unchanged.
                        </p>
                    </div>
                    <div style="text-align: center; margin-top: 20px; color: #64748B; font-size: 12px;">
                        &copy; CineWave Entertainment. All rights reserved.
                    </div>
                </div>
            """.formatted(otp);

            helper.setText(html, true);
            mailSender.send(message);
            logger.info("Password reset OTP email sent successfully to: {}", maskEmail(toEmail));
        } catch (Exception e) {
            logger.error("Failed to send password reset email to {}: {}", maskEmail(toEmail), e.getMessage());
        }
    }

    public void sendContactNotification(ContactMessage contactMessage) {
        if (!isConfigured()) {
            logger.info("SMTP email service not configured. Contact inquiry from {} saved in database.", maskEmail(contactMessage.getEmail()));
            return;
        }

        try {
            JavaMailSender mailSender = mailSenderProvider.getIfAvailable();
            if (mailSender == null) return;

            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(mailFrom);
            helper.setTo(adminEmail);
            helper.setReplyTo(contactMessage.getEmail());
            helper.setSubject("[CineWave Inquiry] " + contactMessage.getSubject());

            String html = """
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 8px;">
                    <h2 style="color: #0A192F; border-bottom: 2px solid #0284C7; padding-bottom: 8px;">New CineWave Contact Inquiry</h2>
                    <p><strong>From:</strong> %s &lt;%s&gt;</p>
                    <p><strong>Subject:</strong> %s</p>
                    <p><strong>Message:</strong></p>
                    <div style="background-color: #FFFFFF; padding: 16px; border: 1px solid #CBD5E1; border-radius: 6px; white-space: pre-wrap;">%s</div>
                    <p style="color: #64748B; font-size: 12px; margin-top: 16px;">This message was submitted via the CineWave Entertainment Contact Us form and stored in the database.</p>
                </div>
            """.formatted(
                    escapeHtml(contactMessage.getName()),
                    escapeHtml(contactMessage.getEmail()),
                    escapeHtml(contactMessage.getSubject()),
                    escapeHtml(contactMessage.getMessage())
            );

            helper.setText(html, true);
            mailSender.send(message);
            logger.info("Admin contact notification dispatched to: {}", maskEmail(adminEmail));
        } catch (Exception e) {
            logger.error("Failed to dispatch contact email notification: {}", e.getMessage());
        }
    }

    private String maskEmail(String email) {
        if (email == null || !email.contains("@")) return "***";
        int atIdx = email.indexOf("@");
        if (atIdx <= 2) return email.charAt(0) + "***" + email.substring(atIdx);
        return email.substring(0, 2) + "***" + email.substring(atIdx);
    }

    private String escapeHtml(String input) {
        if (input == null) return "";
        return input.replace("&", "&amp;")
                .replace("<", "&lt;")
                .replace(">", "&gt;")
                .replace("\"", "&quot;")
                .replace("'", "&#39;");
    }
}
