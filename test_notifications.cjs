// Test script to verify notification system
const fs = require('fs');
const path = require('path');

console.log('=== Testing Notification System ===\n');

// 1. Check if notificationManager.ts has proper console.log statements
const notificationManagerPath = path.join(__dirname, 'src/lib/notificationManager.ts');
const notificationManagerContent = fs.readFileSync(notificationManagerPath, 'utf8');

console.log('1. Notification Manager Analysis:');
console.log('   - Has createNotification method:', notificationManagerContent.includes('createNotification('));
console.log('   - Has console.log in createNotification:', notificationManagerContent.includes('console.log(\'Creating notification:\')'));
console.log('   - Has saveNotificationToDatabase method:', notificationManagerContent.includes('saveNotificationToDatabase'));
console.log('   - Has getTeacherId method:', notificationManagerContent.includes('getTeacherId():'));
console.log('   - Checks for teacher_profile:', notificationManagerContent.includes('teacher_profile'));

// 2. Check if Learners.tsx calls notificationManager
const learnersPath = path.join(__dirname, 'src/pages/Learners.tsx');
const learnersContent = fs.readFileSync(learnersPath, 'utf8');

console.log('\n2. Learners Page Analysis:');
console.log('   - Calls notificationManager.createAtRiskNotification:', learnersContent.includes('notificationManager.createAtRiskNotification'));
console.log('   - Calls notificationManager.createTopPerformerNotification:', learnersContent.includes('notificationManager.createTopPerformerNotification'));
console.log('   - Score threshold for at-risk (< 70):', learnersContent.includes('validatedAvgScore < 70'));
console.log('   - Score threshold for top performer (>= 90):', learnersContent.includes('validatedAvgScore >= 90'));

// 3. Check if Notifications.tsx loads from localStorage
const notificationsPath = path.join(__dirname, 'src/pages/Notifications.tsx');
const notificationsContent = fs.readFileSync(notificationsPath, 'utf8');

console.log('\n3. Notifications Page Analysis:');
console.log('   - Loads from localStorage:', notificationsContent.includes('localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS)'));
console.log('   - Has useEffect for loading:', notificationsContent.includes('useEffect'));
console.log('   - Polls localStorage every 5 seconds:', notificationsContent.includes('setInterval(loadNotificationsFromStorage, 5000)'));

// 4. Check database schema
const databaseTypesPath = path.join(__dirname, 'src/lib/database.types.ts');
const databaseTypesContent = fs.readFileSync(databaseTypesPath, 'utf8');

console.log('\n4. Database Schema Analysis:');
console.log('   - Notifications table has learner_id:', databaseTypesContent.includes('learner_id?: string | null'));
console.log('   - Notifications table has learner_name:', databaseTypesContent.includes('learner_name?: string | null'));
console.log('   - Notifications table has sound_play_count:', databaseTypesContent.includes('sound_play_count?: number'));

// 5. Check notificationService.ts
const notificationServicePath = path.join(__dirname, 'src/lib/notificationService.ts');
const notificationServiceContent = fs.readFileSync(notificationServicePath, 'utf8');

console.log('\n5. Notification Service Analysis:');
console.log('   - Has createNotification function:', notificationServiceContent.includes('export async function createNotification'));
console.log('   - Uses type assertions for Supabase:', notificationServiceContent.includes('as any'));

console.log('\n=== Summary ===');
console.log('The notification system should work if:');
console.log('1. Teacher is logged in (teacher_profile in localStorage)');
console.log('2. Learner score is < 70 (at-risk) or >= 90 (top performer)');
console.log('3. Notifications page polls localStorage every 5 seconds');
console.log('4. Database has the correct schema (learner_id, learner_name, sound_play_count columns)');
console.log('\nIf notifications are not appearing, check browser console for:');
console.log('- "Creating notification:" logs');
console.log('- "Attempting to save notification to database" logs');
console.log('- "Teacher ID not available" warnings');