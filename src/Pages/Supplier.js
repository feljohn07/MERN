import React from 'react'
import { useState, useEffect } from 'react'
import FormModal from '../components/FormModal'
import { Button, Placeholder } from 'react-bootstrap'

import LoadingTable from '../components/LoadingTable'

const CreateForm = (props) => {
    
    const [ form, setForm ] = useState({
        supplier_name: "",
        supplier_address: "",
        suppliers: []
    })
    
    const [ errors, setErrors ] = useState({
        supplier_name: "",
        supplier_address: "",
    })

    const [ isSubmitting, setIsSubmitting ] = useState(false)
    
    // These methods will update the state properties.
    function updateForm(value) {
        // console.log(form)
        return setForm((prev) => {
            return { ...prev, ...value }
        })
    }
    
    // This function will handle the submission.
    async function onSubmit(e) {
        e.preventDefault()

        setIsSubmitting(true)
    
        // When a post request is sent to the create url, we'll add a new record to the database.
        const newCustomer = { ...form }

        console.log({form})

        console.log("form create", newCustomer)
    
        await fetch(`${process.env.REACT_APP_URL}supplier/add`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(newCustomer),
        })
        .then( async ( response )=> {

            let status = response.status
            let json = await response.json()

            if(status == 200){

                // alert("yey Success!")
                // console.log("create response ", json)

                setForm({ supplier_name: "", supplier_address: "" })
                props.handleClose()
                props.getSuppliers()

            }else if(status == 400){

                console.log(json)

                let error = json.error
                let errors = error?.errors
                let message = error?.message
                let name = error?.name

                // alert("oh no! An error Occured.")
                // console.log("Errors", errors )

                setErrors({ 
                    ...errors, 
                    supplier_name: errors?.supplier_name?.kind,
                    supplier_address: errors?.supplier_address?.kind,
                    message: name
                })
                setIsSubmitting(false)
            }

        })
        .catch(error => {
            alert("Catch Error: " + error)
        })
    
    }

    return (
        <>

            <div className='card p-3'>
                <form id="supplier-form" onSubmit={onSubmit}>
                    <div class={ errors?.message != null ? "alert alert-danger" : "d-none"} role="alert">
                        Error Message: { errors?.message }
                    </div>
                    <div className="form-group mb-3">
                        <label htmlFor="supplier_name">Name</label>
                        <input
                            type="text"
                            className= { errors?.supplier_name != "required" ? "form-control" : "form-control is-invalid"} 
                            id="supplier_name"
                            value={form.supplier_name}
                            autocomplete="off"
                            onChange={(e) => updateForm({ supplier_name: e.target.value })}
                        />
                        <div class="invalid-feedback">
                            { errors.supplier_name }
                        </div>
                    </div>
                    <div className="form-group mb-5">
                        <label htmlFor="supplier_address">Address</label>
                        <input
                            type="text"
                            className= { errors?.supplier_address != "required" ? "form-control" : "form-control is-invalid"} 
                            id="supplier_address"
                            value={form.supplier_address}
                            autocomplete="off"
                            onChange={(e) => updateForm({ supplier_address: e.target.value })}
                        />
                        <div class="invalid-feedback">
                            { errors.supplier_address }
                        </div>
                    </div>

                    <Button variant="outline-danger me-3" onClick={props.handleClose}>
                        Close
                    </Button>
                    
                    <Button 
                        variant="primary" 
                        type="submit"
                        form="supplier-form"
                    >
                        { isSubmitting ? <div class="spinner-border spinner-border-sm mx-3" role="status"> <span class="sr-only">Loading...</span> </div> : "Create Supplier"}
                    </Button>

                </form>
            </div>

        </>
    )
}


