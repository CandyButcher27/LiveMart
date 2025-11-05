# backend/app/utils/notifications.py
import smtplib
from email.mime.text import MIMEText
from fastapi import BackgroundTasks

def send_email_background(background_tasks: BackgroundTasks, to_email: str, subject: str, message: str):
    background_tasks.add_task(send_email, to_email, subject, message)

def send_email(to_email: str, subject: str, message: str):
    # Mock email sender (prints to console for demo)
    print(f"\n=== EMAIL SENT ===\nTo: {to_email}\nSubject: {subject}\n{message}\n==================\n")

def send_sms(to_number: str, message: str):
    # Mock SMS notification
    print(f"📱 SMS to {to_number}: {message}")
