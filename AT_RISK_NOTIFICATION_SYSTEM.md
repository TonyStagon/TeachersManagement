# At-Risk Learner Notification System

## Overview

The system now automatically creates **alert notifications with sound alerts** when a learner with a low percentage (at-risk) is added to the system. This helps you immediately identify and support struggling learners.

## How It Works

### 1. **At-Risk Threshold**

- **At-Risk**: Average score < 70%
- When a learner is added with a score below 70%, an automatic notification is triggered

### 2. **Notification Trigger**

When you add or import a learner with a low score:

```
Add Learner with Score < 70%
           ↓
System Detects At-Risk Status
           ↓
Sound Alert Plays (3 quick beeps)
           ↓
Notification Created in Notifications Page
           ↓
Message: "[Learner Name] needs additional support in Life Orientation. Score: XX%"
```

### 3. **Sound Alert**

The system plays an **auditory alert** that consists of:

- 3 quick beeps (alert tone)
- Each beep is 800-1000Hz frequency
- Total duration: ~0.5 seconds
- Gets your attention immediately

## Example Scenarios

### Scenario 1: Adding a Single At-Risk Learner

```
Action: Add learner "Thabo Tseke" with score 45%
        ↓
Result: ⚠️ Sound plays (3 beeps)
        ↓
        Notification appears in Notifications page:
        "Thabo Tseke (ST123) needs additional support in Life Orientation. Score: 45%"
        Type: Alert (Red background)
        Status: Unread
```

### Scenario 2: Importing Multiple At-Risk Learners

```
Action: Import CSV with 5 learners
        - Learner A: 85% (Excellent) → No notification
        - Learner B: 68% (At-Risk) → Notification + Sound
        - Learner C: 52% (At-Risk) → Notification + Sound
        - Learner D: 92% (Excellent) → No notification
        - Learner E: 65% (At-Risk) → Notification + Sound

Result: 3 alert notifications created
        Sound plays 3 times (once per at-risk learner)
```

## Notification Structure

Each at-risk notification contains:

```
Title:           "Performance Alert"
Message:         "[Learner Name] ([Student Number]) needs additional support
                  in Life Orientation. Score: [XX]%"
Type:            "Alert" (Red)
Status:          "Unread" (initially)
Timestamp:       Auto-generated (shows relative time: "just now", "5m ago", etc.)
Action:          "Mark as read" button (if unread)
```

## Notification Page Features

### 1. **View All Notifications**

- Navigate to the **Notifications** page
- See all notifications in reverse chronological order (newest first)
- Notifications show learner details and when they were created

### 2. **Identify Unread Alerts**

- Unread notifications have a **green left border** and white background
- Read notifications appear in **gray background**
- Unread count badge shows in header and sidebar

### 3. **Mark as Read**

Individual notification:

- Click **"Mark as read"** button on the notification

All notifications:

- Click **"Mark All Read"** button at the top (appears only if unread items exist)

### 4. **Filter by Type**

- View statistics for:
  - **Total** notifications
  - **Unread** notifications (with badge count)
  - **Achievement** notifications

## Step-by-Step: Test the System

### Test 1: Add a Single Low-Scoring Learner

**Step 1**: Go to **Learners** page
**Step 2**: Click **"Add Learner"** button
**Step 3**: Fill in the form:

```
Full Name:        John Mkuenzeni
Student Number:   ST999
Grade:            Grade 11
Email:            john.mkuenzeni@student.edu
Date of Birth:    2006-05-15
Enrollment Date:  2024-01-15
Average Score:    55  ← BELOW 70% (AT-RISK)
Status:           Active
```

**Step 4**: Click **"Save"**

**Expected Result**:

- ⚠️ **Sound plays** (3 beeps)
- ✅ Success notification: "John Mkuenzeni has been successfully added"
- Go to **Notifications** page
- You should see a new alert:
  ```
  Title: "Performance Alert"
  Message: "John Mkuenzeni (ST999) needs additional support in Life Orientation. Score: 55%"
  Type: Alert (Red)
  Status: Unread (with "Mark as read" button)
  ```

### Test 2: Add a High-Scoring Learner (No Alert)

**Step 1**: Add learner with score **80%** or higher
**Step 2**: Save

**Expected Result**:

- ✅ No sound plays
- ✅ No notification created
- Learner appears normally in Learners list
- Only shown in Performance/Dashboard top performers

### Test 3: Import CSV with Mixed Scores

**Step 1**: Go to **Learners** page
**Step 2**: Click **"Import Learners"** button
**Step 3**: Prepare CSV with learners:

```
Full Name,Student Number,Grade,Email,Date of Birth,Enrollment Date,Status,Average Score
Mary Okonkwo,ST101,Grade 10,mary.okonkwo@student.edu,2008-03-10,2024-01-10,Active,85
James Pitso,ST102,Grade 10,james.pitso@student.edu,2008-06-22,2024-01-10,Active,62
Sarah Khanyi,ST103,Grade 11,sarah.khanyi@student.edu,2007-11-08,2024-01-10,Active,45
```

**Expected Result**:

