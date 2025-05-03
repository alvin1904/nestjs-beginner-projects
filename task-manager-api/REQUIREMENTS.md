## **Project: Task Manager API**

### **Objective**

RESTful API to manage tasks. Users can create, view, update, delete, and filter tasks by status or search terms.

---

## **Tech Stack**

- **Backend Framework:** NestJS
- **Database:** In-memory
- **Language:** TypeScript
- **Validation:** `class-validator`
- **Tools:** Postman/Insomnia/Hoppscotch for testing

---

## **Entities & Models**

### **Task**

| Field       | Type   | Description                |
| ----------- | ------ | -------------------------- |
| id          | string | UUID                       |
| title       | string | Task title                 |
| description | string | Task details               |
| status      | enum   | OPEN / IN_PROGRESS / DONE  |
| createdAt   | Date   | Timestamp of task creation |

---

## **API Endpoints**

### 1. **Create Task**

- **Method:** `POST`
- **URL:** `/tasks`
- **Body:**

```json
{
  "title": "Write blog post",
  "description": "Write a post about NestJS basics"
}
```

- **Response:** Task object with `id`, `status: OPEN`, and `createdAt`

---

### 2. **Get All Tasks**

- **Method:** `GET`
- **URL:** `/tasks`
- **Query Params (optional):**

  - `status=OPEN`
  - `search=blog`

- **Response:** Array of filtered task objects

---

### 3. **Get Task by ID**

- **Method:** `GET`
- **URL:** `/tasks/:id`
- **Response:** Task object

---

### 4. **Delete Task**

- **Method:** `DELETE`
- **URL:** `/tasks/:id`
- **Response:** 204 No Content or confirmation message

---

### 5. **Update Task Status**

- **Method:** `PATCH`
- **URL:** `/tasks/:id/status`
- **Body:**

```json
{
  "status": "IN_PROGRESS"
}
```

- **Response:** Updated task object

---

## **Validation Rules**

- `title` and `description` should be non-empty strings
- `status` must be one of `OPEN`, `IN_PROGRESS`, `DONE`

---

## **Folder Structure**

```
src/
│
├── tasks/
│   ├── dto/
│   │   ├── create-task.dto.ts
│   │   └── update-task-status.dto.ts
│   ├── task.model.ts
│   ├── tasks.controller.ts
│   ├── tasks.service.ts
│   └── tasks.module.ts
│
├── app.module.ts
```

---

## **Stretch Goals (Optional)**

- Connect to SQLite using TypeORM
- Add authentication (JWT)
- Use Swagger for API documentation

---
