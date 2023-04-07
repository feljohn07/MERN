import React from 'react'
import { useState, useEffect } from 'react'
import FormModal from '../components/FormModal'
import FullScreenModal from '../components/FullScreenModal'
import { Button } from 'react-bootstrap'
import Tab from 'react-bootstrap/Tab'
import Tabs from 'react-bootstrap/Tabs'

import { useAuthContext } from '../Hooks/useAuthContext'

import Purchase, { CreateForm as PurchaseCreateForm } from './Purchase'
import Order, { CreateForm as OrderCreateForm } from './Order'


const CreateForm = (props) => {
    
    const [ form, setForm ] = useState({
        product_name: "",
        minimum_quantity: "",
        retail_price: "",
    })
    
    const [ errors, setErrors ] = useState({})

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

        console.log({ form })

        console.log("form create", newCustomer)
    
        await fetch("http://localhost:5000/product/add", {
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

                setForm({ 
                  product_name: "", 
                  minimum_quantity: "",
                  retail_price: "",
                })

                props.handleClose()
                props.getProducts()

            }else if(status == 400){

                let error = json.error
                let errors = error?.errors
                let message = error?.message
                let name = error?.name

                // alert("oh no! An error Occured.")
                // console.log("Errors", errors )

                setErrors({ 
                    ...errors, 
                    product_name: errors?.product_name?.kind,
                    minimum_quantity: errors?.minimum_quantity?.kind,
                    retail_price: errors?.minimum_quantity?.kind,
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
                <form id="product-form" onSubmit={onSubmit}>
                    <div class={ errors?.message != null ? "alert alert-danger" : "d-none"} role="alert">
                        Error Message: { errors?.message }
                    </div>
                    <div className="form-group mb-3">
                        <label htmlFor="product_name">Product Name</label>
                        <input
                            type="text"
                            className= { errors?.product_name != "required" ? "form-control" : "form-control is-invalid"} 
                            id="product_name"
                            value={form.product_name}
                            autocomplete="off"
                            onChange={(e) => updateForm({ product_name: e.target.value })}
                        />
                        <div class="invalid-feedback">
                            { errors.product_name }
                        </div>
                    </div>
                    <div className="form-group mb-3">
                        <label htmlFor="minimum_quantity">Minimum Quantity</label>
                        <input
                            type="number"
                            className= { errors?.minimum_quantity != "required" ? "form-control" : "form-control is-invalid"} 
                            id="minimum_quantity"
                            value={form.minimum_quantity}
                            autocomplete="off"
                            onChange={(e) => updateForm({ minimum_quantity: e.target.value })}
                        />
                        <div class="invalid-feedback">
                            { errors.minimum_quantity }
                        </div>
                    </div>
                    <div className="form-group mb-3">
                        <label htmlFor="retail_price">Retail Price</label>
                        <input
                            type="decimal"
                            className= { errors?.retail_price != "required" ? "form-control" : "form-control is-invalid"} 
                            id="retail_price"
                            value={form.retail_price}
                            autocomplete="off"
                            onChange={(e) => updateForm({ retail_price: e.target.value })}
                        />
                        <div class="invalid-feedback">
                            { errors.retail_price }
                        </div>
                    </div>

                    <Button variant="outline-danger mt-5 me-3" onClick={props.handleClose}>
                        Close
                    </Button>
                    
                    <Button 
                        variant="primary mt-5 me-3" 
                        type="submit"
                        form="product-form"
                    >
                        { isSubmitting ? <div class="spinner-border spinner-border-sm mx-3" role="status"> <span class="sr-only">Loading...</span> </div> : "Create Product"}
                    </Button>

                </form>
            </div>

        </>
    )
}


const UpdateForm = (props) => {
    
    const [form, setForm] = useState({
        product_name: "",
        minimum_quantity: "",
        retail_price: "",
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
            const response = await fetch(`http://localhost:5000/product/${id}`)
        
            if (!response.ok) {
                const message = `An error has occurred: ${response.statusText}`
                window.alert(message)
                console.log(response)
                return
            }
        
            const product = await response.json()

            if (!product) {
                window.alert(`Record with id ${id} not found`)
                return
            }

            console.log("Update form", product)
        
            setForm(product)
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
    
        await fetch(`http://localhost:5000/product/update/${props.id}`, {
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
    
        setForm({ product_name: "", minimum_quantity: "", retail_price: "", })
        props.handleClose()
        props.getProducts()
    }

    return (
        <>

            <div className='card p-3 placeholder-glow'>
                <div className='card-dialog'>
                    <form id="product-form" onSubmit={onSubmit}>
                        <div className="form-group mb-3">
                            <label className={ formLoading ? 'placeholder col-4 mb-1' : 'mb-1' } htmlFor="product_name">Name</label>
                            <input
                                type="text"
                                className={ formLoading ? "form-control placeholder col-4" : 'form-control' }
                                id="product_name"
                                value={form.product_name}
                                autocomplete="off"
                                onChange={(e) => updateForm({ product_name: e.target.value })}
                            />
                        </div>
                        <div className="form-group mb-3">
                            <label className={ formLoading ? 'placeholder col-4 mb-1' : 'mb-1' } htmlFor="minimum_quantity">Minimum Quantity</label>
                            <input
                                type="number"
                                className={ formLoading ? "form-control placeholder col-4" : 'form-control' }
                                id="minimum_quantity"
                                value={form.minimum_quantity}
                                autocomplete="off"
                                onChange={(e) => updateForm({ minimum_quantity: e.target.value })}
                            />
                        </div>
                        <div className="form-group mb-5">
                            <label className={ formLoading ? 'placeholder col-4 mb-1' : 'mb-1' } htmlFor="retail_price">Retail Price</label>
                            <input
                                type="decimal"
                                className={ formLoading ? "form-control placeholder col-4" : 'form-control' }
                                id="retail_price"
                                value={form.retail_price}
                                autocomplete="off"
                                onChange={(e) => updateForm({ retail_price: e.target.value })}
                            />
                        </div>

                        <Button variant="outline-danger me-3" onClick={props.handleClose}>
                            Close
                        </Button>
                        <button 
                            className={ formLoading ? 'btn btn-primary text-primary placeholder col-4 disabled' : 'btn btn-primary ' }
                            type="submit"
                            form="product-form"
                            disabled={ formLoading ? true : false }
                        >
                            { isSubmitting ? <div class="spinner-border spinner-border-sm mx-3" role="status"> <span class="sr-only">Loading...</span> </div> : "Update Product"}
                        </button>

                    </form>
                </div>
            </div>

        </>
    )
}


const DeleteConfirm = (props) => {

    const [ isSubmitting, setIsSubmitting ] = useState(false)

    async function deleteProduct() {

        setIsSubmitting(true)

        await fetch(`http://localhost:5000/product/delete/${props.id}`, {
            method: "DELETE"
        })
        props.handleClose()
        props.searchTable(props.query)

    }

    return (
        <>
        <div className='card'>

            <div className='card-header'>
                <h4><i class="fas fa-exclamation-circle text-danger" style={{ FontSize: "12px" }}></i> <b>Confirm Delete?</b></h4>
            </div>

            <div className='card-body'>
                <h6 class="card-title">Attention!</h6>

                <div className='card p-2' style={{}}>
                    Deleting this product will result in the deletion of related data, including purchases and orders that reference it.
                </div>
            </div>

            <div className='card-footer'>
                <Button variant="outline-primary me-3" onClick={props.handleClose}>
                    Close
                </Button>
                <Button 
                    variant="danger" 
                    onClick={ ()=> deleteProduct() }
                >
                    { isSubmitting ? <div class="spinner-border spinner-border-sm mx-3" role="status"> <span class="sr-only">Loading...</span> </div> : "Delete Product"}
                </Button>
            </div>

        </div>

        </>
    )
}


const ViewProductInfo = (props) => {
    const [key, setKey] = useState('purchase')

    return (
        <>
            <div className='card p-3 mb-5'> 
                <span>
                    <button className="btn btn-primary me-2" onClick={props.handleClose}>
                        Back
                    </button>
                    <span className='lead pt-3'> Product ID: {props.id} </span>
                </span>
                
            </div>
            <Tabs
                id="controlled-tab-example"
                activeKey={key}
                onSelect={(k) => setKey(k)}
                className="mb-3"
                >
                <Tab eventKey="purchase" title="Purchases">
                    <Purchase 
                        product_id={props.id}
                    />
                </Tab>
                <Tab eventKey="order" title="Orders">
                    <Order
                        product_id={props.id}
                    />
                </Tab>
                
            </Tabs>

        </>
    )
}


export default function Product() {

    // PAGINATION
    const [ limit, setLimit ] = useState(10)
    const [ numOfPages, setNumOfPages ] = useState(0)
    const [ numOfRecords, setNumOfRecords ] = useState(0)
    const [ page, setPage ] = useState(0)
    const [ query, setQuery ] = useState("")

    // TABLE ARRAY
    const [ products, setProducts ] = useState([])

    // MODAL STATE AND CONTENT
    const [ modalContent, setModalContent ] = useState(null)
    const [ showModal, setShowModal ] = useState(false)
    const [ showFullModal, setshowFullModal ] = useState(false)
    const [ fullscreen, setFullscreen ] = useState(false)

    const handleClose = () => {
        setShowModal(false)
        setshowFullModal(false)
    }

    const handleShow = (content) => {
        setModalContent(content)
        setShowModal(true)
    }

    const handleFullShow = (content) => {
        setModalContent(content)
        setshowFullModal(true)
    }

    // These methods will update the state properties.
    async function searchTable(value) {

        setQuery(value)

        const response = await fetch(`http://localhost:5000/product?limit=${limit}&page=${page}&query=${query}`)
        if (!response.ok) {
            const message = `An error occurred: ${response.statusText}`
            window.alert(message)
            return
        }

        const result = await response.json()

        var products = result.products
        var numOfPages = result.numOfPages
        var numOfRecords = result.numOfRecords
        
        setProducts(products)
        setNumOfPages(numOfPages)
        setNumOfRecords(numOfRecords)

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

    async function getProducts() {

        const response = await fetch(`http://localhost:5000/product?limit=${limit}&page=${page}`)
        if (!response.ok) {
            const message = `An error occurred: ${response.statusText}`
            window.alert(message)
            return
        }

        const result = await response.json()

        var products = result.products
        var numOfPages = result.numOfPages
        var numOfRecords = result.numOfRecords
        
        setProducts(products)
        setNumOfPages(numOfPages)
        setNumOfRecords(numOfRecords)

        console.log("result", result)

    }

    useEffect(() => {
        getProducts()
    }, [limit, page])

    const dateFormat = (date) =>{
        return new Intl.DateTimeFormat('en-US').format(new Date(date))
    }

    
    return (
        <>
            <div class="container-fluid">
                <h3 class="text-dark my-4">Product's Record <span class="badge bg-secondary">{ numOfRecords }</span></h3>
                <div class="card shadow">

                    <div class="card-header py-3">
                        <button 
                            class="btn btn-primary btn-sm" 
                            type="button" 
                            onClick={
                                () => handleShow(
                                    <CreateForm 
                                        handleClose = { handleClose }
                                        getProducts = { getProducts }
                                    />
                                )
                            }
                        >New Product</button>
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
                            <table class="table table-hover my-0 " id="dataTable" style={{width: "80vw"}}>
                                <thead>
                                    <tr>
                                        <th>No</th>
                                        <th>Name</th>
                                        <th>Minimum Qty</th>
                                        <th>Retail Price</th>
                                        <th>On Hand</th>
                                        <th>Total Puchases</th>
                                        <th>Total Orders</th>
                                        <th>Date Added</th>
                                        <th style={{minWidth: "280px", maxWidth: "280px"}}>Action</th>
                                        <th style={{minWidth: "100px", maxWidth: "100px"}}> Product Movement </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        products.map((product, index) => {
                                            return (
                                                <tr key={product?._id}>
                                                    <th>{ index + 1 }</th>
                                                    <td><span className='d-inline-block text-truncate' style={{minWidth: "200px", maxWidth: "20vw"}}>{ product?.product_name }</span></td>
                                                    <td><span className='d-inline-block text-truncate' style={{maxWidth: "20vw"}}>{ product?.minimum_quantity }</span></td>
                                                    <td><span className='d-inline-block text-truncate' style={{maxWidth: "20vw"}}>{ product?.retail_price }</span></td>
                                                    <td><span className='d-inline-block text-truncate' style={{maxWidth: "20vw"}}>{ product?.quantity_on_hand }</span></td>
                                                    <td><span className='d-inline-block text-truncate' style={{maxWidth: "20vw"}}>{ product?.total_purchases }</span></td>
                                                    <td><span className='d-inline-block text-truncate' style={{maxWidth: "20vw"}}>{ product?.total_orders }</span></td>
                                                    <td>{ dateFormat(product?.createdAt) }</td>

                                                    <td>

                                                        <button 
                                                            className="btn btn-info btn-sm me-2"
                                                            onClick={
                                                                () => {
                                                                    handleFullShow(
                                                                        <ViewProductInfo
                                                                            id = {product?._id}
                                                                            handleClose = { handleClose }
                                                                            searchTable = { searchTable }
                                                                        />
                                                                    )
                                                                }
                                                            }
                                                        ><i class="fas fa-eye"></i> <span className='d-none d-md-inline d-lg-inline'>View</span> </button>

                                                        <button 
                                                            className="btn btn-warning btn-sm me-2" 
                                                            onClick={
                                                                () => handleShow(
                                                                    <UpdateForm 
                                                                        id = {product?._id}
                                                                        handleClose = { handleClose }
                                                                        getProducts = { getProducts }
                                                                    />
                                                                )
                                                            }
                                                        ><i class="fas fa-edit"></i> <span className='d-none d-md-inline d-lg-inline'>Edit</span> </button>

                                                        <button 
                                                            className="btn btn-danger btn-sm me-2"
                                                            onClick={() => handleShow(
                                                                <DeleteConfirm
                                                                    id = {product?._id}
                                                                    handleClose = { handleClose }
                                                                    searchTable = { searchTable }
                                                                />
                                                            )}
                                                        ><i class="fas fa-trash-alt"></i> <span className='d-none d-md-inline d-lg-inline'>Delete</span> </button>

                                                    </td>
                                                    <td>
                                                        <button 
                                                            className="btn btn-outline-success btn-sm me-1"
                                                            onClick={() => handleShow(
                                                                <PurchaseCreateForm 
                                                                    id = {product?._id}
                                                                    product_name = {product?.product_name}
                                                                    retail_price = {product?.retail_price}
                                                                    quantity_on_hand = {product?.quantity_on_hand}
                                                                    handleClose = { handleClose }
                                                                    getProducts = { getProducts }
                                                                />
                                                            )}
                                                        ><i class="fas fa-plus"></i></button>
                                                        <button className="btn btn-outline-danger btn-sm me-1"
                                                            onClick={() => handleShow(
                                                                <OrderCreateForm 
                                                                    product_name = {product?.product_name}
                                                                    id = {product?._id}
                                                                    retail_price = {product?.retail_price}
                                                                    quantity_on_hand = {product?.quantity_on_hand}
                                                                    handleClose = { handleClose }
                                                                    getProducts = { getProducts }
                                                                />
                                                            )}
                                                        ><i class="fas fa-minus"></i></button>
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
                fullscreen = { fullscreen }
            />

            <FullScreenModal
                show = { showFullModal }
                handleShow = { handleFullShow }
                handleClose = { handleClose }
                content = { modalContent }
            />

        </>
    )
}
