package com.example.peliculasapi.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.peliculasapi.model.Pelicula;
import com.example.peliculasapi.service.PeliculaService;

@RestController
@RequestMapping("/peliculas")
public class PeliculaController {

    @Autowired
    private PeliculaService service;

    // GET /peliculas
    @GetMapping
    public List<Pelicula> obtenerPeliculas() {
        return service.obtenerPeliculas();
    }

    // GET /peliculas/1
    @GetMapping("/{id}")
    public Pelicula obtenerPorId(@PathVariable Integer id) {
        return service.obtenerPorId(id);
    }

    // POST /peliculas
    @PostMapping
    public Pelicula guardar(@RequestBody Pelicula pelicula) {
        return service.guardar(pelicula);
    }

    // PUT /peliculas/1
    @PutMapping("/{id}")
    public Pelicula actualizar(@PathVariable Integer id,
                               @RequestBody Pelicula pelicula) {

        return service.actualizar(id, pelicula);
    }

    // DELETE /peliculas/1
    @DeleteMapping("/{id}")
    public String eliminar(@PathVariable Integer id) {

        boolean eliminado = service.eliminar(id);

        if (eliminado) {
            return "Película eliminada correctamente.";
        }

        return "No existe una película con ese ID.";
    }
}