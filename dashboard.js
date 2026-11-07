import {
    getDoc,
    doc,
    addDoc,
    collection,
    getDocs,
    query,
    where,
    deleteDoc,
    updateDoc
} from "https://www.gstatic.com/firebasejs/13.1.0/firebase-firestore.js";

import { db, auth } from "./firebase.config.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/13.1.0/firebase-auth.js";


let userLoggedIn = null;

const todoForm = document.getElementById("todo-form");
const todoInput = document.getElementById("todo-input");
const todoButton = document.getElementById("todo-btn");
const todosList = document.getElementById("todos-list");
const todoCount = document.getElementById("todo-count");
const greetingText = document.getElementById("greeting-text");


// Authentication

onAuthStateChanged(auth, async (user) => {

    if (user?.uid) {

        try {

            const userRef = doc(db, "users", user.uid);
            const dbUser = await getDoc(userRef);

            if (dbUser.exists()) {

                const dbUserData = dbUser.data();

                userLoggedIn = {
                    ...dbUserData,
                    uid: user.uid
                };

                greetingText.textContent =
                    `Welcome, ${dbUserData.username || "User"}!`;

                await getTodos();

            } else {

                console.log("User document not found!");

            }

        } catch (err) {

            console.error("Error:", err);

        }

    } else {

        window.location.href = "index.html";

    }

});


// Add Todo

const addTodo = async (e) => {

    e.preventDefault();

    if (!userLoggedIn) return;

    const todoValue = todoInput.value.trim();

    if (!todoValue) return;

    todoButton.disabled = true;

    todoButton.innerHTML = `
        <span class="spinner-border spinner-border-sm me-2"></span>
        Adding...
    `;

    try {

        await addDoc(collection(db, "todos-list"), {

            name: todoValue,

            user_uid: userLoggedIn.uid,

            created_at: Date.now()

        });

        todoInput.value = "";

        await getTodos();

    } catch (err) {

        console.error(err);

        alert("Unable to add task. Please try again.");

    } finally {

        todoButton.disabled = false;

        todoButton.innerHTML = `
            <i class="bi bi-plus-lg me-1"></i>
            Add Task
        `;

    }

};


// Get Todos

const getTodos = async () => {

    if (!userLoggedIn) return;

    try {

        todosList.innerHTML = "";

        const q = query(
            collection(db, "todos-list"),
            where("user_uid", "==", userLoggedIn.uid)
        );

        const querySnapshot = await getDocs(q);

        const totalTodos = querySnapshot.size;

        todoCount.textContent =
            `${totalTodos} ${totalTodos === 1 ? "Task" : "Tasks"}`;


        if (querySnapshot.empty) {

            todosList.innerHTML = `

                <div class="empty-state">

                    <i class="bi bi-clipboard-check fs-1"></i>

                    <h6 class="fw-bold mt-3 text-dark">
                        No tasks yet!
                    </h6>

                    <p class="small mb-0">
                        Start by adding your first task above.
                    </p>

                </div>

            `;

            return;

        }


        const sortedTodos = [...querySnapshot.docs].sort(
            (a, b) => (b.data().created_at || 0) -
                      (a.data().created_at || 0)
        );


        sortedTodos.forEach((todoDoc) => {

            const todoData = todoDoc.data();

            const todoItem = document.createElement("div");

            todoItem.className = "todo-item";


            // Left Content

            const leftContent = document.createElement("div");

            leftContent.className =
                "d-flex align-items-center gap-3 flex-grow-1";


            const icon = document.createElement("div");

            icon.className =
                "bg-primary bg-opacity-10 rounded-3 p-2 text-primary";

            icon.innerHTML = `
                <i class="bi bi-check2-circle fs-5"></i>
            `;


            const todoName = document.createElement("span");

            todoName.className = "todo-name";

            todoName.textContent = todoData.name;


            leftContent.append(icon, todoName);


            // Action Buttons

            const actionButtons = document.createElement("div");

            actionButtons.className =
                "d-flex align-items-center gap-2 flex-shrink-0";


            // Edit Button

            const editButton = document.createElement("button");

            editButton.className =
                "btn btn-outline-primary btn-sm";

            editButton.innerHTML = `
                <i class="bi bi-pencil-square me-1"></i>
                Edit
            `;

            editButton.addEventListener("click", () => {

                editTodo(todoDoc.id, todoData.name, todoItem, todoName, actionButtons);

            });


            // Delete Button

            const deleteButton = document.createElement("button");

            deleteButton.className =
                "btn btn-outline-danger btn-sm delete-btn";

            deleteButton.innerHTML = `
                <i class="bi bi-trash3 me-1"></i>
                Delete
            `;

            deleteButton.addEventListener("click", () => {

                deleteTodo(todoDoc.id, deleteButton);

            });


            actionButtons.append(editButton, deleteButton);

            todoItem.append(leftContent, actionButtons);

            todosList.appendChild(todoItem);

        });


    } catch (err) {

        console.error(err);

        todosList.textContent = "Something went wrong.";

    }

};


