import React from 'react'
import { useState, useEffect } from 'react'
import FormModal from '../components/FormModal'
import { Button } from 'react-bootstrap'


const CreateForm = (props) => {
    
    const [ form, setForm ] = useState({
        customer_name: "",
        customer_address: "",
        customers: []
    })
    
    const [ errors, setErrors ] = useState({
        customer_name: "",
        customer_address: "",
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
    
        await fetch("${process.env.REACT_APP_URL}customer/add", {
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

                setForm({})
                props.handleClose()
                props.getCustomers()

            }else if(status == 400){

                let error = json.error
                let errors = error?.errors
                let message = error?.message
                let name = error?.name

                // alert("oh no! An error Occured.")
                // console.log("Errors", errors )

                setErrors({ 
                    ...errors, 
                    customer_name: errors?.customer_name?.kind,
                    customer_address: errors?.customer_address?.kind,
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
                <form id="customer-form" onSubmit={onSubmit}>
                    <div class={ errors?.message != null ? "alert alert-danger" : "d-none"} role="alert">
                        Error Message: { errors?.message }
                    </div>
                    <div className="form-group mb-3">
                        <label htmlFor="customer_name">Name</label>
                        <input
                            type="text"
                            className= { errors?.customer_name != "required" ? "form-control" : "form-control is-invalid"} 
                            id="customer_name"
                            value={form.customer_name}
                            autocomplete="off"
                            onChange={(e) => updateForm({ customer_name: e.target.value })}
                        />
                        <div class="invalid-feedback">
                            { errors.customer_name }
                        </div>
                    </div>
                    <div className="form-group mb-5">
                        <label htmlFor="customer_address">Address</label>
                        <input
                            type="text"
                            className= { errors?.customer_address != "required" ? "form-control" : "form-control is-invalid"} 
                            id="customer_address"
                            value={form.customer_address}
                            autocomplete="off"
                            onChange={(e) => updateForm({ customer_address: e.target.value })}
                        />
                        <div class="invalid-feedback">
                            { errors.customer_address }
                        </div>
                    </div>

                    <Button variant="outline-danger me-3" onClick={props.handleClose}>
                        Close
                    </Button>
                    
                    <Button 
                        variant="primary" 
                        type="submit"
                        form="customer-form"
                    >
                        { isSubmitting ? <div class="spinner-border spinner-border-sm mx-3" role="status"> <span class="sr-only">Loading...</span> </div> : "Create Costumer"}
                    </Button>

                </form>
            </div>

        </>
    )
}


const UpdateForm = (props) => {
    
    const [form, setForm] = useState({
        customer_name: "",
        customer_address: "",
        customers: []
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
            const response = await fetch(`${process.env.REACT_APP_URL}customer/${id}`)
        
            if (!response.ok) {
                const message = `An error has occurred: ${response.statusText}`
                window.alert(message)
                console.log(response)
                return
            }
        
            const customer = await response.json()

            if (!customer) {
                window.alert(`Record with id ${id} not found`)
                return
            }

            console.log("Update form", customer)
        
            setForm(customer)
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
    
        await fetch(`${process.env.REACT_APP_URL}customer/update/${props.id}`, {
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
    
        setForm({ customer_name: "", customer_address: "" })
        props.handleClose()
        props.getCustomers()
    }

    return (
        <>

            <div className='card p-3 placeholder-glow'>
                <div className='card-dialog'>
                    <form id="customer-form" onSubmit={onSubmit}>
                        <div className="form-group mb-3">
                            <label className={ formLoading ? 'placeholder col-4 mb-1' : 'mb-1' } htmlFor="customer_name">Name</label>
                            <input
                                type="text"
                                className={ formLoading ? "form-control placeholder col-4" : 'form-control' }
                                id="customer_name"
                                value={form.customer_name}
                                autocomplete="off"
                                onChange={(e) => updateForm({ customer_name: e.target.value })}
                            />
                        </div>
                        <div className="form-group mb-5">
                            <label className={ formLoading ? 'placeholder col-4 mb-1' : 'mb-1' } htmlFor="customer_address">Address</label>
                            <input
                                type="text"
                                className={ formLoading ? "form-control placeholder col-4" : 'form-control' }
                                id="customer_address"
                                value={form.customer_address}
                                autocomplete="off"
                                onChange={(e) => updateForm({ customer_address: e.target.value })}
                            />
                        </div>

                        <Button variant="outline-danger me-3" onClick={props.handleClose}>
                            Close
                        </Button>
                        <button 
                            className={ formLoading ? 'btn btn-primary text-primary placeholder col-4 disabled' : 'btn btn-primary ' }
                            type="submit"
                            form="customer-form"
                            disabled={ formLoading ? true : false }
                        >
                            { isSubmitting ? <div class="spinner-border spinner-border-sm mx-3" role="status"> <span class="sr-only">Loading...</span> </div> : "Update Costumer"}
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

        await fetch(`${process.env.REACT_APP_URL}customer/delete/${props.id}`, {
            method: "DELETE"
        })
        props.handleClose()
        props.getCustomers()

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


export default function Customer() {

    const [ selectID, setID ] = useState("")

    // PAGINATION
    const [ limit, setLimit ] = useState(10)
    const [ numOfPages, setNumOfPages ] = useState(0)
    const [ numOfRecords, setNumOfRecords ] = useState(0)
    const [ page, setPage ] = useState(0)

    // TABLE ARRAY
    const [ customers, setCustomers ] = useState([])
    const [ isLoading, setIsLoading ] = useState(false)

    // MODAL STATE AND CONTENT
    const [modalContent, setModalContent] = useState(null)
    const [showModal, setShowModal] = useState(false)

    const handleClose = () => setShowModal(false)

    const handleShow = (content) => {
        setModalContent(content)
        setShowModal(true)
    }

    // These methods will update the state properties.
    async function searchTable(event) {

        let query = event.target.value
        let key = event.key

        if(
            key === "Enter" ||
            key === "Space"
        ) {

            setIsLoading(true)

            const response = await fetch(`${process.env.REACT_APP_URL}?limit=${limit}&page=${page}&query=${query}`)
            if (!response.ok) {
                const message = `An error occurred: ${response.statusText}`
                window.alert(message)
                return
            }
    
            const result = await response.json()
    
            var customers = result.customers
            var numOfPages = result.numOfPages
            var numOfRecords = result.numOfRecords
            
            setCustomers(customers)
            setNumOfPages(numOfPages)
            setNumOfRecords(numOfRecords)
            setIsLoading(false)

    
            // switch to first page
            setPage(0)
            
    
            console.log("result", result)
            console.log(query)
        }
   
    }

    const selectLimit = (value) => {

        // Page number of row displayed
        setLimit(value)

        // switch to first page
        setPage(0)
    }

    async function getCustomers() {

        const response = await fetch(`${process.env.REACT_APP_URL}customer?limit=${limit}&page=${page}`)
        if (!response.ok) {
            const message = `An error occurred: ${response.statusText}`
            window.alert(message)
            return
        }

        const result = await response.json()

        var customers = result.customers
        var numOfPages = result.numOfPages
        var numOfRecords = result.numOfRecords
        
        setCustomers(customers)
        setNumOfPages(numOfPages)
        setNumOfRecords(numOfRecords)

        console.log("result", result)

    }

    useEffect(() => {
        getCustomers()
    }, [limit, page])

    const dateFormat = (date) =>{

        return new Intl.DateTimeFormat('en-US').format(new Date(date))
    }

    
    return (
        <>
            <div class="container-fluid">
                <h3 class="text-dark my-4">Costumer's Record <span class="badge bg-secondary">{ numOfRecords }</span></h3>
                <div class="card shadow">

                    <div class="card-header py-3">
                        <button 
                            class="btn btn-primary btn-sm" 
                            type="button" 
                            onClick={
                                () => handleShow(
                                    <CreateForm 
                                        handleClose = { handleClose }
                                        getCustomers = { getCustomers }
                                    />
                                )
                            }
                        >New Customer</button>
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
                                <input type="search" /* onChange={ (e) => searchTable(e.target.value) }  */ onKeyDown={ (e) => searchTable(e) } class="form-control form-control-sm" aria-controls="dataTable" placeholder="Search"/></label></div>
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
                                        customers.map((customer, index) => {
                                            return (
                                                <tr key={customer._id}>
                                                    <th>{ index + 1 }</th>
                                                    <td><span className='d-inline-block text-truncate' style={{minWidth: "200px", maxWidth: "20vw"}}>{ customer.customer_name }</span></td>
                                                    <td><span className='d-inline-block text-truncate' style={{maxWidth: "20vw"}}>{ customer.customer_address }</span></td>
                                                    <td>{ dateFormat(customer.createdAt) }</td>

                                                    <td>
                                                        <button 
                                                            className="btn btn-warning btn-sm me-3" 
                                                            onClick={
                                                                () => handleShow(
                                                                    <UpdateForm 
                                                                        id = {customer._id}
                                                                        handleClose = { handleClose }
                                                                        getCustomers = { getCustomers }
                                                                    />
                                                                )
                                                            }
                                                        ><i class="fas fa-edit"></i> <span className='d-none d-md-inline d-lg-inline'>Edit</span> </button>

                                                        <button className="btn btn-outline-danger btn-sm"
                                                            onClick={() => handleShow(
                                                                <DeleteConfirm
                                                                    id = {customer._id}
                                                                    handleClose = { handleClose }
                                                                    getCustomers = { getCustomers }
                                                                />
                                                            )}
                                                        ><i class="fas fa-trash-alt"></i> <span className='d-none d-md-inline d-lg-inline'>Delete</span> </button>
                                                    </td>
                                                </tr>
                                            )
                                        })
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
