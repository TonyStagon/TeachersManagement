// Test script to diagnose notification issues
console.log('=== Testing Notification System Fix ===');

// Check localStorage for teacher_profile
const teacherProfile = localStorage.getItem('teacher_profile');
console.log('1. Teacher profile in localStorage:', teacherProfile ? 'Found' : 'NOT FOUND');

if (teacherProfile) {
    try {
        const teacher = JSON.parse(teacherProfile);
        console.log('   Teacher ID:', teacher.id);
        console.log('   Teacher Name:', teacher.full_name);
        console.log('   Teacher Email:', teacher.email);
    } catch (e) {
        console.log('   Error parsing teacher profile:', e.message);
    }
}

// Check notifications in localStorage
const notificationsKey = 'teacher-management-notifications';
const notifications = localStorage.getItem(notificationsKey);
console.log('\n2. Notifications in localStorage:', notifications ? 'Found' : 'NOT FOUND');

if (notifications) {
    try {
        const notifs = JSON.parse(notifications);
        console.log('   Number of notifications:', notifs.length);
        console.log('   Unread notifications:', notifs.filter(n => !n.is_read).length);
    } catch (e) {
        console.log('   Error parsing notifications:', e.message);
    }
}

// Check if AudioContext is available
console.log('\n3. AudioContext availability:');
console.log('   window.AudioContext:', typeof window.AudioContext !== 'undefined' ? 'Available' : 'NOT AVAILABLE');
console.log('   window.webkitAudioContext:', typeof window.webkitAudioContext !== 'undefined' ? 'Available' : 'NOT AVAILABLE');

// Check if Notification API is available
console.log('\n4. Notification API availability:');
console.log('   window.Notification:', 'Notification' in window ? 'Available' : 'NOT AVAILABLE');
if ('Notification' in window) {
    console.log('   Notification.permission:', Notification.permission);
}

// Test creating a notification manually
console.log('\n5. Testing manual notification creation:');
if (window.notificationManager) {
    console.log('   notificationManager is available on window');

    // Create a test notification
    const testNotif = window.notificationManager.createNotification(
        'Test Notification',
        'This is a test notification to verify the system is working',
        'Info'
    );
    console.log('   Test notification created with ID:', testNotif.id);

    // Check if it was saved
    const updatedNotifications = localStorage.getItem(notificationsKey);
    if (updatedNotifications) {
        const notifs = JSON.parse(updatedNotifications);
        const testNotifFound = notifs.find(n => n.id === testNotif.id);
        console.log('   Test notification found in localStorage:', testNotifFound ? 'YES' : 'NO');
    }
} else {
    console.log('   notificationManager is NOT available on window');
    console.log('   This could be because the notificationManager module is not loaded');
}

console.log('\n=== Diagnosis Complete ===');
console.log('\nCommon issues:');
console.log('1. Teacher not logged in (no teacher_profile in localStorage)');
console.log('2. AudioContext not available (requires user interaction in some browsers)');
console.log('3. Notification permission not granted');
console.log('4. notificationManager not properly exposed on window object');