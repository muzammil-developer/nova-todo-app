import {
  getDoc,
  doc,
  addDoc,
  collection,
  getDocs,
  query,
  where,
  deleteDoc,
} from "https://www.gstatic.com/firebasejs/13.1.0/firebase-firestore.js";

import { db, auth } from "./firebase.config.js";

import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/13.1.0/firebase-auth.js";

let userLoggedIn;

onAuthStateChanged(auth, async (user) => {
  if (user?.uid) {
    const dbUser = await getDoc(doc(db, "users", user.uid));
    const dbUserData = dbUser.data();

    userLoggedIn = {
      ...dbUserData,
      uid: user.uid
    };

    document.getElementById("greeting-text").innerHTML =
      `Welcome! ${dbUserData.email}`;

    getTodos();
  }
});

const addTodo = async (e) => {
  e.preventDefault();

  const todoValue = document.getElementById("todo-input");

  try {
    console.log(userLoggedIn, "userLoggedInuserLoggedIn");

    // Add a new document with a generated id.
    const docRef = await addDoc(collection(db, "todos-list"), {
      name: todoValue.value,
      user_uid: userLoggedIn.uid,
      created_at: Date.now()
    });

    todoValue.value = "";

    console.log("Document written with ID: ", docRef.id);

    getTodos();
  } catch (err) { }
};

const getTodos = async () => {
  try {
    const todos = document.getElementById("todos-list");
    todos.innerHTML = '';

    const q = query(
      collection(db, "todos-list"),
      where("user_uid", "==", userLoggedIn.uid),
    );

    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      todos.innerHTML = `
        <li class="list-group-item text-center text-secondary">
          No todos added yet.
        </li>
      `;
      return;
    }

    querySnapshot.forEach((doc) => {
      console.log(doc.id, " => ", doc.data());

      const todoData = doc.data();

      todos.innerHTML += `
        <li class="list-group-item d-flex justify-content-between align-items-center">
          ${todoData.name}

          <button
            class="btn btn-danger btn-sm"
            onclick="deleteTodo('${doc.id}')">
            Delete
          </button>
        </li>
      `;
    });

  } catch (err) {
    console.log(err);
  }
};


// Delete Todo
const deleteTodo = async (todoId) => {
  try {
    await deleteDoc(doc(db, "todos-list", todoId));

    getTodos();
  } catch (err) {
    console.log(err);
  }
};

window.deleteTodo = deleteTodo;

document.getElementById("todo-btn")?.addEventListener("click", addTodo);