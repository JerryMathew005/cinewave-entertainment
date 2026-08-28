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

    @Value("${spring.mail.host:smtp.gmail.com}")
    private String mailHost;

    @Value("${spring.mail.username:}")
    private String mailUsername;

    @Value("${cinewave.mail.from:noreply@cinewave.com}")
    private String mailFrom;

    @Value("${cinewave.admin.email:jerrymathew987@gmail.com}")
    private String adminEmail;

    @Value("${cinewave.frontend.url:http://localhost:5173}")
    private String frontendUrl;

    public EmailService(ObjectProvider<JavaMailSender> mailSenderProvider) {
        this.mailSenderProvider = mailSenderProvider;
    }

    public boolean isConfigured() {
        JavaMailSender sender = mailSenderProvider.getIfAvailable();
        if (sender == null) return false;
        boolean hasUser = mailUsername != null && !mailUsername.trim().isEmpty();
        boolean isLocalHost = mailHost != null && (mailHost.equalsIgnoreCase("localhost") || mailHost.equals("127.0.0.1"));
        return hasUser || isLocalHost;
    }

    public String buildResetLink(String toEmail, String token) {
        String baseUrl = (frontendUrl != null && !frontendUrl.trim().isEmpty())
                ? frontendUrl.split(",")[0].trim()
                : "http://localhost:5173";
        String encodedEmail = java.net.URLEncoder.encode(toEmail, java.nio.charset.StandardCharsets.UTF_8);
        String encodedToken = java.net.URLEncoder.encode(token, java.nio.charset.StandardCharsets.UTF_8);
        return baseUrl + "/reset-password?token=" + encodedToken + "&email=" + encodedEmail;
    }

    public void sendPasswordResetEmail(String toEmail, String token) {
        String resetLink = buildResetLink(toEmail, token);

        if (!isConfigured()) {
            logger.warn("SMTP email service is not configured (host={}, user={}). Reset email skipped for {}. Link = {}",
                    mailHost, (mailUsername != null && !mailUsername.isEmpty()) ? maskEmail(mailUsername) : "NONE", maskEmail(toEmail), resetLink);
            return;
        }

        try {
            JavaMailSender mailSender = mailSenderProvider.getIfAvailable();
            if (mailSender == null) {
                logger.error("JavaMailSender bean is not available in application context.");
                return;
            }

            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(mailFrom);
            helper.setTo(toEmail);
            helper.setSubject("CineWave Entertainment — Reset Your Password");

            String html = """
                <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 560px; margin: 0 auto; padding: 28px; background-color: #0A192F; color: #FFFFFF; border-radius: 14px; border: 1px solid rgba(56, 189, 248, 0.25);">
                    <div style="text-align: center; margin-bottom: 24px;">
                        <h1 style="color: #38BDF8; font-size: 24px; margin: 0; letter-spacing: -0.5px;">CineWave Entertainment</h1>
                        <p style="color: #94A3B8; font-size: 13px; margin-top: 4px; letter-spacing: 0.5px; text-transform: uppercase;">Official Account Security Notification</p>
                    </div>
                    <div style="background-color: #0F2744; border-radius: 10px; padding: 26px; border: 1px solid rgba(56, 189, 248, 0.2);">
                        <h2 style="color: #FFFFFF; font-size: 19px; margin-top: 0; font-weight: 700;">Password Reset Request</h2>
                        <p style="color: #CBD5E1; font-size: 14px; line-height: 1.6;">
                            We received a request to reset the password for your CineWave Entertainment account.
                        </p>
                        <p style="color: #CBD5E1; font-size: 14px; line-height: 1.6;">
                            Click the button below to open the secure Reset Password page and choose your new credentials:
                        </p>
                        <div style="text-align: center; margin: 28px 0 24px;">
                            <a href="{{RESET_LINK}}" target="_blank" style="display: inline-block; background: linear-gradient(135deg, #0284C7 0%, #0369A1 100%); color: #FFFFFF; text-decoration: none; font-size: 15px; font-weight: 700; padding: 14px 32px; border-radius: 8px; box-shadow: 0 4px 14px rgba(2, 132, 199, 0.45); letter-spacing: 0.2px;">
                                Reset Password &rarr;
                            </a>
                        </div>
                        <div style="background-color: rgba(15, 23, 42, 0.6); padding: 12px 16px; border-radius: 6px; border: 1px solid rgba(56, 189, 248, 0.15); margin-bottom: 20px;">
                            <p style="color: #94A3B8; font-size: 12px; margin: 0 0 4px 0;">If the button above does not work, copy and paste this link into your browser:</p>
                            <a href="{{RESET_LINK}}" style="color: #38BDF8; font-size: 12px; word-break: break-all; text-decoration: underline;">{{RESET_LINK}}</a>
                        </div>
                        <p style="color: #F59E0B; font-size: 13px; margin: 0;">
                            &#9201; <strong>Security Notice:</strong> This single-use reset link expires in <strong>15 minutes</strong>.
                        </p>
                        <p style="color: #94A3B8; font-size: 12px; margin-top: 18px; border-top: 1px solid rgba(255, 255, 255, 0.1); padding-top: 14px; line-height: 1.5;">
                            If you did not request a password reset, you can safely ignore this email. Your password will remain unchanged.
                        </p>
                    </div>
                    <div style="text-align: center; margin-top: 22px; color: #64748B; font-size: 12px;">
                        &copy; 2026 CineWave Entertainment. All rights reserved.
                    </div>
                </div>
            """.replace("{{RESET_LINK}}", resetLink);

            helper.setText(html, true);
            mailSender.send(message);
            logger.info("Real password reset email dispatched successfully via SMTP to: {}", maskEmail(toEmail));
        } catch (Exception e) {
            logger.error("Failed to send password reset email to {}: {}", maskEmail(toEmail), e.getMessage());
            throw new RuntimeException("Failed to dispatch password reset email via SMTP: " + e.getMessage(), e);
        }
    }

    public void sendPasswordResetOtp(String toEmail, String otp) {
        sendPasswordResetOtp(toEmail, otp, otp);
    }

    public void sendPasswordResetOtp(String toEmail, String otp, String token) {
        String tokenToUse = (token != null && !token.trim().isEmpty()) ? token.trim() : otp;
        String resetLink = buildResetLink(toEmail, tokenToUse);

        if (!isConfigured()) {
            logger.info("[CINEWAVE EMAIL SERVICE - LOCAL TEST MODE] SMTP is not active. Password reset for {}: OTP = [{}] | Direct Link = {}", maskEmail(toEmail), otp, resetLink);
            return;
        }

        try {
            JavaMailSender mailSender = mailSenderProvider.getIfAvailable();
            if (mailSender == null) {
                logger.warn("JavaMailSender bean is not available. [LOCAL TEST FALLBACK] OTP for {}: [{}]", maskEmail(toEmail), otp);
                return;
            }

            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(mailFrom);
            helper.setTo(toEmail);
            helper.setSubject("CineWave Entertainment — Reset Your Account Password");

            String html = """
                <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 540px; margin: 0 auto; padding: 24px; background-color: #0A192F; color: #FFFFFF; border-radius: 12px;">
                    <div style="text-align: center; margin-bottom: 24px;">
                        <h1 style="color: #38BDF8; font-size: 24px; margin: 0;">CineWave Entertainment</h1>
                        <p style="color: #94A3B8; font-size: 14px; margin-top: 4px;">Movie Ticket Booking Management System</p>
                    </div>
                    <div style="background-color: #0F2744; border-radius: 10px; padding: 24px; border: 1px solid rgba(56, 189, 248, 0.2);">
                        <h2 style="color: #FFFFFF; font-size: 18px; margin-top: 0;">Password Reset Request</h2>
                        <p style="color: #CBD5E1; font-size: 14px; line-height: 1.6;">
                            We received a request to reset the password for your CineWave account. You can click the button below to open the secure Reset Password page immediately:
                        </p>
                        <div style="text-align: center; margin: 24px 0 16px;">
                            <a href="%s" style="display: inline-block; background: linear-gradient(135deg, #0284C7 0%, #0369A1 100%); color: #FFFFFF; text-decoration: none; font-size: 15px; font-weight: 700; padding: 14px 28px; border-radius: 8px; box-shadow: 0 0 15px rgba(56, 189, 248, 0.4);">
                                Reset Password Directly &rarr;
                            </a>
                        </div>
                        <p style="color: #94A3B8; font-size: 13px; text-align: center; margin-bottom: 20px;">
                            Or enter this one-time 6-digit verification code on the reset page:
                        </p>
                        <div style="text-align: center; margin-bottom: 24px;">
                            <div style="display: inline-block; background-color: rgba(2, 132, 199, 0.15); border: 1px solid rgba(56, 189, 248, 0.3); color: #38BDF8; font-size: 28px; font-weight: 800; letter-spacing: 6px; padding: 10px 24px; border-radius: 8px;">
                                %s
                            </div>
                        </div>
                        <p style="color: #F59E0B; font-size: 13px; margin: 0;">
                            ⏱ This reset link and code expire in <strong>15 minutes</strong> and can only be used once.
                        </p>
                        <p style="color: #94A3B8; font-size: 12px; margin-top: 16px; border-top: 1px solid rgba(255, 255, 255, 0.1); padding-top: 12px;">
                            If you did not request this password reset, you can safely ignore this message. Your password will remain unchanged.
                        </p>
                    </div>
                    <div style="text-align: center; margin-top: 20px; color: #64748B; font-size: 12px;">
                        &copy; CineWave Entertainment. All rights reserved.
                    </div>
                </div>
            """.formatted(resetLink, otp);

            helper.setText(html, true);
            mailSender.send(message);
            logger.info("Password reset email sent successfully via SMTP to: {}", maskEmail(toEmail));
        } catch (Exception e) {
            logger.error("Failed to send password reset email to {}: {}. Note: For Gmail SMTP, ensure a 16-character App Password is used. [LOCAL TEST FALLBACK] OTP = [{}] | Direct Link = {}", maskEmail(toEmail), e.getMessage(), otp, resetLink);
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
