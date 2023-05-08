/** @format */

import React, { useEffect, useState } from "react";
import HOC from "../layout/HOC";
import { Alert, Button, Form, Modal, Table } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const DeliveryPartner = () => {
  const [data, setData] = useState([]);
  const [id, setId] = useState("");
  const [modalShow, setModalShow] = useState(false);
  const navigate = useNavigate();
  const fetchData = async () => {
    try {
      const { data } = await axios.get(
        "https://6nkuu0ytgg.execute-api.ap-south-1.amazonaws.com/dev//api/v1/driver/alldriver"
      );
      setData(data);
      console.log(data)
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const deleteHandler = async (id) => {
    try {
      const { data } = await axios.delete(
        `https://6nkuu0ytgg.execute-api.ap-south-1.amazonaws.com/dev//api/v1/driver/${id}`
      );
      console.log(data);
      alert("Deleted");
      fetchData();
    } catch (e) {
      console.log(e);
    }
  };

  function MyVerticallyCenteredModal(props) {
    const [status, setStatus] = useState("");

    const postHandler = async (e) => {
      e.preventDefault();
      try {
        const { data } = await axios.post(
          `https://6nkuu0ytgg.execute-api.ap-south-1.amazonaws.com/dev//api/v1/driver/status/${id}`,
          {
            status,
          }
        );
        console.log(data);
        fetchData();
        alert("Edited");
        props.onHide();
      } catch (e) {
        console.log(e);
      }
    };

    return (
      <Modal
        {...props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Edit Status
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={postHandler}>
            <Form.Select
              aria-label="Default select example"
              className="mb-3"
              onChange={(e) => setStatus(e.target.value)}
            >
              <option>Open this select menu</option>
              <option value="Approve">Approve</option>
              <option value="Disapprove">Disapprove</option>
            </Form.Select>

            <Button variant="outline-success" type="submit">
              Submit{" "}
            </Button>
          </Form>
        </Modal.Body>
        <Modal.Footer></Modal.Footer>
      </Modal>
    );
  }

  return (
    <>
      <MyVerticallyCenteredModal
        show={modalShow}
        onHide={() => setModalShow(false)}
      />

      <section>
        <div className="pb-4 sticky top-0  w-full flex justify-between items-center bg-white">
          <span className="tracking-widest text-slate-900 font-semibold uppercase ">
            All Delivery Partner's ( Total : {data?.message?.length})
          </span>
        </div>

        {data?.message?.length === 0 || !data
        
        ? <Alert >No Data Found</Alert> : 
          } 

   
      </section>
    </>
  );
};

export default HOC(DeliveryPartner);
