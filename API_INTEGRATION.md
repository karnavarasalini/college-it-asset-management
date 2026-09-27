# API Integration Plan

## Purpose
This document defines the data and API requirements for connecting the Member 4 User Dashboard frontend to the backend.

## Current Status
- The frontend User Dashboard is implemented.
- The frontend currently uses sample/client-side data.
- Backend integration is pending.
- Database integration is pending.
- No real API endpoints are currently available.

## Required Backend Operations

### Authentication
- User login
- User logout and session handling

### User Profile
- Get the current user profile
- Update the user profile

### Assets
- Get assets assigned to the current user
- Get details of a specific asset

### Service Requests
- Get the user's service requests
- Create a new service request
- Get a service request's status

### Notifications
- Get the user's notifications
- Mark a notification as read
- Mark all notifications as read

## Expected Data

### User
- `userId`
- `fullName`
- `email`
- `department`
- `role`
- `phone`

### Asset
- `assetId`
- `assetName`
- `category`
- `brand`
- `model`
- `serialNumber`
- `assignedDate`
- `status`
- `assignedTo`
- `location`

### Service Request
- `requestId`
- `assetId`
- `issueCategory`
- `description`
- `priority`
- `status`
- `createdDate`

### Notification
- `notificationId`
- `title`
- `message`
- `type`
- `createdDate`
- `readStatus`

## Important Note
The backend API is **not implemented yet**. Do not treat the operations above as available endpoints. The final endpoint names, HTTP methods, authentication mechanism, and response format must be confirmed by the backend developer before frontend integration.

## Future Integration Flow
```text
User Dashboard
      |
      v
Frontend JavaScript
      |
      v
REST API
      |
      v
Backend Service
      |
      v
Database
```
