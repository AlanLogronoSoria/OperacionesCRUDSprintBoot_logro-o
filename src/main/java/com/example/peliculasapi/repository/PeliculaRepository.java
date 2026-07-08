package com.example.peliculasapi.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.peliculasapi.model.Pelicula;

public interface PeliculaRepository extends JpaRepository<Pelicula, Integer> {

}