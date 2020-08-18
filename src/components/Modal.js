import React from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { Input } from 'reactstrap';

export const Modals = ({
            modal, 
            toggle, 
            text,
            addText,
            handleChange,
            header="Add a category",
            label="Add category"
        }) => {
    return (
        <div>

            <Modal isOpen={modal} toggle={toggle}>
            <ModalHeader toggle={toggle}>{header}</ModalHeader>
                <ModalBody>
            <label htmlFor="category">{label}</label>
                    <Input value={text} onChange={handleChange} id="category" style={{display:"inline-block", width:"45%", marginLeft:"5px"}} />
                </ModalBody>
                <ModalFooter>
                
                <Button color="secondary" onClick={toggle}>Cancel</Button>{' '}
                <Button color="primary" onClick={addText}>OK</Button>
                </ModalFooter>
            </Modal>
        </div>
    )
}
