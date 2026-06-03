import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from datetime import datetime
import os

class EmailService:
    """Email service for sending notifications"""
    
    def __init__(self):
        self.smtp_server = os.getenv("SMTP_SERVER", "smtp.gmail.com")
        self.smtp_port = int(os.getenv("SMTP_PORT", "587"))
        self.sender_email = os.getenv("SENDER_EMAIL", "noreply@edupulse.ai")
        self.sender_password = os.getenv("SENDER_PASSWORD", "")
        self.sender_name = "EduPulse AI"
    
    def send_high_risk_notification(self, parent_email: str, student_name: str, risk_level: str, dropout_risk: float, suggestions: list = None):
        """Send email notification for high-risk student"""
        
        if not self.sender_password:
            print("⚠️  Email service not configured (SENDER_PASSWORD not set)")
            return False
        
        if not parent_email or '@' not in parent_email:
            print(f"⚠️  Invalid parent email: {parent_email}")
            return False
        
        try:
            subject = f"⚠️ Alert: {student_name} - Academic Performance Warning"
            
            # HTML email body
            html_body = f"""
            <html>
                <head>
                    <style>
                        body {{ font-family: Arial, sans-serif; }}
                        .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                        .header {{ background-color: #1f75ff; color: white; padding: 20px; border-radius: 8px; }}
                        .risk-badge {{ 
                            display: inline-block; 
                            padding: 8px 16px; 
                            border-radius: 4px; 
                            font-weight: bold;
                            margin: 10px 0;
                        }}
                        .risk-high {{ background-color: #ff4444; color: white; }}
                        .risk-medium {{ background-color: #ffcc44; color: black; }}
                        .content {{ margin: 20px 0; line-height: 1.6; }}
                        .suggestions {{ background-color: #f0f0f0; padding: 15px; border-radius: 8px; margin-top: 15px; }}
                        .footer {{ color: #666; font-size: 12px; margin-top: 20px; }}
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>Academic Performance Alert</h1>
                            <p>We're reaching out with important information about {student_name}'s academic performance.</p>
                        </div>
                        
                        <div class="content">
                            <p>Dear Parent/Guardian,</p>
                            
                            <p>Our AI monitoring system has flagged {student_name} as having a <span class="risk-badge risk-{risk_level.lower()}">{risk_level.upper()} RISK</span> level based on their recent academic performance.</p>
                            
                            <p><strong>Dropout Risk Score:</strong> {dropout_risk:.1f}%</p>
                            
                            <p>This indicates that {student_name} may need additional academic support and attention to prevent further decline in performance.</p>
            """
            
            if suggestions:
                html_body += "<div class='suggestions'><h3>Recommended Actions:</h3><ul>"
                for suggestion in suggestions[:5]:  # Limit to 5 suggestions
                    html_body += f"<li>{suggestion}</li>"
                html_body += "</ul></div>"
            
            html_body += f"""
                            <p><strong>Suggested Next Steps:</strong></p>
                            <ul>
                                <li>Review recent assignment and exam grades</li>
                                <li>Discuss academic challenges with your child</li>
                                <li>Contact the school for additional support resources</li>
                                <li>Monitor progress regularly through the EduPulse platform</li>
                            </ul>
                            
                            <p>If you have any questions or concerns, please don't hesitate to contact the school administration.</p>
                            
                            <p>Best regards,<br/>
                            <strong>EduPulse AI System</strong>
                            </p>
                        </div>
                        
                        <div class="footer">
                            <p>This is an automated notification from EduPulse AI Student Performance System.</p>
                            <p>Generated on {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}</p>
                        </div>
                    </div>
                </body>
            </html>
            """
            
            # Plain text fallback
            text_body = f"""
            Academic Performance Alert for {student_name}
            
            Risk Level: {risk_level.upper()}
            Dropout Risk Score: {dropout_risk:.1f}%
            
            Your child may need additional academic support.
            
            Suggested Actions:
            - Review recent grades
            - Discuss with your child
            - Contact school for support
            
            Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
            """
            
            # Create message
            message = MIMEMultipart("alternative")
            message["Subject"] = subject
            message["From"] = f"{self.sender_name} <{self.sender_email}>"
            message["To"] = parent_email
            
            part1 = MIMEText(text_body, "plain")
            part2 = MIMEText(html_body, "html")
            
            message.attach(part1)
            message.attach(part2)
            
            # Send email
            with smtplib.SMTP(self.smtp_server, self.smtp_port) as server:
                server.starttls()
                server.login(self.sender_email, self.sender_password)
                server.send_message(message)
            
            print(f"✉️  Email sent to {parent_email} for student {student_name}")
            return True
            
        except Exception as e:
            print(f"❌ Failed to send email to {parent_email}: {e}")
            return False
    
    def send_batch_notifications(self, students_data: list):
        """Send notifications for multiple students"""
        results = {
            "sent": 0,
            "failed": 0,
            "skipped": 0
        }
        
        for student in students_data:
            if student.get("risk_level") == "high" and student.get("parent_email"):
                success = self.send_high_risk_notification(
                    parent_email=student["parent_email"],
                    student_name=student["name"],
                    risk_level=student["risk_level"],
                    dropout_risk=student.get("dropout_risk", 0),
                    suggestions=student.get("suggestions", [])
                )
                if success:
                    results["sent"] += 1
                else:
                    results["failed"] += 1
            else:
                results["skipped"] += 1
        
        return results

# Global email service instance
email_service = EmailService()
