document.addEventListener('DOMContentLoaded', () => {
    const usersList = document.getElementById('usersList');
    const addUserForm = document.getElementById('addUserForm');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');

    // Function to fetch all users
    const fetchUsers = async () => {
        try {
            const response = await fetch('/api/users');
            if (!response.ok) throw new Error('Network response was not ok');
            const users = await response.json();
            usersList.innerHTML = '';
            users.forEach(user => {
                const li = document.createElement('li');
                li.innerHTML = `
                    ${user.name} (${user.email})
                    <button class="update" data-id="${user.id}">Update</button>
                    <button class="delete" data-id="${user.id}">Delete</button>
                `;
                usersList.appendChild(li);
            });
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    // Fetch users on load
    fetchUsers();

    // Add user
    addUserForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const newUser = {
            name: nameInput.value,
            email: emailInput.value
        };
        try {
            const response = await fetch('/api/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newUser)
            });
            if (!response.ok) throw new Error('Network response was not ok');
            const user = await response.json();
            console.log('User added:', user);
            nameInput.value = '';
            emailInput.value = '';
            fetchUsers();
        } catch (error) {
            console.error('Error adding user:', error);
        }
    });

    // Delete user
    usersList.addEventListener('click', async (e) => {
        if (e.target.classList.contains('delete')) {
            const id = e.target.dataset.id;
            try {
                const response = await fetch(`/api/users/${id}`, {
                    method: 'DELETE'
                });
                if (!response.ok) throw new Error('Network response was not ok');
                fetchUsers();
            } catch (error) {
                console.error('Error deleting user:', error);
            }
        }
    });

    // Update user
    usersList.addEventListener('click', async (e) => {
        if (e.target.classList.contains('update')) {
            const id = e.target.dataset.id;
            const name = prompt('Enter new name:');
            const email = prompt('Enter new email:');
            if (name && email) {
                try {
                    const response = await fetch(`/api/users/${id}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ name, email })
                    });
                    if (!response.ok) throw new Error('Network response was not ok');
                    fetchUsers();
                } catch (error) {
                    console.error('Error updating user:', error);
                }
            }
        }
    });
});
