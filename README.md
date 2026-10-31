# EventFlow

EventFlow is a full-stack University Event Management System developed as a DBMS project. It provides a centralized platform for students, event organizers, and administrators to manage the complete lifecycle of university events.

## Features

### Student

- Register and login
- Browse approved events
- Search and filter events
- View event details
- Register for events
- Cancel registrations
- View registered events
- Submit feedback after attendance

### Organizer

- Create events
- Edit events
- Cancel events
- Track approval status
- View registered participants
- Mark student attendance
- View event feedback and ratings

### Admin

- Approve or reject events
- View system statistics
- Monitor registrations
- View popular events
- Analyze events by category
- View event ratings
- View attendance statistics

## Technology Stack

### Frontend

- React
- Vite
- React Router
- Axios
- CSS

### Backend

- Node.js
- Express.js
- JWT Authentication
- bcryptjs

### Database

- MongoDB Atlas
- Mongoose

## Database Collections

EventFlow uses the following main collections:

- Users
- Events
- Registrations
- Attendance
- Feedback
- Categories

### Main Relationships

A user can register for multiple events and an event can have multiple users.

This many-to-many relationship is implemented using the Registration collection.

```text
User 1 ---- N Registration N ---- 1 Event
                     |
                     |
                     1
                     |
                Attendance

User 1 ---- N Feedback N ---- 1 Event
```
