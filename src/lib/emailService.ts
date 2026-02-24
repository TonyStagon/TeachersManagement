/**
 * Email Service for Teacher Management System
 * Uses Resend API for sending email notifications
 */

import { Resend } from 'resend';

// Initialize Resend client
const resendApiKey = import.meta.env.VITE_RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;

// Email configuration
const FROM_EMAIL = 'notifications@teachermanagement.app';
const FROM_NAME = 'Teacher Management System';

export interface EmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
}

export interface NotificationEmailData {
  teacherName: string;
  teacherEmail: string;
  notificationType: 'at-risk' | 'achievement' | 'top-performer' | 'info';
  learnerName: string;
  learnerScore?: number;
  achievementTitle?: string;
  studentNumber?: string;
  notificationMessage: string;
  rank?: number;
  totalLearners?: number;
}

/**
 * Send an email notification to a teacher
 */
export async function sendTeacherNotificationEmail(data: NotificationEmailData): Promise<boolean> {
  try {
    if (!resend) {
      console.warn('Resend API key not configured. Email notifications disabled.');
      return false;
    }

    const { teacherEmail, teacherName, notificationType, learnerName, learnerScore, achievementTitle, studentNumber, notificationMessage, rank, totalLearners } = data;

    // Determine email subject based on notification type
    let subject: string;
    let htmlContent: string;

    switch (notificationType) {
      case 'at-risk':
        subject = `⚠️ Performance Alert: ${learnerName} Needs Support`;
        htmlContent = generateAtRiskEmailHtml(teacherName, learnerName, learnerScore!, studentNumber, notificationMessage);
        break;
      case 'top-performer':
        subject = `🏆 Top Performer: ${learnerName} is Excelling`;
        htmlContent = generateTopPerformerEmailHtml(teacherName, learnerName, learnerScore!, studentNumber, notificationMessage, rank, totalLearners);
        break;
      case 'achievement':
        subject = `🏆 Achievement: ${learnerName} Earned ${achievementTitle}`;
        htmlContent = generateAchievementEmailHtml(teacherName, learnerName, achievementTitle!, studentNumber, notificationMessage);
        break;
      default:
        subject = `ℹ️ Notification: ${learnerName}`;
        htmlContent = generateInfoEmailHtml(teacherName, learnerName, notificationMessage);
        break;
    }

    const emailOptions: EmailOptions = {
      to: teacherEmail,
      subject,
      html: htmlContent,
      text: generatePlainText(teacherName, learnerName, notificationMessage, notificationType, learnerScore, achievementTitle, rank, totalLearners),
    };

    const result = await resend.emails.send({
      from: `${FROM_NAME} <${FROM_EMAIL}>`,
      to: emailOptions.to,
      subject: emailOptions.subject,
      html: emailOptions.html,
      text: emailOptions.text,
    });

    if (result.error) {
      console.error('Failed to send email notification:', result.error);
      return false;
    }

    console.log('Email notification sent successfully:', result.data?.id);
    return true;
  } catch (error) {
    console.error('Error sending email notification:', error);
    return false;
  }
}

/**
 * Generate HTML for at-risk learner notification email
 */
