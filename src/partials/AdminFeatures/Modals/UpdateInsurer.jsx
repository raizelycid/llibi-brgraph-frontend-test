import React, { useState, useEffect } from "react";
import axios from "@/api/axios";

function UpdateInsurer(props) {
  const [selectedInsurer, setSelectedInsurer] = useState(null);
  const insurers = [
    { id: 1, name: "Philcare" },
    { id: 2, name: "Maxicare" },
    { id: 3, name: "Medicard" },
    { id: 4, name: "Intellicare" },
  ];

  const handleInsurerChange = (e) => {
    setSelectedInsurer(Number(e.target.value));
  };

  const handleSubmitInsurer = () => {
    props.setLoading(true);
    axios
      .post("/update-client-insurer", {
        id: props.id,
        insurer_id: selectedInsurer,
      })
      .then((res) => {
        if (res.data.success) {
          props.setClients((prev) => {
            return prev.map((client) => {
              if (client.id === props.id) {
                console.log(client);
                return { ...client, insurer_id: selectedInsurer };
              }
              return client;
            });
          });
          
        }
      })
      .catch((err) => {
        console.log(err);
        alert(
          "Failed to update insurer. Refresh the page or Contact MIS Department"
        );
      })
      .finally(() => {
        props.setLoading(false);
        props.setModalOpen(false);
      });
  };

  const resetSelectedInsurer = () => {
    setSelectedInsurer(null);
  };

  useEffect(() => {
    resetSelectedInsurer();
    setSelectedInsurer(props.insurer_id);
  }, [props.insurer_id]);

  return (
    <div className="p-6 flex flex-col gap-4 items-center justify-center">
      <div>
        <h3>{props.name}</h3>
      </div>
      <div className="border w-full"></div>
      <div className="flex flex-row gap-4">
        {insurers.map((insurer) => {
          return (
            <div key={insurer.id}>
              <input
                type="radio"
                name="insurer"
                value={insurer.id}
                id={insurer.id}
                checked={selectedInsurer === insurer.id}
                onChange={handleInsurerChange}
              />{" "}
              <label htmlFor={insurer.id}>{insurer.name}</label>
            </div>
          );
        })}
      </div>
      <div className="border w-full"></div>
      <button
        className="btn bg-indigo-500 hover:bg-indigo-600 text-white"
        onClick={handleSubmitInsurer}
      >
        Update Insurer
      </button>
    </div>
  );
}

export default UpdateInsurer;
