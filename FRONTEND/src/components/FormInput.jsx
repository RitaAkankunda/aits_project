import React from 'react';
import { Form } from 'react-bootstrap';

const FormInput = ({ controlId, label, value, onChange, isInvalid, errorMessage, type = "text", placeholder }) => {
  return (
    <Form.Group controlId={controlId}>
      <Form.Label>{label}</Form.Label>
      <Form.Control
        type={ type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        isInvalid={isInvalid}
      />
      <Form.Control.Feedback type="invalid">
        {errorMessage}
      </Form.Control.Feedback>
    </Form.Group>
  );
};


export default FormInput;
