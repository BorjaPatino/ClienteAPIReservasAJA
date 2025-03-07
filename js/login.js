console.log("login.js cargado correctamente.");

async function login() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    try {
        const response = await fetch("http://localhost:8080/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ username, password })
        });

        if (!response.ok) {
            alert("Usuario o contraseña incorrectos");
            throw new Error("Error en la autenticación");
        }

        const data = await response.json();
        localStorage.setItem("token", data.token);
        localStorage.setItem("email", data.email);

        location.href = "reservas.html";
    } catch (error) {
        console.error("Error:", error);
    }
}


document.getElementById("loginBtn").addEventListener("click", login);

//registro
document.getElementById("showRegisterModal").addEventListener("click", () => {
    var myModal = new bootstrap.Modal(document.getElementById("registerModal"));
    myModal.show();
});

//registro
document.getElementById("registerForm").addEventListener("submit", async (e) => {
    e.preventDefault(); // Evitar que se recargue la página al enviar el formulario

    const username = document.getElementById("registerUsername").value;
    const email = document.getElementById("registerEmail").value;
    const password = document.getElementById("registerPassword").value;
    const telefono = document.getElementById("registerTelefono").value;
    const foto = "";

    try {
        const response = await fetch("http://localhost:8080/auth/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username: username,
                email: email,
                password: password,
                telefono: telefono,
                foto: foto
            })
        });

        if (!response.ok) {
            throw new Error("Error en el registro");
        }

        const data = await response.json();
        alert("Registro exitoso. ¡Puedes iniciar sesión!");
        // Cerrar el modal
        var myModal = new bootstrap.Modal(document.getElementById("registerModal"));
        myModal.hide();
    } catch (error) {
        console.error("Error:", error);
        alert("Hubo un problema con el registro.");
    }
});

