import React, { useState } from 'react';
import { Table, Button, Modal, Form, InputGroup, FormControl, Row, Col, Spinner } from 'react-bootstrap';
import { v4 as uuidv4 } from 'uuid';
import edit from "../src/assets/edit.svg";
import del from "../src/assets/delete.svg";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const [students, setStudents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentStudentId, setCurrentStudentId] = useState(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    contact: '',
    doesWork: false,
    group: ''
  });
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterGroup, setFilterGroup] = useState("");

  const gender = ['Male', 'Female'];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (isEditing) {
      setStudents(students.map(student =>
        student.id === currentStudentId ? { ...formData, id: currentStudentId } : student
      ));
      toast.success('Contact updated successfully');
      setIsEditing(false);
      setCurrentStudentId(null);
    } else {
      setStudents([...students, { ...formData, id: uuidv4() }]);
      toast.success('Contact added successfully');
    }
    setShowModal(false);
    setFormData({ firstName: '', lastName: '', doesWork: false, group: '' });
    setLoading(false);
  };

  const openModal = () => setShowModal(true);
  const closeModal = () => {
    setShowModal(false);
    setIsEditing(false);
    setCurrentStudentId(null);
    setFormData({ firstName: '', lastName: '', doesWork: false, group: '' });
  };

  const handleEdit = (student) => {
    setFormData({
      firstName: student.firstName,
      lastName: student.lastName,
      contact: student.contact,
      doesWork: student.doesWork,
      group: student.group
    });
    setCurrentStudentId(student.id);
    setIsEditing(true);
    setShowModal(true);
  };

  const handleDelete = (id) => {
    setStudents(students.filter(student => student.id !== id));
    toast.error('Contact deleted successfully');
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleGroupFilterChange = (e) => {
    setFilterGroup(e.target.value);
  };

  const filteredStudents = students.filter((student) => {
    return (
      (student.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.contact.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.group.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (filterGroup === "" || student.group === filterGroup)
    );
  });

  return (
    <div className="container">
      <div className="rows">
        <Row className="mt-3 tepa">
          <Col>
            <InputGroup>
              <FormControl
                placeholder="Search"
                value={searchTerm}
                onChange={handleSearch}
              />
            </InputGroup>
          </Col>
          <Col>
            <Form.Select value={filterGroup} onChange={handleGroupFilterChange}>
              <option value="">All</option>
              {gender.map((group, index) => (
                <option key={index} value={group}>{group}</option>
              ))}
            </Form.Select>
          </Col>
        </Row>
        <Button variant="primary" onClick={openModal}>Add Student</Button>
      </div>
      <Table striped bordered hover className="mt-4">
        <thead>
          <tr>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Contact</th>
            <th>Does Work</th>
            <th>Gender</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredStudents.map((student) => (
            <tr key={student.id}>
              <td>{student.firstName}</td>
              <td>{student.lastName}</td>
              <td>{student.contact}</td>
              <td>{student.doesWork ? 'Yes' : 'No'}</td>
              <td>{student.group}</td>
              <td className='tds'>
                <Button className='buton' variant="warning" onClick={() => handleEdit(student)}><img src={edit} alt="" /></Button>{' '}
                <Button className='buton' variant="danger" onClick={() => handleDelete(student.id)}><img src={del} alt="" /></Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={closeModal}>
        <Modal.Header closeButton>
          <Modal.Title>{isEditing ? 'Edit Student' : 'Add Student'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleFormSubmit}>
            <Form.Group className="mb-3" controlId="formFirstName">
              <Form.Label>First Name</Form.Label>
              <Form.Control
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formLastName">
              <Form.Label>Last Name</Form.Label>
              <Form.Control
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formLastName">
              <Form.Label>Phone</Form.Label>
              <Form.Control
                type="number"
                name="contact"
                value={formData.contact}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formDoesWork">
              <Form.Check
                type="checkbox"
                label="Does Work"
                name="doesWork"
                checked={formData.doesWork}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formGroup">
              <Form.Label>Gender</Form.Label>
              <Form.Control
                as="select"
                name="group"
                value={formData.group}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Group</option>
                {gender.map((group, index) => (
                  <option key={index} value={group}>{group}</option>
                ))}
              </Form.Control>
            </Form.Group>
            <Button variant="primary" type="submit" disabled={loading}>
              {loading ? <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" /> : isEditing ? 'Update Student' : 'Add Student'}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
      <ToastContainer />
    </div>
  );
}

export default App;
