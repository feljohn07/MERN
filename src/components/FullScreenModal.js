import React from 'react'
import { Modal } from 'react-bootstrap'

export default function FullScreenModal(props) {
    return (
        <>
            <Modal 
                show={props.show} 
                onHide={props.handleClose}
                backdrop="static"
                keyboard={false}
                fullscreen={true}
            >
                <Modal.Body className='p-0'>
                    { props.content }
                </Modal.Body>
            </Modal>
        </>
    )
}
