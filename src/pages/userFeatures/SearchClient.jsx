import React, { useState, useEffect } from "react";
import axios from "@/api/axios";
import Logo from "../../images/logo.svg";
import { CSSTransition } from "react-transition-group";
import useDebounce from "./useDebounce"; // Custom hook for debouncing

function SearchClient({
  searchClient,
  setSearchClient,
  setIsVisible,
  setSearch,
}) {
  const [inProp, setInProp] = useState(true);
  const [clients, setClients] = useState([]);
  const debouncedSearchClient = useDebounce(searchClient, 300);

  useEffect(() => {
    axios
      .get("/get-clients")
      .then((res) => {
        console.log(res.data); // Log the response data
        if (res.data.success) {
          setClients(res.data.clients);
        } else {
          alert("Error fetching clients");
        }
      })
      .catch((error) => {
        console.error("Error fetching clients:", error);
        alert("Error fetching clients");
      });
  }, []);

  const filterClients = () => {
    return clients.filter((client) =>
      client.client_name
        .toLowerCase()
        .includes(debouncedSearchClient.toLowerCase())
    );
  };

  const handleClick = () => {
    setInProp(false);
    setTimeout(() => setIsVisible(false), 500); // same duration as your transition
    setSearch(true);
  };

  return (
    <CSSTransition in={inProp} timeout={500} classNames="my-node">
      <div className="my-node flex flex-col justify-center items-center py-8">
        <img src={Logo} alt="Logo" className="w-72 h-36" />
        <div className="relative flex flex-col items-center justify-center">
          <input
            type="text"
            placeholder="Input Client Name"
            className="w-96 h-12 px-4 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500"
            value={searchClient}
            onChange={(e) => {
              setSearchClient(e.target.value);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleClick();
              }
            }}
          />
          {searchClient && (
            <ul className="absolute top-10 w-96 border border-gray-300 rounded-lg mt-2 bg-white z-10">
              {filterClients().map((client, index) => (
                <li
                  key={index}
                  className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
                  onClick={() => {
                    setSearchClient(client.client_name);
                    handleClick();
                  }}
                >
                  {client.client_name}
                </li>
              ))}
            </ul>
          )}
          <button
            className="h-10 w-32 flex justify-center px-6 mt-4 text-white bg-blue-500 rounded-lg hover:bg-blue-600"
            onClick={handleClick}
          >
            <span className="text-center mt-auto mb-auto">Search</span>
          </button>
        </div>
      </div>
    </CSSTransition>
  );
}

export default SearchClient;
