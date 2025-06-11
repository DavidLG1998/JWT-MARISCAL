// Verificar en qué página estamos
if (document.getElementById('loginForm')) {
    // Lógica para login
    document.getElementById('loginForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        const response = await fetch('/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();

        if (data.auth) {
            // Guardar token en localStorage
            localStorage.setItem('token', data.token);
            // Ir al dashboard
            window.location.href = 'dashboard.html';
        } else {
            // Mostrar mensaje de error que viene del backend
            document.getElementById('message').innerText = data.message || 'Error al iniciar sesión.';
        }
    });
}

if (document.getElementById('studentForm')) {
    // Lógica para dashboard
    const token = localStorage.getItem('token');

    if (!token) {
        window.location.href = 'index.html'; // No hay token, regresar al login
    }

    // Cargar estudiantes
    async function loadStudents() {
        const response = await fetch('/students', {
            headers: { 'x-access-token': token }
        });
        const students = await response.json();

        const studentList = document.getElementById('studentList');
        studentList.innerHTML = '';
        students.forEach(student => {
            const li = document.createElement('li');
            li.textContent = `${student.name} - ${student.grade} - Sección ${student.section}`;
            studentList.appendChild(li);
        });
    }

    loadStudents();

    // Registrar nuevo estudiante
    document.getElementById('studentForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('name').value;
        const grade = document.getElementById('grade').value;
        const section = document.getElementById('section').value;

        await fetch('/students/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-access-token': token
            },
            body: JSON.stringify({ name, grade, section })
        });

        // Limpiar formulario y recargar lista
        document.getElementById('studentForm').reset();
        loadStudents();
    });

    // Cerrar sesión
    document.getElementById('logout').addEventListener('click', () => {
        localStorage.removeItem('token');
        window.location.href = 'index.html';
    });
}
