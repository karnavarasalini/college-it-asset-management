# User Dashboard Testing

## 1. Objective
Testing verifies that the User Dashboard features work correctly and that user interactions produce the expected results.

## 2. Testing Environment
- Browser: Microsoft Edge or Google Chrome
- Editor: Visual Studio Code
- Frontend: HTML, CSS, JavaScript
- Testing method: Manual functional testing
- Application execution: Live Server

## 3. Test Cases

| Test ID | Feature | Test Action | Expected Result | Status |
|---|---|---|---|---|
| TC-01 | Login with valid credentials | Enter the sample credentials `USER-001` and `student123`, then select Login. | The login screen is hidden, the Dashboard is displayed, and a welcome confirmation appears. | Pass |
| TC-02 | Login with invalid credentials | Enter an incorrect User ID or password and submit. | Login is rejected with a generic invalid-credentials message; the Dashboard remains hidden. | Pass |
| TC-03 | Login with empty fields | Submit the login form with either or both fields empty. | The form displays a required-field message and does not open the Dashboard. | Pass |
| TC-04 | Show/hide password | Select Show and then Hide in the password field. | The password visibility toggles without changing the entered value. | Pass |
| TC-05 | Dashboard navigation | Select Dashboard, My Assets, Service Requests, Notifications, Help & FAQ, and My Profile in the sidebar. | The selected section appears without a page reload and the page heading and active navigation state update. | Pass |
| TC-06 | Dashboard statistics | Sign in and compare the summary cards with the current sample arrays. | Assigned Assets, Active Requests, Completed Requests, and unread Notifications show the values calculated from client-side data. | Pass |
| TC-07 | Search asset | Open My Assets and search using an asset ID or part of an asset name. | The asset list filters to matching records as the search text changes. | Pass |
| TC-08 | Filter assets by category | Select a category in the My Assets category filter. | Only assets in the selected category are displayed; choosing All Categories restores the full list. | Pass |
| TC-09 | View asset details | Select View Details for an asset. | The details modal shows that asset's sample information and can be closed with its controls or by clicking outside. | Pass |
| TC-10 | Submit service request with valid data | Complete all request fields and submit the form. | A new request receives an ID, appears with Pending status, and a success message is displayed. | Pass |
| TC-11 | Validate empty service request fields | Open New Request and submit with required fields empty. | A clear validation message appears and no request is added. | Pass |
| TC-12 | New request appears in request list | Submit a valid service request and open or remain on Service Requests. | The new request appears immediately in the table without a page refresh. | Pass |
| TC-13 | Active request count updates | Submit a valid service request with its initial Pending status. | The Active Requests summary count increases immediately. | Pass |
| TC-14 | Mark notification as read | Select Mark as Read for an unread notification. | Its appearance and read status update, the individual action is removed, and the unread count decreases. | Pass |
| TC-15 | Mark all notifications as read | Select Mark All as Read. | All notifications become read, the unread count becomes zero, and the no-unread message appears. | Pass |
| TC-16 | Edit user profile | Open My Profile, select Edit Profile, change editable fields, and save. | The updated profile information appears immediately with a success confirmation. | Pass |
| TC-17 | Profile validation | Try saving the profile with required fields empty or an invalid email address. | A clear validation message appears and the profile is not updated. | Pass |
| TC-18 | Help & FAQ expand/collapse | Open Help & FAQ, select a question, then select it again. | The answer expands on the first selection and collapses on the next; keyboard activation also works. | Pass |
| TC-19 | Logout | Select Logout and confirm the action. | The Dashboard is hidden, the login screen returns, and the password field is cleared. | Pass |
| TC-20 | Responsive layout | Open the application at desktop, tablet, and mobile viewport sizes. | The sidebar adapts for mobile, controls and modals fit the viewport, tables remain usable, and the page does not overflow horizontally. | Pass |

Statuses apply to the current frontend demonstration and sample-data behavior only; they do not indicate backend, database, or production authentication testing.

## 4. Testing Limitations
- Backend API integration is pending.
- Database integration is pending.
- Current testing uses frontend/sample client-side data.
- Real authentication and security have not been implemented yet.

## 5. Future Testing
After backend integration, test the following:
- API responses
- Authentication
- Database operations
- Error handling
- End-to-end user flows
- Integration between frontend, backend, and database
