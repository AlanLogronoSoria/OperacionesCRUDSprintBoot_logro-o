package com.example.peliculasapi.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.peliculasapi.model.Pelicula;
import com.example.peliculasapi.repository.PeliculaRepository;

@Service
public class PeliculaService {

    @Autowired
    private PeliculaRepository repository;

    // Obtener todas las películas
    public List<Pelicula> obtenerPeliculas() {
        return repository.findAll();
    }

    // Obtener una película por ID
    public Pelicula obtenerPorId(Integer id) {
        return repository.findById(id).orElse(null);
    }

    // Crear una nueva película
    public Pelicula guardar(Pelicula pelicula) {
        return repository.save(pelicula);
    }

    // Actualizar una película existente
    public Pelicula actualizar(Integer id, Pelicula pelicula) {

        Pelicula existente = repository.findById(id).orElse(null);

        if (existente != null) {
            existente.setTitulo(pelicula.getTitulo());
            existente.setDirector(pelicula.getDirector());
            existente.setAnio(pelicula.getAnio());

            return repository.save(existente);
        }

        return null;
    }

    // Eliminar una película
    public boolean eliminar(Integer id) {

        if (repository.existsById(id)) {
            repository.deleteById(id);
            return true;
        }

        return false;
    }
}