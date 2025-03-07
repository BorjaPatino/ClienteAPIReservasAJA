////////////// EJECUCIÓN AL INICIO /////////////////
obtenerReservas();

// Configurar la fecha mínima en fechaReserva
document.addEventListener("DOMContentLoaded", () => {
    const fechaReserva = document.getElementById("fechaReserva");
    fechaReserva.removeAttribute("min");
});


////////////// MANEJADORES DE EVENTOS //////////////

// Cargar reservas
document.getElementById("cargarReservasBtn").addEventListener("click", obtenerReservas);

// Crear nueva reserva
document.getElementById("nuevaReservaBtn").addEventListener("click", nuevaReserva);

// Validar fecha seleccionada
document.getElementById("fechaReserva").addEventListener("input", function () {
    const fechaSeleccionada = this.value;
    const hoy = new Date().toISOString().split("T")[0];

    if (fechaSeleccionada < hoy) {
        alert("No puedes seleccionar una fecha pasada.");
        this.value = hoy; // Restablecer la fecha al valor actual
    }
});

// Abrir el modal de creación de reservas
const addReservaDialog = document.getElementById("nuevaReservaDialog");
document.getElementById("openDialogAddReservaBtn").addEventListener("click", () => {
    addReservaDialog.showModal();
});

// Cerrar el modal de creación de reservas
document.getElementById('cancelReservaBtn').addEventListener("click", () => {
    addReservaDialog.close();
});

/////////////// MÉTODOS ASÍNCRONOS (AJAX) //////////////
/////////////// MÉTODOS ASÍNCRONOS (AJAX) //////////////
async function obtenerReservas() {
    try {
        const token = localStorage.getItem("token");
        if (!token) {
            throw new Error("No hay token, inicia sesión.");
        }

        const response = await fetch("http://localhost:8080/mis_reservas", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        if (!response.ok) {
            throw new Error("Error al obtener las reservas");
        }

        const reservas = await response.json();
        console.log("Reservas obtenidas:", reservas);

        const tableBody = document.getElementById("tableBody");
        tableBody.innerHTML = "";

        reservas.forEach(reserva => {
            const row = document.createElement("tr");

            const numeroPersonas = reserva.numeroPersonas || "No especificado";

            row.innerHTML = `
                <td>${reserva.nombreCliente}</td>
                <td>${reserva.fechaReserva}</td>
                <td>${reserva.horaReserva}</td>
                <td>${reserva.numeroMesa}</td>
                <td>${reserva.descripcionMesa}</td>
                <td>${numeroPersonas}</td>
                <td>
                    <button class="btn btn-danger btn-sm" onclick="borrarReserva(${reserva.id}, this)">Eliminar</button>
                </td>
            `;

            tableBody.appendChild(row);
        });

    } catch (error) {
        console.error("Error:", error);
    }
}

async function borrarReserva(id, button) {
    try {
        const token = localStorage.getItem("token");
        if (!token) {
            alert("No hay token, inicia sesión.");
            return;
        }

        console.log(` Intentando borrar reserva con ID: ${id}`);
        console.log(` Enviando DELETE a: http://localhost:8080/reservas/delete/${id}`);
        console.log(`Token:`, token);

        const response = await fetch(`http://localhost:8080/reservas/delete/${id}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        if (!response.ok) {
            const errorMessage = await response.text();
            throw new Error(`Error al borrar la reserva: ${errorMessage}`);
        }

        // Si la reserva se borra con éxito, eliminar la fila de la tabla
        button.closest("tr").remove();
        console.log("Reserva eliminada con éxito.");
    } catch (error) {
        console.error("Error:", error);
        alert(error.message);
    }
}



async function nuevaReserva() {
    const fecha = document.getElementById("fechaReserva").value;
    const hora = document.getElementById("horaReserva").value;
    const mesaId = document.getElementById("mesaReserva").value;
    const numeroPersonas = document.getElementById("numeroPersonasReserva").value;

    if (!fecha || !hora || !mesaId || !numeroPersonas) {
        alert("Por favor, completa todos los campos antes de guardar la reserva.");
        return;
    }

    const reserva = {
        fecha: fecha,
        hora: hora,
        mesa: { id: mesaId },
        numeroPersonas: parseInt(numeroPersonas)
    };

    console.log("Enviando reserva:", reserva); // Depuración

    try {
        const response = await fetch("http://localhost:8080/reservas/add", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem("token")}`
            },
            body: JSON.stringify(reserva)
        });

        if (!response.ok) {
            throw new Error("Error al insertar la reserva");
        }

        console.log("✅ Reserva creada con éxito.");

        // Actualizar la lista de reservas
        obtenerReservas();
        document.getElementById("nuevaReservaDialog").close();
    } catch (error) {
        console.error("Error al crear la reserva:", error);
        alert("Hubo un problema al crear la reserva.");
    }
}




// Verificar si el usuario ha iniciado sesión
window.onload = function() {
    const token = localStorage.getItem("token");
    if (!token) {
        alert("Debes iniciar sesión primero.");
        window.location.href = "index.html";
    }
};

document.getElementById("fechaReserva").addEventListener("change", obtenerMesasDisponibles);
document.getElementById("horaReserva").addEventListener("change", obtenerMesasDisponibles);

async function obtenerMesasDisponibles() {
    const fecha = document.getElementById("fechaReserva").value;
    const hora = document.getElementById("horaReserva").value;

    if (!fecha || !hora) return;

    try {
        const response = await fetch(`http://localhost:8080/mesas/disponibles?fecha=${fecha}&hora=${hora}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            }
        });

        if (!response.ok) {
            throw new Error("Error al obtener las mesas disponibles");
        }

        const mesas = await response.json();

        // Llenar el select de mesas
        const selectMesas = document.getElementById("mesaReserva");
        selectMesas.innerHTML = "";

        mesas.forEach(mesa => {
            const option = document.createElement("option");
            option.value = mesa.id;
            option.textContent = `Mesa ${mesa.numero} - ${mesa.descripcion}`;
            selectMesas.appendChild(option);
        });

    } catch (error) {
        console.error("Error:", error);
    }
}

document.getElementById("logoutBtn").addEventListener("click", function () {
    localStorage.removeItem("token");
    window.location.href = "index.html";
});

