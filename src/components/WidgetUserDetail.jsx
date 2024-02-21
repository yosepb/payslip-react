import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import UserModel from '../models/UserModel';
import configApi from '../config.api';
import { Form, InputGroup } from 'react-bootstrap';
import { FaMagnifyingGlass } from 'react-icons/fa6'
import { CgRename } from 'react-icons/cg'
import { AiOutlineCloseCircle, AiOutlineMail, AiOutlineSave, AiOutlineUser } from 'react-icons/ai';

const WidgetUserDetail = ({ eventListener, userId }) => {
  const [user, setUser] = useState(UserModel)

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const get = async () => {
    try {
      const response = await fetch(`${configApi.BASE_URL}/users/${userId}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'x-access-token': localStorage.getItem("token")
        }
      });

      if (!response.ok) {
        throw new Error(`Error! status: ${response.status}`);
      }

      let dataUser = await response.json();
      setUser(dataUser)
      // eventListener({detail: { status: true, content }})
      
    } catch (error) {
      // eventListener({detail: { status: false, error }})
    }
  }

  const update = async () => {
    try {
      const response = await fetch(`${configApi.BASE_URL}/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'x-access-token': localStorage.getItem("token")
        },
        body: JSON.stringify(user)
      });

      if (!response.ok) {
        throw new Error(`Error! status: ${response.status}`);
      }
      handleClose()
      let content = await response.json();
      setUser(UserModel)
      eventListener({detail: { status: true, content }})
    } catch (error) {
      eventListener({detail: { status: false, error }})
    }
  }

  const handleInput = (e) => {
    let name = e.target.name;
    let value = e.target.value;
    setUser((user) => ({...user, [name]: value}))
  }

  return (
    <>
      <Button variant="primary" onClick={handleShow}>
        <FaMagnifyingGlass /> Detail
      </Button>
      {user && (
        <Modal show={show} onHide={handleClose} onShow={get}>
          <Modal.Header closeButton>
            <Modal.Title><AiOutlineUser />  {user.email}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
          <Form.Group className='mb-3'>
            <Form.Label>Email address</Form.Label>
            <InputGroup className="mb-3">
              <InputGroup.Text id="basic-addon1">
                <AiOutlineMail />
              </InputGroup.Text>
              <Form.Control type='email' name='email' value={user.email} onChange={handleInput}/>
            </InputGroup>
          </Form.Group>

          <Form.Group className='mb-3'>
            <Form.Label>First Name</Form.Label>
            <InputGroup className="mb-3">
              <InputGroup.Text id="basic-addon1">
                <CgRename />
              </InputGroup.Text>
              <Form.Control type='text' name='firstName' value={user.firstName} onChange={handleInput}/>
            </InputGroup>
          </Form.Group>

          <Form.Group className='mb-3'>
            <Form.Label>Last Name</Form.Label>
            <InputGroup className="mb-3">
              <InputGroup.Text id="basic-addon1">
                <CgRename />
              </InputGroup.Text>
              <Form.Control type='text' name='lastName' value={user.lastName} onChange={handleInput}/>
            </InputGroup>
          </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              <AiOutlineCloseCircle /> Close
            </Button>
            <Button variant="primary" onClick={update}>
              <AiOutlineSave /> Save Changes
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </>
  );
}

export default WidgetUserDetail