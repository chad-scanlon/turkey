import React, { useEffect, useState } from "react";

import "./App.css";
import axios from "axios";
import axiosWithAuth from "./utils/axiosWithAuth";

function App() {
    const [players, setPlayers] = useState([]);
    useEffect(() => {
        axiosWithAuth()
            .get("/users")
            .then((res) => {
                console.log(res);
                setPlayers(res.data);
            });
    }, []);
    return (
        <div className="App">
            <header className="App-header">
                <h2>Team Wally</h2>
                <h2>Team Chad</h2>
                <h3>Players</h3>
            </header>
        </div>
    );
}

export default App;
