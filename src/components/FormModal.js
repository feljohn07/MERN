import React, { Children } from 'react'
import { Modal } from 'react-bootstrap'

export default function FormModal(props) {
  return (
    <>
        <Modal 
          show={props.show} 
          onHide={props.handleClose}
          backdrop="static"
          keyboard={false}
          fullscreen={props.fullscreen || false}

        >
            <Modal.Body className='p-0'>
                { props.form }
            </Modal.Body>
        </Modal>
    </>
  )
}
