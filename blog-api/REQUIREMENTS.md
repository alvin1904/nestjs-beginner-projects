## **Project: Blog API**

### **Objective**

Build a RESTful API for a blog platform where users can register, create posts, and comment on posts. Includes basic authentication and user-post-comment relationships.

---

## **Tech Stack**

- **Backend Framework:** NestJS
- **Database:** PostgreSQL (or SQLite for simplicity) using TypeORM
- **Authentication:** JWT with Passport.js
- **Validation:** `class-validator`
- **Testing Tool:** Postman/Insomnia/Hoppscotch

---

## **Entities & Relationships**

### 1. **User**

| Field     | Type   | Description      |
| --------- | ------ | ---------------- |
| id        | string | UUID             |
| username  | string | Unique, required |
| email     | string | Unique, required |
| password  | string | Hashed password  |
| createdAt | Date   | Timestamp        |

- A user can write many posts and comments

---

### 2. **Post**

| Field     | Type   | Description           |
| --------- | ------ | --------------------- |
| id        | string | UUID                  |
| title     | string | Required              |
| content   | string | Markdown/HTML allowed |
| authorId  | string | FK to User            |
| createdAt | Date   | Timestamp             |

- A post belongs to one user (author)
- A post can have many comments

---

### 3. **Comment**

| Field     | Type   | Description |
| --------- | ------ | ----------- |
| id        | string | UUID        |
| content   | string | Required    |
| postId    | string | FK to Post  |
| authorId  | string | FK to User  |
| createdAt | Date   | Timestamp   |

---

## **API Endpoints**

### **Auth**

- `POST /auth/register` — register a new user
- `POST /auth/login` — login and get JWT token

---

### **Users**

- `GET /users` — list all users (admin use)
- `GET /users/:id` — get user details by ID

---

### **Posts**

- `GET /posts` — list all posts
- `GET /posts/:id` — get a post by ID
- `POST /posts` — create a post _(auth required)_
- `PATCH /posts/:id` — update a post _(only author)_
- `DELETE /posts/:id` — delete a post _(only author)_

---

### **Comments**

- `GET /posts/:postId/comments` — list comments on a post
- `POST /posts/:postId/comments` — add comment _(auth required)_
- `DELETE /comments/:id` — delete comment _(only author)_

---

## **Validation Rules**

- **User:**

  - Username: 3–20 chars, no spaces
  - Email: valid format
  - Password: min 6 chars

- **Post:**

  - Title: required, max 100 chars
  - Content: required

- **Comment:**

  - Content: required, max 500 chars

---

## **Folder Structure**

```
src/
│
├── auth/
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   ├── jwt.strategy.ts
│   └── dto/
│       ├── login.dto.ts
│       └── register.dto.ts
│
├── users/
├── posts/
├── comments/
├── common/
│   ├── guards/
│   └── decorators/
```

---

## **Features**

- Secure JWT-based auth
- User-Post-Comment relations
- Validation and error handling
- Role-based access (optional)
- Timestamps for created entities

---

## **Stretch Goals (Optional)**

- Swagger API docs
- Likes on posts/comments
- Pagination for posts/comments
- Rich markdown rendering (frontend ready)

---
