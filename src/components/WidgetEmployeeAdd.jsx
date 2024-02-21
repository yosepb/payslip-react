import { useState } from "react";
import { Button, Col, Form, InputGroup, Modal, Row, Table } from "react-bootstrap";
import EmployeeModel from "../models/EmployeeModel";
import AllowanceModel from "../models/AllowanceModel";
import DeductionModel from "../models/DeductionModel";
import { FaTrash } from "react-icons/fa6";
import configApi from "../config.api";
import Swal from "sweetalert2";

const WidgetEmployeeAdd = ({eventListener}) => {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [employee, setEmployee] = useState(EmployeeModel);
  const [allowance, setAllowance] = useState(AllowanceModel);
  const [deduction, setDeduction] = useState(DeductionModel);

  const handleInput = (e) => {
    let name = e.target.name;
    let value = e.target.value;
    let type = e.target.type;

    if (type === 'number') {
      value = parseInt(value);
    }

    setEmployee((values) => ({...values, [name]: value}))
  }

  const handleAllowanceAndDeduction = (e, isAllowance) => {
    let name = e.target.name;
    let value = e.target.value;
    let type = e.target.type;

    if (type === 'number') {
      value = parseInt(value);
    }

    if (isAllowance) {
      setAllowance((values) => ({...values, [name]: value}))
    } else {
      setDeduction((values) => ({...values, [name]: value}))
    }
  }

  const addAllowance = () => {
    if (allowance.name && allowance.total) {
      setEmployee((values) => {
        let currentData = {...values}
        currentData.allowances.push(allowance);
        return currentData
      })
    }
  }

  const addDeduction = () => {
    if (deduction.name && deduction.total) {
      setEmployee((values) => {
        let currentData = {...values}
        currentData.deductions.push(deduction);
        return currentData
      })
    }
  }

  const removeAllowance = (index) => {
    setEmployee((employee) => {
      let currentData = {...employee};
      currentData.allowances.splice(index, 1)
      return currentData;
    })
  }

  const removeDeduction = (index) => {
    setEmployee((employee) => {
      let currentData = {...employee};
      currentData.deductions.splice(index, 1)
      return currentData;
    })
  }

  const resetEmployee = () => {
    setEmployee(() => {
      let currentData = {...EmployeeModel};
      currentData.deductions = []
      currentData.allowances = []
      return currentData;
    })
  }

  const create = async () => {
    try {
      const response = await fetch(`${configApi.BASE_URL}/employee`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'x-access-token': localStorage.getItem("token")
        },
        body: JSON.stringify(employee)
      });

      if (!response.ok) {
        throw new Error(`Error! status: ${response.status}`);
      }

      handleClose()
      let content = await response.json();
      Swal.fire(
        'Good job!',
        'Adding new employee successfully!',
        'success'
      )
      resetEmployee()
      eventListener({detail: { status: true, content }})
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: error
      })
      eventListener({detail: { status: false, error }})
    }
  }

  return (
    <>
      <Button variant="primary" onClick={handleShow}>
        Add Employee
      </Button>

      <Modal show={show} onHide={handleClose} size="lg" backdrop="static" keyboard={false}>
        <Modal.Header closeButton>
          <Modal.Title>New Employee</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col>
              <Form.Group className="mb-3">
                <Form.Label>Email address</Form.Label>
                <Form.Control type="email" name="email" value={employee.email} onChange={handleInput}/>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>First Name</Form.Label>
                <Form.Control type="text" name="firstName" value={employee.firstName} onChange={handleInput} />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Last Name</Form.Label>
                <Form.Control type="text" name="lastName" value={employee.lastName} onChange={handleInput} />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Department</Form.Label>
                <Form.Control type="text" name="department" value={employee.department} onChange={handleInput} />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Basic Salary</Form.Label>
                <Form.Control type="number" name="basicSalary" value={employee.basicSalary} onChange={handleInput} />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group className="mb-3">
                <Form.Label>Allowance</Form.Label>
                <InputGroup className="mb-3">
                  <Form.Control placeholder="Name" type="text" name="name" value={allowance.name} onChange={(e) => handleAllowanceAndDeduction(e, true)}/>
                  <Form.Control placeholder="Total" type="number" name="total" value={allowance.total || 0} onChange={(e) => handleAllowanceAndDeduction(e, true)}/>
                  <Button onClick={addAllowance} variant="secondary" size="sm">Add</Button>
                </InputGroup>
              </Form.Group>
              {employee.allowances.length > 0 && (
                <Table bordered hover striped>
                  <thead>
                    <tr>
                      <th>Allowance</th>
                      <th>Total</th>
                      <th>#</th>
                    </tr>
                  </thead>
                  <tbody>
                    {employee.allowances.map((value, index) => (
                      <tr key={index}>
                        <td>{value.name}</td>
                        <td>{value.total}</td>
                        <td>
                          <Button size="sm" variant="secondary" onClick={() => removeAllowance(index)}>
                            <FaTrash />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
              <Form.Group className="mb-3">
                <Form.Label>Deduction</Form.Label>
                <InputGroup className="mb-3">
                  <Form.Control placeholder="Name" type="text" name="name" value={deduction.name} onChange={(e) => handleAllowanceAndDeduction(e)}/>
                  <Form.Control placeholder="Total" type="number" name="total" value={deduction.total || 0} onChange={(e) => handleAllowanceAndDeduction(e)}/>
                  <Button onClick={addDeduction} variant="secondary" size="sm">Add</Button>
                </InputGroup>
              </Form.Group>
              {employee.deductions.length > 0 && (
                <Table bordered hover striped>
                  <thead>
                    <tr>
                      <th>deduction</th>
                      <th>Total</th>
                      <th>#</th>
                    </tr>
                  </thead>
                  <tbody>
                    {employee.deductions.map((value, index) => (
                      <tr key={index}>
                        <td>{value.name}</td>
                        <td>{value.total}</td>
                        <td>
                          <Button size="sm" variant="secondary" onClick={() => removeDeduction(index)}>
                            <FaTrash />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={create}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default WidgetEmployeeAdd;