function generateAtRiskEmailHtml(
  teacherName: string,
  learnerName: string,
  learnerScore: number,
  studentNumber: string | undefined,
  message: string
): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Performance Alert</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #f8d7da; color: #721c24; padding: 20px; border-radius: 5px; margin-bottom: 20px; }
        .content { background-color: #f9f9f9; padding: 20px; border-radius: 5px; border-left: 4px solid #dc3545; }
        .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #666; }
        .alert-icon { font-size: 24px; margin-right: 10px; }
        .learner-info { background-color: #fff3cd; padding: 15px; border-radius: 5px; margin: 15px 0; }
        .score { font-size: 18px; font-weight: bold; color: #dc3545; }
        .button { display: inline-block; background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin-top: 15px; }
      </style>
    </head>
    <body>
      <div class="header">
        <span class="alert-icon">⚠️</span>
        <h2>Performance Alert</h2>
      </div>
      
      <div class="content">
        <p>Dear ${teacherName},</p>
        
        <p>One of your learners requires additional support:</p>
        
        <div class="learner-info">
          <h3>${learnerName} ${studentNumber ? `(${studentNumber})` : ''}</h3>
          <p>Current Score: <span class="score">${learnerScore}%</span></p>
          <p><strong>Alert:</strong> ${message}</p>
        </div>
        
        <p>This learner's performance in Life Orientation indicates they may need additional support or intervention.</p>
        
        <p>Please review their progress and consider providing additional resources or scheduling a consultation.</p>
        
        <a href="${window.location.origin}/learners" class="button">View Learner Details</a>
      </div>
      
      <div class="footer">
        <p>This is an automated notification from the Teacher Management System.</p>
        <p>You can manage your notification preferences in your account settings.</p>
      </div>
    </body>
    </html>
  `;
}

/**
 * Generate HTML for top performer notification email
 */
function generateTopPerformerEmailHtml(
  teacherName: string,
  learnerName: string,
  learnerScore: number,
  studentNumber: string | undefined,
  message: string,
  rank?: number,
  totalLearners?: number
): string {
  const rankText = rank ? `Rank #${rank}${totalLearners ? ` out of ${totalLearners}` : ''}` : 'Top Performer';
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Top Performer Notification</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #d4edda; color: #155724; padding: 20px; border-radius: 5px; margin-bottom: 20px; }
        .content { background-color: #f9f9f9; padding: 20px; border-radius: 5px; border-left: 4px solid #28a745; }
        .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #666; }
        .achievement-icon { font-size: 24px; margin-right: 10px; }
        .learner-info { background-color: #e8f5e8; padding: 15px; border-radius: 5px; margin: 15px 0; }
        .score { font-size: 18px; font-weight: bold; color: #28a745; }
        .rank { background-color: #ffc107; color: #856404; padding: 5px 10px; border-radius: 3px; font-weight: bold; }
        .button { display: inline-block; background-color: #28a745; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin-top: 15px; }
      </style>
    </head>
    <body>
      <div class="header">
        <span class="achievement-icon">🏆</span>
        <h2>Top Performer Alert!</h2>
      </div>
      
      <div class="content">
        <p>Dear ${teacherName},</p>
        
        <p>One of your learners is excelling and deserves recognition:</p>
        
        <div class="learner-info">
          <h3>${learnerName} ${studentNumber ? `(${studentNumber})` : ''}</h3>
          <p>Current Score: <span class="score">${learnerScore}%</span></p>
          <p>Performance: <span class="rank">${rankText}</span></p>
          <p><strong>Recognition:</strong> ${message}</p>
        </div>
        
        <p>${learnerName} is demonstrating exceptional performance in Life Orientation.</p>
        
        <p>Consider acknowledging their achievement to encourage continued excellence.</p>
        
        <a href="${window.location.origin}/learners" class="button">View Learner Details</a>
      </div>
      
      <div class="footer">
        <p>This is an automated notification from the Teacher Management System.</p>
        <p>You can manage your notification preferences in your account settings.</p>
      </div>
    </body>
    </html>
  `;
}

/**
 * Generate HTML for achievement notification email
 */
function generateAchievementEmailHtml(
  teacherName: string,
  learnerName: string,
  achievementTitle: string,
  studentNumber: string | undefined,
  message: string
): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Achievement Notification</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #d4edda; color: #155724; padding: 20px; border-radius: 5px; margin-bottom: 20px; }
        .content { background-color: #f9f9f9; padding: 20px; border-radius: 5px; border-left: 4px solid #28a745; }
        .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #666; }
        .achievement-icon { font-size: 24px; margin-right: 10px; }
        .learner-info { background-color: #e8f5e8; padding: 15px; border-radius: 5px; margin: 15px 0; }
        .achievement-title { font-size: 18px; font-weight: bold; color: #28a745; }
        .button { display: inline-block; background-color: #28a745; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin-top: 15px; }
      </style>
    </head>
    <body>
      <div class="header">
        <span class="achievement-icon">🏆</span>
        <h2>Achievement Unlocked!</h2>
      </div>
      
      <div class="content">
        <p>Dear ${teacherName},</p>
        
        <p>One of your learners has earned a new achievement:</p>
        
        <div class="learner-info">
          <h3>${learnerName} ${studentNumber ? `(${studentNumber})` : ''}</h3>
          <p>Achievement: <span class="achievement-title">${achievementTitle}</span></p>
          <p><strong>Details:</strong> ${message}</p>
        </div>
        
        <p>Congratulations to ${learnerName} for this accomplishment!</p>
        
        <p>This achievement reflects their dedication and progress in your subject.</p>
        
        <a href="${window.location.origin}/achievements" class="button">View All Achievements</a>
      </div>
      
      <div class="footer">
        <p>This is an automated notification from the Teacher Management System.</p>
        <p>You can manage your notification preferences in your account settings.</p>
      </div>
    </body>
    </html>
  `;
}

/**
 * Generate HTML for general info notification email
 */
function generateInfoEmailHtml(
  teacherName: string,
  learnerName: string,
  message: string
): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Information Notification</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #d1ecf1; color: #0c5460; padding: 20px; border-radius: 5px; margin-bottom: 20px; }
        .content { background-color: #f9f9f9; padding: 20px; border-radius: 5px; border-left: 4px solid #17a2b8; }
        .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #666; }
        .info-icon { font-size: 24px; margin-right: 10px; }
        .button { display: inline-block; background-color: #17a2b8; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin-top: 15px; }
      </style>
    </head>
    <body>
      <div class="header">
        <span class="info-icon">ℹ️</span>
        <h2>Information Notification</h2>
      </div>
      
      <div class="content">
        <p>Dear ${teacherName},</p>
        
        <p>You have a new notification regarding ${learnerName}:</p>
        
        <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 15px 0;">
          <p><strong>Message:</strong> ${message}</p>
        </div>
        
        <a href="${window.location.origin}/notifications" class="button">View All Notifications</a>
      </div>
      
      <div class="footer">
        <p>This is an automated notification from the Teacher Management System.</p>
        <p>You can manage your notification preferences in your account settings.</p>
      </div>
    </body>
    </html>
  `;
}

/**
 * Generate plain text version of the email
 */
function generatePlainText(
  teacherName: string,
  learnerName: string,
  message: string,
  notificationType: string,
  learnerScore?: number,
  achievementTitle?: string,
  rank?: number,
  totalLearners?: number
): string {
  let text = `Dear ${teacherName},\n\n`;
  
  switch (notificationType) {
    case 'at-risk':
      text += `Performance Alert: ${learnerName} needs additional support.\n`;
      text += `Score: ${learnerScore}%\n`;
      text += `Alert: ${message}\n\n`;
      text += 'This learner\'s performance indicates they may need additional support or intervention.\n';
      break;
    case 'top-performer':
      const rankText = rank ? `Rank #${rank}${totalLearners ? ` out of ${totalLearners}` : ''}` : 'Top Performer';
      text += `Top Performer: ${learnerName} is excelling.\n`;
      text += `Score: ${learnerScore}%\n`;
      text += `Performance: ${rankText}\n`;
      text += `Recognition: ${message}\n\n`;
      text += 'This learner is demonstrating exceptional performance and deserves recognition.\n';
      break;
    case 'achievement':
      text += `Achievement: ${learnerName} has earned ${achievementTitle}.\n`;
      text += `Details: ${message}\n\n`;
      text += 'Congratulations to the learner for this accomplishment!\n';
      break;
    default:
      text += `Notification: ${learnerName}\n`;
      text += `Message: ${message}\n\n`;
      break;
  }
  
  text += `\nYou can view more details in the Teacher Management System.\n`;
  text += `\n---\n`;
  text += `This is an automated notification from the Teacher Management System.\n`;
  text += `You can manage your notification preferences in your account settings.`;
  
  return text;
}

/**
 * Test function to verify email service is working
 */
export async function testEmailService(teacherEmail: string, teacherName: string): Promise<boolean> {
  try {
    const testData: NotificationEmailData = {
      teacherName,
      teacherEmail,
      notificationType: 'info',
      learnerName: 'Test Learner',
      notificationMessage: 'This is a test notification to verify email functionality.',
    };

    return await sendTeacherNotificationEmail(testData);
  } catch (error) {
    console.error('Email service test failed:', error);
    return false;
  }
}