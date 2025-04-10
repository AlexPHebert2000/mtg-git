import "./App.css";

import { useState } from "react";
import type React from "react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

function App() {
  const [search, setSearch] = useState("");
  const searchMut = useMutation({
    mutationFn: () => {
      return axios.get(`http://localhost:3000/api/card/search?q=${search}`)
    },
  })

  const handleSearchChange = (e : React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const handleSearchClick = (e : React.MouseEvent<HTMLButtonElement>) => {
    searchMut.mutate();
  }

  return (
    <div className="App">
      <input type="text" value={search} onChange={handleSearchChange}></input>
      <button onClick={handleSearchClick}>Search</button>
      <div>
        {searchMut.isSuccess ? 
        <>
          {searchMut.data.data.map((card) => <img style={{height:"300px"}} src={card.img}></img>)}
        </> : 
        <>Waiting</>}
      </div>
    </div>
  );
}

export default App;
 