- ⚠️ Sound plays **2 times** (for James at 62% and Sarah at 45%)
- Two alert notifications created
- One for James Pitso (62%)
- One for Sarah Khanyi (45%)
- Mary Okonkwo (85%) has no notification

### Test 4: Check Notification System

**Step 1**: Go to **Notifications** page
**Step 2**: You should see:

```
Unread Count: 2
Recent Notifications:
  1. Performance Alert - Sarah Khanyi... (Just now) [Mark as read]
  2. Performance Alert - James Pitso... (Just now) [Mark as read]
```

**Step 3**: Click **"Mark All Read"** button
**Expected**: All notifications change to gray, unread count becomes 0

**Step 4**: Click on a specific "Mark as read" button
**Expected**: That notification turns gray

## Browser Console Utilities

You can also manage notifications programmatically in browser console (F12):

```javascript
// View all notifications
notificationManager.getNotifications();

// Get unread count
notificationManager.getUnreadCount();

// Create custom at-risk notification
notificationManager.createAtRiskNotification(
  "Test Learner", // Name
  65, // Score
  "ST999", // Student number
);

// Mark notification as read
notificationManager.markAsRead("notification_id_here");

// Mark all as read
notificationManager.markAllAsRead();

// Play sound manually
notificationManager.playNotificationSound("alert");

// Clear all notifications (caution!)
notificationManager.clearAll();
```

## Sound Alert Details

### Alert Sound (For At-Risk Learners)

- **Pattern**: 3 quick beeps
- **Frequency**: 800Hz + 800Hz + 1000Hz
- **Duration**: ~0.5 seconds total
- **Purpose**: Grabs immediate attention

### Browser Requirements

- Modern browser with Web Audio API support (Chrome, Firefox, Safari, Edge)
- No external files or downloads needed
- Sound is generated programmatically

### If Sound Doesn't Work

If you don't hear sound:

1. **Check browser volume** - System volume must be on
2. **Check browser permissions** - Allow audio
3. **Check browser console** (F12 → Console tab):
   ```javascript
   // Try manually
   notificationManager.playNotificationSound("alert");
   ```
4. **Browser notifications** - System may show browser notification instead

## Dashboard Integration

The at-risk notifications work together with other system features:

```
Learners Page (Add/Import)
        ↓
Check if at-risk (< 70%)
        ↓
Create Alert Notification ← Sound plays
        ↓
Store in localStorage
        ↓
Sync across pages (Dashboard, Performance, Reports)
        ↓
Show in Notifications page
```

## Performance Implications

The notification system:

- ✅ Minimal performance impact
- ✅ Runs only when learner is added
- ✅ No background polling for notifications
- ✅ Efficient localStorage usage
- ✅ Works across browser tabs

## Customization Options

### Change At-Risk Threshold

To change the score threshold from 70% to a different value:

Edit [src/pages/Learners.tsx](src/pages/Learners.tsx):

```typescript
// Change this line:
if (validatedAvgScore < 70) {  // Current threshold

// To:
if (validatedAvgScore < 60) {  // Or any other threshold
```

### Disable Sound Alerts

In [src/lib/notificationManager.ts](src/lib/notificationManager.ts), comment out:

```typescript
// this.playNotificationSound(soundType);
```

### Change Sound Alert Pattern

Modify the `playBeep` method parameters in notificationManager.ts:

```typescript
this.playBeep(audioContext, now, 800, 0.1); // frequency, duration
```

## Files Modified/Created

**New Files:**

- ✨ `src/lib/notificationManager.ts` - Notification system with sound alerts

**Modified Files:**

- ✏️ `src/lib/mockData.ts` - Added NOTIFICATIONS to STORAGE_KEYS
- ✏️ `src/pages/Learners.tsx` - Creates notifications for at-risk learners
- ✏️ `src/pages/Notifications.tsx` - Reads from localStorage, handles mark as read
- ✏️ `src/App.tsx` - Already has debugHelper import

## Troubleshooting

### Sound Doesn't Play

1. Check speaker volume
2. Check browser audio permissions
3. Reload the page
4. Try in browser console: `notificationManager.playNotificationSound('alert')`

### Notifications Don't Appear

1. Go to Notifications page
2. Open browser console (F12)
3. Run: `notificationManager.getNotifications()`
4. Check if learner score was < 70%

### Notifications Appear But Aren't Persistent

1. Check if localStorage is enabled
2. Browser storage might be full
3. Try clearing cache and reloading

## Security Note

Sound alerts play automatically when at-risk learner is added. Users can:

- Disable browser notifications
- Mute their system volume
- Customize browser notification settings

The system **will not** play sounds on muted devices or if notifications are disabled.

## Summary

✅ At-risk learners trigger automatic notifications with sound  
✅ Sound plays when learner added with score < 70%  
✅ Notifications appear in dedicated Notifications page  
✅ Mark individual or all notifications as read  
✅ Unread count badge shows urgent alerts  
✅ Works with both single additions and bulk imports  
✅ No performance impact  
✅ Cross-browser compatible

**Your teaching workflow is now enhanced with intelligent at-risk learner alerts!** 🔔