const UpdateForm = (props) => {
    
    const [form, setForm] = useState({
        supplier_name: "",
        supplier_address: "",
        suppliers: []
    })

    const [ formLoading, setFormLoading ] = useState(false)
    const [ isSubmitting, setIsSubmitting ] = useState(false)
    
    // These methods will update the state properties.
    function updateForm(value) {
        return setForm((prev) => {
            return { ...prev, ...value }
        })
    }

    useEffect(() => {

        var id = props.id
        
        async function fetchData() {
            
            setFormLoading(true)
            const response = await fetch(`${process.env.REACT_APP_URL}supplier/${id}`)
        
            if (!response.ok) {
                const message = `An error has occurred: ${response.statusText}`
                window.alert(message)
                console.log(response)
                return
            }
        
            const supplier = await response.json()

            if (!supplier) {
                window.alert(`Record with id ${id} not found`)
                return
            }

            console.log("Update form", supplier)
        
            setForm(supplier)
            setFormLoading(false)
            console.log("form", form)
        }
    
        fetchData()
        return

    }, [props.show])
    
    // This function will handle the submission.
    async function onSubmit(e) {
        e.preventDefault()

        setIsSubmitting(true)
    
        // When a post request is sent to the create url, we'll add a new record to the database.
        const updateCustomer = { ...form }
    
        await fetch(`${process.env.REACT_APP_URL}supplier/update/${props.id}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(updateCustomer),
        })
        .catch(error => {
            window.alert(error)
            return
        });
    
        setForm({ supplier_name: "", supplier_address: "" })
        props.handleClose()
        props.getSuppliers()
    }

    return (
        <>

            <div className='card p-3 placeholder-glow'>
                <div className='card-dialog'>
                    <form id="supplier-form" onSubmit={onSubmit}>
                        <div className="form-group mb-3">
                            <label className={ formLoading ? 'placeholder col-4 mb-1' : 'mb-1' } htmlFor="supplier_name">Name</label>
                            <input
                                type="text"
                                className={ formLoading ? "form-control placeholder col-4" : 'form-control' }
                                id="supplier_name"
                                value={form.supplier_name}
                                autocomplete="off"
                                onChange={(e) => updateForm({ supplier_name: e.target.value })}
                            />
                        </div>
                        <div className="form-group mb-5">
                            <label className={ formLoading ? 'placeholder col-4 mb-1' : 'mb-1' } htmlFor="supplier_address">Address</label>
                            <input
                                type="text"
                                className={ formLoading ? "form-control placeholder col-4" : 'form-control' }
                                id="supplier_address"
                                value={form.supplier_address}
                                autocomplete="off"
                                onChange={(e) => updateForm({ supplier_address: e.target.value })}
                            />
                        </div>

                        <Button variant="outline-danger me-3" onClick={props.handleClose}>
                            Close
                        </Button>
                        <button 
                            className={ formLoading ? 'btn btn-primary text-primary placeholder col-4 disabled' : 'btn btn-primary ' }
                            type="submit"
                            form="supplier-form"
                            disabled={ formLoading ? true : false }
                        >
                            { isSubmitting ? <div class="spinner-border spinner-border-sm mx-3" role="status"> <span class="sr-only">Loading...</span> </div> : "Update Supplier"}
                        </button>

                    </form>
                </div>
            </div>

        </>
    )
}


const DeleteConfirm = (props) => {

    const [ isSubmitting, setIsSubmitting ] = useState(false)

    async function deleteCustomer() {

        setIsSubmitting(true)

        await fetch(`${process.env.REACT_APP_URL}supplier/delete/${props.id}`, {
            method: "DELETE"
        })
        props.handleClose()
        props.getSuppliers()

    }

    return (
        <>
        <div className='card'>

            <div className='card-header'>
                <b>Attention!</b>
            </div>

            <div className='card-body'>
            <h5 class="card-title">Confirm Delete?</h5>
            </div>

            <div className='card-footer'>
                <Button variant="outline-primary me-3" onClick={props.handleClose}>
                    Close
                </Button>
                <Button 
                    variant="danger" 
                    onClick={ ()=> deleteCustomer() }
                >
                    { isSubmitting ? <div class="spinner-border spinner-border-sm mx-3" role="status"> <span class="sr-only">Loading...</span> </div> : "Delete Costumer"}
                </Button>
            </div>

        </div>

        </>
    )
}


export default function Supplier() {

    // PAGINATION
    const [ limit, setLimit ] = useState(10)
    const [ numOfPages, setNumOfPages ] = useState(0)
    const [ numOfRecords, setNumOfRecords ] = useState(0)
    const [ page, setPage ] = useState(0)
    const [ isLoading, setIsLoading ] = useState(false)

    // TABLE ARRAY
    const [ suppliers, setSuppliers ] = useState([])

    // MODAL STATE AND CONTENT
    const [modalContent, setModalContent] = useState(null)
    const [showModal, setShowModal] = useState(false)

    const handleClose = () => setShowModal(false)

    const handleShow = (content) => {
        setModalContent(content)
        setShowModal(true)
    }

    // These methods will update the state properties.
    async function searchTable(query) {

        setIsLoading(true)

        const response = await fetch(`${process.env.REACT_APP_URL}supplier?limit=${limit}&page=${page}&query=${query}`)
        if (!response.ok) {
            const message = `An error occurred: ${response.statusText}`
            window.alert(message)
            return
        }

        const result = await response.json()

        var suppliers = result.suppliers
        var numOfPages = result.numOfPages
        var numOfRecords = result.numOfRecords
        
        setSuppliers(suppliers)
        setNumOfPages(numOfPages)
        setNumOfRecords(numOfRecords)
        setIsLoading(false)

        // switch to first page
        setPage(0)

        console.log("result", result)
        console.log(query)
    }

    const selectLimit = (value) => {

        // Page number of row displayed
        setLimit(value)

        // switch to first page
        setPage(0)
    }

    async function getSuppliers() {

        setIsLoading(true)

        const response = await fetch(`${process.env.REACT_APP_URL}supplier?limit=${limit}&page=${page}`)
        if (!response.ok) {
            const message = `An error occurred: ${response.statusText}`
            window.alert(message)
            return
        }

        const result = await response.json()

        var suppliers = result.suppliers
        var numOfPages = result.numOfPages
        var numOfRecords = result.numOfRecords
        
        setSuppliers(suppliers)
        setNumOfPages(numOfPages)
        setNumOfRecords(numOfRecords)
        setIsLoading(false)

        console.log("result", result)

    }

    useEffect(() => {
        getSuppliers()
    }, [limit, page])

    const dateFormat = (date) =>{

        return new Intl.DateTimeFormat('en-US').format(new Date(date))
    }

    
    return (
        <>
            <div class="container-fluid">
                <h3 class="text-dark my-4">Supplier's Record <span class="badge bg-secondary">{ numOfRecords }</span></h3>
                <div class="card shadow">

                    <div class="card-header py-3">
                        <button 
                            class="btn btn-primary btn-sm" 
                            type="button" 
                            onClick={
                                () => handleShow(
                                    <CreateForm 
                                        handleClose = { handleClose }
                                        getSuppliers = { getSuppliers }
                                    />
                                )
                            }
                        >New Supplier</button>
                    </div>

                    <div class="card-body">
                        <div class="row">
                            <div class="col-md-6 text-nowrap">
                                <div id="dataTable_length" class="dataTables_length" aria-controls="dataTable">
                                <label class="form-label">Show <span> </span>
                                    <select onChange={ (e) => {selectLimit(e.target.value)} } class="d-inline-block form-select form-select-sm">
                                        <option value="10" selected="">10</option>
                                        <option value="25">25</option>
                                        <option value="50">50</option>
                                        <option value="100">100</option>
                                    </select>
                                </label>
                            </div>
                            </div>
                            <div class="col-md-6">
                                <div class="text-md-end dataTables_filter" id="dataTable_filter"><label class="form-label">
                                <input type="search" /* onChange={ (e) => searchTable(e.target.value) }  */ onKeyUp={ (e) => searchTable(e.target.value) } class="form-control form-control-sm" aria-controls="dataTable" placeholder="Search"/></label></div>
                            </div>
                        </div>
                        <div class="table-responsive table mt-2 " id="dataTable-1" role="grid" aria-describedby="dataTable_info">
                            <table class="table my-0 " id="dataTable" style={{width: "80vw"}}>
                                <thead>
                                    <tr>
                                        <th>No</th>
                                        <th>Name</th>
                                        <th>Address</th>
                                        <th>Date Added</th>
                                        <th style={{minWidth: "200px", maxWidth: "200px"}}>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {

                                        isLoading ? 
                                        
                                        <LoadingTable row={10} col={5} /> 
                                        
                                        :

                                        suppliers.map((supplier, index) => {
                                            return (
                                                <tr key={supplier._id}>
                                                    <th>{ index + 1 }</th>
                                                    <td><span className='d-inline-block text-truncate' style={{minWidth: "200px", maxWidth: "20vw"}}>{ supplier.supplier_name }</span></td>
                                                    <td><span className='d-inline-block text-truncate' style={{maxWidth: "20vw"}}>{ supplier.supplier_address }</span></td>
                                                    <td>{ dateFormat(supplier.createdAt) }</td>

                                                    <td>
                                                        <button 
                                                            className="btn btn-warning btn-sm me-3" 
                                                            onClick={
                                                                () => handleShow(
                                                                    <UpdateForm 
                                                                        id = {supplier._id}
                                                                        handleClose = { handleClose }
                                                                        getSuppliers = { getSuppliers }
                                                                    />
                                                                )
                                                            }
                                                        ><i class="fas fa-edit"></i> <span className='d-none d-md-inline d-lg-inline'>Edit</span> </button>

                                                        <button className="btn btn-outline-danger btn-sm"
                                                            onClick={() => handleShow(
                                                                <DeleteConfirm
                                                                    id = {supplier._id}
                                                                    handleClose = { handleClose }
                                                                    getSuppliers = { getSuppliers }
                                                                />
                                                            )}
                                                        ><i class="fas fa-trash-alt"></i> <span className='d-none d-md-inline d-lg-inline'>Delete</span> </button>
                                                    </td>
                                                </tr>
                                            )
                                        })
                                    }

                                    {
                                        suppliers.length == 0 && !isLoading ?
                                            <tr>
                                                <td colSpan="5" className="text-center">Not Found /  No Data</td>
                                            </tr>
                                        :
                                            null
                                    }

                                </tbody>
                            </table>
                        </div>
                        <div class="row">
                            <div class="col">
                                <nav class="d-lg-flex justify-content-lg-end dataTables_paginate paging_simple_numbers">
                                    <ul class="pagination">
                                        <li class={ "page-item page-link " + ( page == 0 ? "disabled" : "") } onClick={() => setPage((prev) => prev - 1)} role='button'><span aria-hidden="true">«</span></li>

                                        {( () => {
                                            const arr = [];
                                            for (let i = 0; i < numOfPages; i++) {

                                                if( i == page ){
                                                    arr.push(<li class="page-item page-link active" onClick={() => setPage(i)} role='button'>{ i + 1}</li>)
                                                }else{
                                                    arr.push(<li class="page-item page-link " onClick={() => setPage(i)} role='button'>{ i + 1}</li>)
                                                }

                                            }
                                            return arr;
                                        }) ()}

                                        <li class={ "page-item page-link " + ( page >= (numOfPages - 1) ? "disabled" : "") } onClick={() => setPage((prev) => prev + 1)} role='button'><span aria-hidden="true">»</span></li>
                                    </ul>
                                </nav>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


            <FormModal
                show = { showModal }
                handleShow = { handleShow }
                handleClose = { handleClose }
                form = { modalContent }
            />

        </>
    )
}
