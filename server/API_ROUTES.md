# ChatFly API Routes Documentation

## Base URL
```
https://localhost:5001/api
```

## Authentication Routes (`/api/auth`)

### POST `/auth/register`
Register a new user account.

**Request Body:**
```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "securepassword123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "username": "john_doe",
    "email": "john@example.com"
  }
}
```

### POST `/auth/login`
Login with existing user credentials.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "securepassword123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "jwt_token_here",
    "user": {
      "email": "john@example.com",
      "username": "john_doe"
    }
  }
}
```

### POST `/auth/logout` 🔒
Logout the current user (requires authentication).

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response:**
```json
{
  "success": true,
  "message": "Logout successful"
}
```

### GET `/auth/profile` 🔒
Get current user profile (requires authentication).

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_id",
      "username": "john_doe",
      "email": "john@example.com",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

### PUT `/auth/profile` 🔒
Update current user profile (requires authentication).

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Request Body:**
```json
{
  "username": "new_username",
  "avatar": "avatar_url"
}
```

## Chat Routes (`/api/chats`) 🔒
All chat routes require authentication.

### GET `/chats`
Get all chats for the current user.

**Response:**
```json
{
  "success": true,
  "data": {
    "chats": [
      {
        "id": "chat-1",
        "name": "General Chat",
        "type": "group",
        "lastMessage": "Hello everyone!",
        "lastMessageTime": "2024-01-01T00:00:00.000Z",
        "unreadCount": 2
      }
    ]
  }
}
```

### POST `/chats`
Create a new chat room.

**Request Body:**
```json
{
  "name": "My New Chat",
  "type": "group",
  "participants": ["user_id_1", "user_id_2"]
}
```

### GET `/chats/:chatId/messages`
Get messages for a specific chat.

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Messages per page (default: 50)

**Response:**
```json
{
  "success": true,
  "data": {
    "messages": [
      {
        "id": "msg-1",
        "chatId": "chat-1",
        "senderId": "user-1",
        "senderName": "John Doe",
        "content": "Hello everyone!",
        "type": "text",
        "timestamp": "2024-01-01T00:00:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 50,
      "total": 100,
      "totalPages": 2
    }
  }
}
```

### POST `/chats/:chatId/messages`
Send a message to a chat.

**Request Body:**
```json
{
  "content": "Hello everyone!",
  "type": "text"
}
```

### POST `/chats/:chatId/join`
Join a chat room.

### POST `/chats/:chatId/leave`
Leave a chat room.

## User Routes (`/api/users`) 🔒
All user routes require authentication.

### GET `/users`
Get all users (for finding users to chat with).

**Query Parameters:**
- `search` (optional): Search term for username or email

**Response:**
```json
{
  "success": true,
  "data": {
    "users": [
      {
        "id": "user-1",
        "username": "john_doe",
        "email": "john@example.com",
        "avatar": null,
        "isOnline": true,
        "lastSeen": "2024-01-01T00:00:00.000Z"
      }
    ]
  }
}
```

### GET `/users/:userId`
Get user details by ID.

### PATCH `/users/status`
Update user online status.

**Request Body:**
```json
{
  "isOnline": true
}
```

## Health Check Route

### GET `/api/health`
Check if the API is running.

**Response:**
```json
{
  "success": true,
  "message": "API is healthy",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## Error Responses

All endpoints may return the following error format:

```json
{
  "success": false,
  "message": "Error description"
}
```

Common HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

## Authentication

🔒 Protected routes require a JWT token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

Get the JWT token by logging in via `/api/auth/login`.

## Notes

- All timestamps are in ISO 8601 format
- This is a development setup with mock data
- Database integration and real authentication need to be implemented
- Socket.io integration is available for real-time messaging
