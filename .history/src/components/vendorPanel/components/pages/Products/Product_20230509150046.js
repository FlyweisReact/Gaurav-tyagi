/** @format */
import React, { useEffect, useRef, useState } from "react";
import HOC from "../../layout/HOC";
import Table from "react-bootstrap/Table";
import OwlCarousel from "react-owl-carousel2";
import "react-owl-carousel2/lib/styles.css";
import { Button, FloatingLabel, Form, Modal , Spinner } from "react-bootstrap";
import axios from "axios";
import { toast } from "react-toastify";

const Product = () => {
  const [modalShow, setModalShow] = React.useState(false);
  const [data, setData] = useState([]);
  const token = localStorage.getItem("token");

  // Owl Carousel
  const carouselRef = useRef(null);
  const options = {
    items: 1,
    nav: false,
    rewind: true,
    autoplay: true,
    autoplayTimeout: 5000,
    autoplayHoverPause: true,
    onInitialized: () => {
      const carousel = carouselRef.current;
      const items = carousel.querySelectorAll(".owl-item");
      const containerWidth = carousel.clientWidth;

      items.forEach((item) => {
        item.style.width = `${containerWidth}px`;
      });
    },
  };
  //Modal
  function MyVerticallyCenteredModal(props) {
    const [categoryP, setP] = useState([]);

    const fetchCategory = async () => {
      try {
        const { data } = await axios.get(
          "https://6nkuu0ytgg.execute-api.ap-south-1.amazonaws.com/dev/api/v1/catogory/getAllCategory"
        );
        setP(data);
      } catch (e) {
        console.log(e);
      }
    };

    useEffect(() => {
      if (modalShow === true) {
        fetchCategory();
      }
    }, []);

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [ratings, setRating] = useState("");
    const [size, setSize] = useState("");
    const [colors, setColor] = useState("");
    const [Stock, setStock] = useState("");
    const [category, setCategory] = useState("");
    const [manyImages, setManyImages] = useState([]);
    const [imageArray, setImageArray] = useState([]);
    const [ imageLoading , setImageLoading ] = useState(false)
    const [ successMessage , setSuccessMessage ] = useState(false)


    const uploadImages = (e) => {
      const data = new FormData();
      setImageLoading(true)
      Array.from(manyImages).forEach((img) => {
        data.append("file", img);
        data.append("upload_preset", "ml_default");
        data.append("cloud_name", "dbcnha741");
        fetch("https://api.cloudinary.com/v1_1/dbcnha741/image/upload", {
          method: "post",
          body: data,
        })
          .then((res) => res.json())
          .then((data) => {
            setImageArray((prevArray) => [...prevArray, data.url]);
            console.log("Uploaded", data.url);
            setImageLoading(true)
          })
          .catch((err) => {
            console.log(err);
          });
      });
    };

    const postData = async (e) => {
      e.preventDefault();
      try {
        const { data } = await axios.post(
          "https://6nkuu0ytgg.execute-api.ap-south-1.amazonaws.com/dev/api/v1/admin/product/new",
          {
            name,
            description,
            price,
            ratings,
            size,
            colors,
            Stock,
            category,
            images: imageArray,
          }
        );
        console.log(data);
        props.onHide();
        fetchData();
        alert("Product Added");
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
            Add Product
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={postData}>
          {imageLoading  ? "Uploading" : ""}
            <div className="d-flex gap-2" style={{ alignItems: "center" }}>
              <Form.Group className="mb-3">
                <Form.Label>Product Image</Form.Label>
                <Form.Control
                  type="file"
                  onChange={(e) => setManyImages(e.target.files)}
                  multiple
                />
              </Form.Group>
              <Button style={{ height: "40px", marginTop: "15px" }} 
              onClick={() => uploadImages()}
              >
                Upload
              </Button>
            </div>

            <Form.Group className="mb-3">
              <Form.Label>Product Name</Form.Label>
              <Form.Control
                type="text"
                onChange={(e) => setName(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <FloatingLabel
                controlId="floatingTextarea"
                label="Description"
                className="mb-3"
              >
                <Form.Control
                  as="textarea"
                  placeholder="Leave a comment here"
                  onChange={(e) => setDescription(e.target.value)}
                />
              </FloatingLabel>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Price</Form.Label>
              <Form.Control
                type="number"
                min={0}
                onChange={(e) => setPrice(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Size Available</Form.Label>
              <Form.Control
                type="text"
                onChange={(e) => setSize(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Category</Form.Label>
              <Form.Select
                aria-label="Default select example"
                onChange={(e) => setCategory(e.target.value)}
              >
                <option>Open this select menu</option>
                {categoryP?.categories?.map((i, index) => (
                  <option value={i._id} key={index}>
                    {" "}
                    {i.name}{" "}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Stock</Form.Label>
              <Form.Control
                type="number"
                min={0}
                onChange={(e) => setStock(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Colors Available</Form.Label>
              <Form.Control
                type="text"
                onChange={(e) => setColor(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Ratings</Form.Label>
              <Form.Control
                type="text"
                onChange={(e) => setRating(e.target.value)}
              />
            </Form.Group>
            <Button variant="outline-success" type="submit">
              Submit
            </Button>
          </Form>
        </Modal.Body>
        <Modal.Footer></Modal.Footer>
      </Modal>
    );
  }

  const fetchData = async () => {
    try {
      const { data } = await axios.get(
        "https://6nkuu0ytgg.execute-api.ap-south-1.amazonaws.com/dev/api/v1/products"
      );
      setData(data);
    } catch (e) {
      console.log(e);
    }
  };

  const deleteData = async (id) => {
    try {
      const { data } = await axios.delete(
        `https://6nkuu0ytgg.execute-api.ap-south-1.amazonaws.com/dev/api/v1/admin/product/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(data);
      fetchData();
      toast.success("Product Deleted");
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <MyVerticallyCenteredModal
        show={modalShow}
        onHide={() => setModalShow(false)}
      />
      <section>
        <div className="pb-4 sticky top-0  w-full flex justify-between items-center bg-white">
          <span className="tracking-widest text-slate-900 font-semibold uppercase ">
            All Products
          </span>
          <Button variant="outline-success" onClick={() => setModalShow(true)}>
            Add Product
          </Button>
        </div>

        <div style={{ maxWidth: "100%", overflow: "auto" }}>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Product Image</th>
                <th>Product Name</th>
                <th>Description</th>
                <th>Price</th>
                <th>Size Available</th>
                <th>Ratings</th>
                <th>Category</th>
                <th>Stock</th>
                <th>Number of Reviews</th>
                <th>Color Available</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {data?.products?.map((i, index) => (
                <tr key={index}>
                  <td>
                    <OwlCarousel
                      options={options}
                      style={{ width: "120px" }}
                      ref={carouselRef}
                    >
                      {i.images?.map((img, index) => (
                        <img src={img} alt="" key={index} />
                      ))}
                    </OwlCarousel>
                  </td>
                  <td>{i.name} </td>
                  <td>{i.description}</td>
                  <td>₹{i.price}</td>
                  <td> {i.size} </td>
                  <td>{i.ratings}</td>
                  <td>{i.category?.name} </td>
                  <td>{i.Stock} </td>
                  <td> {i.numOfReviews} </td>
                  <td> {i.colors} </td>
                  <td>
                    <div style={{ display: "flex", gap: "10px" }}>
                      <i
                        class="fa-solid fa-trash"
                        style={{ color: "red", cursor: "pointer" }}
                        onClick={() => deleteData(i._id)}
                      ></i>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </section>
    </>
  );
};

export default HOC(Product);
