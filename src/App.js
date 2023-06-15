import React, { useState,useEffect,useCallback } from 'react';
import MovieList from './components/MovieList';
import './App.css';
import AddMovie from './components/AddMovie';

function App() {
  const [movies, setMovies] = useState([]);
  const [isLoading,setIsLoading]=useState(false);
  const [error,setError]=useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const [retryTimer, setRetryTimer] = useState(null);

  

 const fetchMovieHandler=useCallback(async()=> {
  setIsLoading(true)
  setError(null);
  try{
   const response= await fetch('https://react-4961b-default-rtdb.firebaseio.com/movies.json')
   if(!response.ok){
    throw new Error("Something went wrong ....Retrying!")
  }
    const data= await response.json();
      
      const loadedMovies=[];
      for(const key in data){
        loadedMovies.push({
          id:key,
          title:data[key].title,
          openingText:data[key].openingText,
          releaseDate:data[key].releaseDate,

        })
      }
      
        setMovies(loadedMovies);
        
      }catch(error){
        setError(error.message)
        // Retry logic
      const timer = setTimeout(fetchMovieHandler, 1000);
      setRetryTimer(timer);
      setRetryCount((prevRetryCount) => prevRetryCount + 1);
      }
      setIsLoading(false);

 },[]);
  useEffect(()=>{
        fetchMovieHandler()
  },[fetchMovieHandler]); 
  const deleteMovieHandler = async (movieId) => {
    try {
      const response = await fetch(
        `https://react-4961b-default-rtdb.firebaseio.com/movies/${movieId}.json`,
        {
          method: 'DELETE',
        }
      );
      if (!response.ok) {
        throw new Error('Something went wrong while deleting the movie!');
      }
      setMovies((prevMovies) =>
        prevMovies.filter((movie) => movie.id !== movieId)
      );
    } catch (error) {
      setError(error.message);
    }
  };

  async function addMovieHandler(movie) {
    try {
      const response = await fetch(
        'https://react-4961b-default-rtdb.firebaseio.com/movies.json',
        {
          method: 'POST',
          body: JSON.stringify(movie),
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      if (!response.ok) {
        throw new Error('Something went wrong while adding the movie!');
      }
      const data = await response.json();
      console.log(data);
    } catch (error) {
      setError(error.message);
    }
  }

 
  // useEffect(() => {
  //   if (retryCount === 0) return; // Skip initial retry

  //   return () => {
  //     clearTimeout(retryTimer); // Clear retry timer when component unmounts
  //   };
  // }, [retryCount, retryTimer]);

  function cancelRetryHandler() {
    clearTimeout(retryTimer);
    setRetryCount(0);
  }

  let content =<p>found no movies.</p>
  if(movies.length>0){
    content=<MovieList movies={movies} onDeleteMovie={deleteMovieHandler} />
  }
  if(error){
    content=<p>{error}</p>
  }
  if(isLoading){
    content =<p>Loading....</p>
  }

  return (
    <React.Fragment>
      <section>
        <AddMovie onAddMovie={addMovieHandler}/>
      </section>
      <section>
        <button onClick={fetchMovieHandler} disabled={isLoading}>Fetch Movies</button>
        <button onClick={cancelRetryHandler} disabled={!retryCount || isLoading}>Cancel</button>
      </section>
      <section>
         {/* {!isLoading && movies.length>0 && <MovieList movies={movies} />}
         {!isLoading && movies.length==0 && !error && <p>Found no movies</p>}
         {!isLoading && <p>{error}</p>}
         {isLoading && <p>Loading....</p>} */}
          {content}
         </section>
    </React.Fragment>
  );
}

export default App;