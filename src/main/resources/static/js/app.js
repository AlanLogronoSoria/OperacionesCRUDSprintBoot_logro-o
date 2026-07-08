const API_BASE = '/peliculas';

const form = document.getElementById('movie-form');
const movieIdInput = document.getElementById('movie-id');
const tituloInput = document.getElementById('titulo');
const directorInput = document.getElementById('director');
const anioInput = document.getElementById('anio');
const btnSubmit = document.getElementById('btn-submit');
const btnUpdate = document.getElementById('btn-update');
const btnClear = document.getElementById('btn-clear');
const formTitle = document.getElementById('form-title');
const tbody = document.getElementById('movies-tbody');
const emptyState = document.getElementById('empty-state');
const confirmDialog = document.getElementById('confirm-dialog');
const confirmDelete = document.getElementById('confirm-delete');
const confirmCancel = document.getElementById('confirm-cancel');

let peliculas = [];
let deleteTargetId = null;

// ==================== INIT ====================

document.addEventListener('DOMContentLoaded', loadPeliculas);

form.addEventListener('submit', handleSubmit);
btnClear.addEventListener('click', resetForm);
confirmCancel.addEventListener('click', closeConfirmDialog);
confirmDelete.addEventListener('click', confirmDeleteMovie);

// ==================== TOAST ====================

function showToast(message, type) {
    const container = document.getElementById('toast-container');

    const toast = document.createElement('div');
    toast.className = 'toast toast-' + type;

    const iconSVG = type === 'success'
        ? '<svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="M22 4L12 14.01l-3-3"/></svg>'
        : '<svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M15 9l-6 6M9 9l6 6"/></svg>';

    toast.innerHTML = iconSVG + '<span>' + message + '</span>';
    container.appendChild(toast);

    setTimeout(function () {
        if (toast.parentNode) {
            toast.remove();
        }
    }, 4000);
}

// ==================== LOAD ====================

function loadPeliculas() {
    fetch(API_BASE)
        .then(function (res) {
            if (!res.ok) throw new Error('Error al cargar películas');
            return res.json();
        })
        .then(function (data) {
            peliculas = data;
            renderTable();
        })
        .catch(function (err) {
            showToast('Error al cargar películas: ' + err.message, 'error');
        });
}

// ==================== RENDER ====================

function renderTable() {
    tbody.innerHTML = '';

    if (peliculas.length === 0) {
        emptyState.style.display = 'block';
        document.getElementById('movies-table').style.display = 'none';
        return;
    }

    emptyState.style.display = 'none';
    document.getElementById('movies-table').style.display = '';

    peliculas.forEach(function (p) {
        var tr = document.createElement('tr');

        tr.innerHTML =
            '<td data-label="ID">' + p.id + '</td>' +
            '<td data-label="Título">' + escapeHtml(p.titulo) + '</td>' +
            '<td data-label="Director">' + escapeHtml(p.director) + '</td>' +
            '<td data-label="Año">' + p.anio + '</td>' +
            '<td data-label="Acciones">' +
                '<div class="col-actions">' +
                    '<button class="btn btn-sm btn-primary btn-icon-only" title="Editar" data-edit="' + p.id + '">' +
                        '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">' +
                            '<path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>' +
                            '<path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>' +
                        '</svg>' +
                    '</button>' +
                    '<button class="btn btn-sm btn-danger btn-icon-only" title="Eliminar" data-delete="' + p.id + '">' +
                        '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">' +
                            '<path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6h14"/>' +
                        '</svg>' +
                    '</button>' +
                '</div>' +
            '</td>';

        tr.querySelector('[data-edit]').addEventListener('click', function () {
            startEdit(p.id);
        });

        tr.querySelector('[data-delete]').addEventListener('click', function () {
            openConfirmDialog(p.id);
        });

        tbody.appendChild(tr);
    });
}

function escapeHtml(text) {
    var div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ==================== CREATE & UPDATE ====================

function handleSubmit(e) {
    e.preventDefault();

    var pelicula = {
        titulo: tituloInput.value.trim(),
        director: directorInput.value.trim(),
        anio: parseInt(anioInput.value, 10)
    };

    if (!pelicula.titulo || !pelicula.director || isNaN(pelicula.anio)) {
        showToast('Por favor complete todos los campos.', 'error');
        return;
    }

    var id = movieIdInput.value;

    if (id) {
        updatePelicula(parseInt(id, 10), pelicula);
    } else {
        createPelicula(pelicula);
    }
}

function createPelicula(pelicula) {
    fetch(API_BASE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pelicula)
    })
        .then(function (res) {
            if (!res.ok) throw new Error('Error al crear película');
            return res.json();
        })
        .then(function (nueva) {
            peliculas.push(nueva);
            renderTable();
            resetForm();
            showToast('Película agregada correctamente.', 'success');
            highlightRow(nueva.id);
        })
        .catch(function (err) {
            showToast('Error: ' + err.message, 'error');
        });
}

function updatePelicula(id, pelicula) {
    fetch(API_BASE + '/' + id, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pelicula)
    })
        .then(function (res) {
            if (!res.ok) throw new Error('Error al actualizar película');
            return res.json();
        })
        .then(function (actualizada) {
            var idx = peliculas.findIndex(function (p) { return p.id === id; });
            if (idx !== -1) {
                peliculas[idx] = actualizada;
            }
            renderTable();
            resetForm();
            showToast('Película actualizada correctamente.', 'success');
            highlightRow(actualizada.id);
        })
        .catch(function (err) {
            showToast('Error: ' + err.message, 'error');
        });
}

// ==================== DELETE ====================

function openConfirmDialog(id) {
    deleteTargetId = id;
    confirmDialog.style.display = '';
}

function closeConfirmDialog() {
    deleteTargetId = null;
    confirmDialog.style.display = 'none';
}

function confirmDeleteMovie() {
    if (deleteTargetId === null) return;

    var id = deleteTargetId;
    closeConfirmDialog();

    fetch(API_BASE + '/' + id, { method: 'DELETE' })
        .then(function (res) {
            if (!res.ok) throw new Error('Error al eliminar película');
            peliculas = peliculas.filter(function (p) { return p.id !== id; });
            renderTable();
            showToast('Película eliminada correctamente.', 'success');
        })
        .catch(function (err) {
            showToast('Error: ' + err.message, 'error');
        });
}

// ==================== EDIT ====================

function startEdit(id) {
    var pelicula = peliculas.find(function (p) { return p.id === id; });
    if (!pelicula) return;

    movieIdInput.value = pelicula.id;
    tituloInput.value = pelicula.titulo;
    directorInput.value = pelicula.director;
    anioInput.value = pelicula.anio;

    btnSubmit.style.display = 'none';
    btnUpdate.style.display = '';
    formTitle.textContent = 'Editar Película';

    tituloInput.focus();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ==================== RESET ====================

function resetForm() {
    form.reset();
    movieIdInput.value = '';
    btnSubmit.style.display = '';
    btnUpdate.style.display = 'none';
    formTitle.textContent = 'Agregar Película';
}

// ==================== HIGHLIGHT ====================

function highlightRow(id) {
    setTimeout(function () {
        var btn = document.querySelector('[data-edit="' + id + '"]');
        if (btn) {
            var tr = btn.closest('tr');
            if (tr) {
                tr.classList.add('row-highlight');
                tr.addEventListener('animationend', function () {
                    tr.classList.remove('row-highlight');
                }, { once: true });
            }
        }
    }, 150);
}
