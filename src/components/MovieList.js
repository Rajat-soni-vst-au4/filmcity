import React from 'react';
import Movie from "./Movie";
import classes from './MovieList.module.css';

const MovieList = (props) => {
  const deleteMovieHandler = (id) => {
    props.onDeleteMovie(id);
  };

  return (
    <ul className={classes['movies-list']}>
      {props.movies.map((movie) => (
        <Movie
          key={movie.id}
          title={movie.title}
          releaseDate={movie.releaseDate}
          openingText={movie.openingText}
          onDeleteMovie={deleteMovieHandler}
          movie={movie} // Pass the movie prop
        />
      ))}
    </ul>
  );
};

export default MovieList;
