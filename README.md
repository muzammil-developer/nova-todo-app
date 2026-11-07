# Nova – Todo App

A simple, responsive, and user-friendly Todo Application built with HTML, CSS, JavaScript, Bootstrap, and Firebase.

Nova helps users manage their daily tasks by allowing them to add, view, and delete todos. Each user can access only their own todos through Firebase Authentication and Cloud Firestore.

## 🚀 Features

- **User Authentication:** Secure login using Firebase Authentication.
- **Add Todos:** Easily add new tasks.
- **View Todos:** Display all your saved tasks.
- **Delete Todos:** Remove tasks whenever you want.
- **User-Specific Todos:** Each user can only see their own todos.
- **Cloud Database:** Store todos in Firebase Firestore.
- **Empty State Message:** Displays "No todos added yet" when the list is empty.
- **Responsive Design:** Works on desktop, tablet, and mobile devices.
- **Simple UI:** Clean and modern interface using Bootstrap.

## 🛠️ Technologies Used

- HTML5
- CSS3
- JavaScript (ES6 Modules)
- Bootstrap 5.3.8
- Firebase Authentication
- Firebase Cloud Firestore

## 📂 Project Structure

```text
Nova-Todo-App/
│
├── index.html
├── dashboard.html
├── style.css
├── index.js
├── dashboard.js
├── firebase.config.js
└── README.md
```

## ⚙️ Installation & Setup

1. Clone this repository:

   ```bash
   git clone nova-todo-app
   ```

2. Open the project folder in VS Code.

3. Create a Firebase project in the Firebase Console.

4. Enable **Firebase Authentication** and configure your preferred sign-in method.

5. Enable **Cloud Firestore Database**.

6. Add your Firebase configuration inside `firebase.config.js`.

7. Run the project using the VS Code Live Server extension.

## 🔥 Firebase Database Structure

### Users Collection

Stores registered user information.

### Todos-list Collection

Each todo document contains:

| Field | Type | Description |
|---|---|---|
| name | String | Todo task name |
| user_uid | String | Firebase user UID |
| created_at | Number | Todo creation timestamp |

## 🎯 Future Improvements

- Mark todos as completed.
- Add task categories.
- Add due dates and reminders.
- Search and filter todos.

## 👨‍💻 Author

**Muzammil Hussain**

- GitHub: Add your GitHub profile link
- Instagram: [@muzammil__hussain2028](https://www.instagram.com/muzammil__hussain2028/)

---

⭐ If you like this project, don't forget to give it a star!