// Edit Todo

const editTodo = (
    todoId,
    oldName,
    todoItem,
    todoName,
    actionButtons
) => {

    // Editable Input

    const editInput = document.createElement("input");

    editInput.type = "text";

    editInput.className = "form-control";

    editInput.value = oldName;

    editInput.maxLength = 250;

    editInput.required = true;


    // Save Button

    const saveButton = document.createElement("button");

    saveButton.className = "btn btn-success btn-sm";

    saveButton.innerHTML = `
        <i class="bi bi-check-lg me-1"></i>
        Save
    `;


    // Cancel Button

    const cancelButton = document.createElement("button");

    cancelButton.className = "btn btn-outline-secondary btn-sm";

    cancelButton.innerHTML = `
        <i class="bi bi-x-lg me-1"></i>
        Cancel
    `;


    // Replace Todo Text With Input

    todoName.replaceWith(editInput);

    actionButtons.replaceChildren(saveButton, cancelButton);

    editInput.focus();


    // Cancel Editing

    cancelButton.addEventListener("click", () => {

        todoItem.querySelector(".todo-name")?.remove();

        getTodos();

    });


    // Save Updated Todo

    saveButton.addEventListener("click", async () => {

        const updatedName = editInput.value.trim();

        if (!updatedName) {

            alert("Todo cannot be empty.");

            editInput.focus();

            return;

        }

        if (updatedName.length > 250) {

            alert("Todo cannot exceed 250 characters.");

            return;

        }

        if (updatedName === oldName) {

            await getTodos();

            return;

        }


        saveButton.disabled = true;

        cancelButton.disabled = true;

        saveButton.innerHTML = `
            <span class="spinner-border spinner-border-sm me-1"></span>
            Saving...
        `;


        try {

            // Get Existing Todo Document

            const todoRef = doc(db, "todos-list", todoId);

            const todoSnapshot = await getDoc(todoRef);


            // Verify Todo Ownership

            if (!todoSnapshot.exists()) {

                alert("This task no longer exists.");

                await getTodos();

                return;

            }

            const existingTodo = todoSnapshot.data();

            if (existingTodo.user_uid !== userLoggedIn.uid) {

                alert("You are not allowed to edit this task.");

                await getTodos();

                return;

            }


            // Update Existing Firestore Document

            await updateDoc(todoRef, {

                name: updatedName

            });


            // Refresh Todo List

            await getTodos();


        } catch (err) {

            console.error("Edit Error:", err);

            alert("Unable to update task. Please try again.");

            saveButton.disabled = false;

            cancelButton.disabled = false;

            saveButton.innerHTML = `
                <i class="bi bi-check-lg me-1"></i>
                Save
            `;

        }

    });

};


// Delete Todo

const deleteTodo = async (todoId, button) => {

    try {

        button.disabled = true;

        button.innerHTML = `
            <span class="spinner-border spinner-border-sm"></span>
        `;


        // Verify Ownership Before Deleting

        const todoRef = doc(db, "todos-list", todoId);

        const todoSnapshot = await getDoc(todoRef);

        if (
            !todoSnapshot.exists() ||
            todoSnapshot.data().user_uid !== userLoggedIn.uid
        ) {

            alert("You are not allowed to delete this task.");

            await getTodos();

            return;

        }


        await deleteDoc(todoRef);

        await getTodos();


    } catch (err) {

        console.error(err);

        alert("Unable to delete task.");

        button.disabled = false;

        button.innerHTML = `
            <i class="bi bi-trash3 me-1"></i>
            Delete
        `;

    }

};


// Form Event

todoForm?.addEventListener("submit", addTodo);
