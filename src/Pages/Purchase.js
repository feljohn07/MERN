import React from 'react'
import { useState, useEffect } from 'react'
import FormModal from '../components/FormModal'
import { Button } from 'react-bootstrap'
import AsyncCreatableSelect from 'react-select/async-creatable';

const dateFormat = (date) => {

    try{
        return new Date(date).toLocaleDateString('sv-SE')
    }catch (error){
        return error.message
    }
    
}


export const CreateForm = (props) => {
    
    const [ form, setForm ] = useState({
        "product": null || props.id,
        "supplier": null,
        "purchase_price": "",
        "purchase_quantity": "",
        "purchase_date": "",
        "createdAt": "",
    })
    
    const [ errors, setErrors ] = useState({
        "product": null,
        "supplier": null,
        "purchase_price": "",
        "purchase_quantity": "",
        "purchase_date": "",
        "createdAt": "",
    })

    const [ suppliers, setSuppliers ] = useState([])
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
        const newPurchase = { ...form }

        console.log({form})

        console.log("form create", newPurchase)
    
        await fetch(`${process.env.REACT_APP_URL}purchase/add`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(newPurchase),
        })
        .then( async ( response )=> {

            let status = response.status
            let json = await response.json()

            if(status == 200){

                alert("yey Success!")
                console.log("create response ", json)

                setForm({})
                props.handleClose()
                
                try{
                    props.getPurchases()
                }catch (error ){
                    console.log("get() Error: ", error)
                }

                try{
                    props.getProducts()
                } catch (error) {
                    console.log("get() Error: ", error)
                }
                

            }else if(status == 400){

                let error = json.error
                let errors = error?.errors
                let message = error?.message
                let name = error?.name

                alert("oh no! An error Occured.")
                console.log("Errors", errors )

                setErrors({ 
                    ...errors, 
                    product: errors?.product?.kind,
                    supplier: errors?.supplier?.kind,
                    purchase_price: errors?.purchase_price?.kind,
                    purchase_quantity: errors?.purchase_quantity?.kind,
                    purchase_date: errors?.purchase_date?.kind,
                    createdAt: errors?.createdAt?.kind,
                    message: name
                })
                setIsSubmitting(false)
            }

        })
        .catch(error => {
            alert("Catch Error: " + error)
        })
    
    }

    const getSuppliers = async (inputValue) => {

        const response = await fetch(`${process.env.REACT_APP_URL}supplier`)
        if (!response.ok) {
            const message = `An error occurred: ${response.statusText}`
            window.alert(message)
            return
        }

        const result = await response.json()

        var suppliers = result.suppliers

        setSuppliers(suppliers)
        // console.log("supplier list result", result)

        let options = []

        await suppliers.map((supplier) => {
            options.push( {value: supplier._id, label: `${supplier.supplier_name} [${supplier.supplier_address}]`} )
        })

        console.log(options)

        return options.filter(i =>
            i.label.toLowerCase().includes(inputValue.toLowerCase())
        )

    }
    
    const promiseOptions = inputValue =>
        new Promise(resolve => {
            resolve(getSuppliers(inputValue))
        }
    )

    return (
        <>
            <div className='card'>
                <div className='card-header'>
                    <h4 className='pt-1 text-primary fw-bold'>Restock | Replenish</h4>
                </div>
                <div className='card-body'>
                    <form id="purchase-form" onSubmit={onSubmit}>
                        <div class={ errors?.message != null ? "alert alert-danger" : "d-none"} role="alert">
                            Error Message: { errors?.message }
                        </div>

                        <div className="form-group mb-3">
                            <label htmlFor="product">Product Name</label>
                            <input
                                disabled="true"
                                type="text"
                                className= { errors?.product != "required" ? "form-control" : "form-control is-invalid"} 
                                id="product"
                                value={props.product_name}
                                autocomplete="off"
                            />
                            <div class="invalid-feedback">
                                { errors.product }
                            </div>
                        </div>

                        <div className="form-group mb-3">
                            <label htmlFor="purchase_date">Purchase Date</label>
                            <div class="input-group col-sm-10">
                                <input
                                    type="date"
                                    className= { errors?.purchase_date != "required" ? "form-control " : "form-control  is-invalid"} 
                                    id="purchase_date"
                                    value={form.purchase_date}
                                    autocomplete="off"
                                    onChange={ (e) => updateForm({ purchase_date: e.target.value }) }
                                    required="true"
                                />
                                <button 
                                    class="btn btn-primary " 
                                    type="button"
                                    onClick={ ()=> updateForm( { purchase_date: dateFormat(new Date()) } ) }
                                >Today</button>
                            </div>
                            <div class="invalid-feedback">
                                { errors.purchase_date }
                            </div>
                        </div>

                        <div className="form-group mb-3">
                            <label htmlFor="supplier">Supplier</label>
                            <AsyncCreatableSelect
                                onChange={ (e)=> setForm( {...form, supplier: e.value }) } 
                                cacheOptions
                                defaultOptions
                                loadOptions={ promiseOptions }
                            />
                        </div>
{/* 
                        <div className="form-group mb-3">
                            <label htmlFor="supplier">Supplier ID</label>
                            <input
                                type="text"
                                disabled="true"
                                className= { errors?.supplier != "required" ? "form-control" : "form-control is-invalid"} 
                                id="supplier"
                                value={form.supplier}
                                autocomplete="off"
                                onChange={(e) => updateForm({ supplier: e.target.value })}
                            />
                            <div class="invalid-feedback">
                                { errors.supplier }
                            </div>
                        </div> */}

                        <div className="form-group mb-3">
                            <label htmlFor="purchase_price"> <span className='fw-bold'>Purchase Price</span> | Retail Price: <span class="badge bg-info"> {props.retail_price}</span></label>
                            <input
                                type="number"
                                className= { errors?.purchase_price != "required" ? "form-control" : "form-control is-invalid"} 
                                id="purchase_price"
                                value={form.purchase_price}
                                autocomplete="off"
                                onChange={(e) => updateForm({ purchase_price: e.target.value })}
                            />
                            <div class="invalid-feedback">
                                { errors.purchase_price }
                            </div>
                        </div>

                        <div className="form-group mb-5">
                            <label htmlFor="purchase_quantity" className='mb-1' ><span className='fw-bold'>Quantity</span> | On Stock: <span class="badge bg-info"> {props.quantity_on_hand}</span></label>
                            <input
                                type="number"
                                className= { errors?.purchase_quantity != "required" ? "form-control" : "form-control is-invalid"} 
                                id="purchase_quantity"
                                value={form.purchase_quantity}
                                autocomplete="off"
                                onChange={(e) => updateForm({ purchase_quantity: e.target.value })}
                            />
                            <div class="invalid-feedback">
                                { errors.purchase_quantity }
                            </div>
                        </div>

                        <Button variant="outline-danger me-3" onClick={props.handleClose}>
                            Cancel
                        </Button>
                        
                        <Button 
                            variant="primary" 
                            type="submit"
                            form="purchase-form"
                        >
                            { isSubmitting ? <div class="spinner-border spinner-border-sm mx-3" role="status"> <span class="sr-only">Loading...</span> </div> : "Create Purchase"}
                        </Button>

                    </form>
                </div>
            </div>

        </>
    )
}


const UpdateForm = (props) => {
    
    const [form, setForm] = useState({
        purchase_price: "",
        purchase_price: "",
        purchases: []
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
            const response = await fetch(`${process.env.REACT_APP_URL}purchase/${id}`)
        
            if (!response.ok) {
                const message = `An error has occurred: ${response.statusText}`
                window.alert(message)
                console.log(response)
                return
            }
        
            const purchase = await response.json()

            if (!purchase) {
                window.alert(`Record with id ${id} not found`)
                return
            }

            console.log("Update form", purchase)
        
            setForm(purchase)
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
        const updatePurchase = { ...form }
    
        await fetch(`${process.env.REACT_APP_URL}purchase/update/${props.id}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(updatePurchase),
        })
        .catch(error => {
            window.alert(error)
            return
        });
    
        setForm({ purchase_price: "", purchase_price: "" })
        props.handleClose()

        try{
            props.getPurchases()
        }catch (error ){
            console.log("getPurchase() Error: ", error)
        }
    }

    return (
        <>

            <div className='card p-3 placeholder-glow'>
                <div className='card-dialog'>
                    <form id="purchase-form" onSubmit={onSubmit}>
                        <div className="form-group mb-3">
                            <label className={ formLoading ? 'placeholder col-4 mb-1' : 'mb-1' } htmlFor="product">Product</label>
                            <input
                                disabled="true"
                                type="text"
                                className={ formLoading ? "form-control placeholder col-4" : 'form-control' }
                                id="product"
                                value={form.product}
                                autocomplete="off"
                                onChange={(e) => updateForm({ product: e.target.value })}
                            />
                        </div>
                        <div className="form-group mb-3">
                            <label className={ formLoading ? 'placeholder col-4 mb-1' : 'mb-1' } htmlFor="supplier">Supplier</label>
                            <input
                                disabled="true"
                                type="text"
                                className={ formLoading ? "form-control placeholder col-4" : 'form-control' }
                                id="supplier"
                                value={form.supplier}
                                autocomplete="off"
                                onChange={(e) => updateForm({ supplier: e.target.value })}
                            />
                        </div>
                        <div className="form-group mb-3">
                            <label className={ formLoading ? 'placeholder col-4 mb-1' : 'mb-1' } htmlFor="purchase_price">Price</label>
                            <input
                                type="text"
                                className={ formLoading ? "form-control placeholder col-4" : 'form-control' }
                                id="purchase_price"
                                value={form.purchase_price}
                                autocomplete="off"
                                onChange={(e) => updateForm({ purchase_price: e.target.value })}
                            />
                        </div>
                        <div className="form-group mb-3">
                            <label className={ formLoading ? 'placeholder col-4 mb-1' : 'mb-1' } htmlFor="purchase_quantity">Quantity</label>
                            <input
                                type="text"
                                className={ formLoading ? "form-control placeholder col-4" : 'form-control' }
                                id="purchase_quantity"
                                value={form.purchase_quantity}
                                autocomplete="off"
                                onChange={(e) => updateForm({ purchase_quantity: e.target.value })}
                            />
                        </div>
                        <div className="form-group mb-3">
                            <label className={ formLoading ? 'placeholder col-4 mb-1' : 'mb-1' } htmlFor="purchase_date">Purchase Date</label>
                            <input
                                type="date"
                                className={ formLoading ? "form-control placeholder col-4" : 'form-control' }
                                id="purchase_date"
                                value={ dateFormat(form.purchase_date) }
                                autocomplete="off"
                                onChange={(e) => updateForm({ purchase_date: e.target.value })}
                            />
                        </div>

                        <Button variant="outline-danger me-3" onClick={props.handleClose}>
                            Close
                        </Button>
                        <button 
                            className={ formLoading ? 'btn btn-primary text-primary placeholder col-4 disabled' : 'btn btn-primary ' }
                            type="submit"
                            form="purchase-form"
                            disabled={ formLoading ? true : false }
                        >
                            { isSubmitting ? <div class="spinner-border spinner-border-sm mx-3" role="status"> <span class="sr-only">Loading...</span> </div> : "Update Purchase"}
                        </button>

                    </form>
                </div>
            </div>

        </>
    )
}


const DeleteConfirm = (props) => {

    const [ isSubmitting, setIsSubmitting ] = useState(false)

    async function deletePurchase() {

        setIsSubmitting(true)

        await fetch(`${process.env.REACT_APP_URL}purchase/delete/${props.id}`, {
            method: "DELETE"
        })
        props.handleClose()

        
        try{
            props.getPurchases()
        }catch (error ){
            console.log("getPurchase() Error: ", error)
        }

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
                    onClick={ ()=> deletePurchase() }
                >
                    { isSubmitting ? <div class="spinner-border spinner-border-sm mx-3" role="status"> <span class="sr-only">Loading...</span> </div> : "Delete Purchase"}
                </Button>
            </div>

        </div>

        </>
    )
}

export default function Purchase(props) {


    // PAGINATION
    const [ limit, setLimit ] = useState(10)
    const [ numOfPages, setNumOfPages ] = useState(0)
    const [ numOfRecords, setNumOfRecords ] = useState(0)
    const [ page, setPage ] = useState(0)

    // TABLE ARRAY
    const [ purchases, setPurchases ] = useState([])
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

            const response = await fetch(`${process.env.REACT_APP_URL}purchase?limit=${limit}&page=${page}&query=${query}`)
            if (!response.ok) {
                const message = `An error occurred: ${response.statusText}`
                window.alert(message)
                return
            }
    
            const result = await response.json()
    
            var purchases = result.purchases
            var numOfPages = result.numOfPages
            var numOfRecords = result.numOfRecords
            
            setPurchases(purchases)
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

    async function getPurchases() {

        const response = await fetch(`${process.env.REACT_APP_URL}purchase?limit=${limit}&page=${page}&product_id=${props.product_id ? props.product_id : ""}`)
        if (!response.ok) {
            const message = `An error occurred: ${response.statusText}`
            window.alert(message)
            return
        }

        const result = await response.json()

        var purchases = result.purchases
        var numOfPages = result.numOfPages
        var numOfRecords = result.numOfRecords
        
        setPurchases(purchases)
        setNumOfPages(numOfPages)
        setNumOfRecords(numOfRecords)

        console.log("result", result)

    }

    useEffect(() => {
        getPurchases()
    }, [limit, page])

    const dateFormat = (date) =>{

        try{
            return new Intl.DateTimeFormat('en-US').format(new Date(date))
        }catch (error){
            return error.message
        }
        
    }

    
    return (
        <>
            <div class="container-fluid">
                <h3 class="text-dark my-4">Purchase's Record <span class="badge bg-secondary">{ numOfRecords }</span></h3>
                <div class="card shadow">

                    <div class="card-header py-3">
                        {/* <button 
                            // disabled="false"
                            class="btn btn-primary btn-sm" 
                            type="button" 
                            onClick={
                                () => handleShow(
                                    <CreateForm 
                                        handleClose = { handleClose }
                                        getPurchases = { getPurchases }
                                    />
                                )
                            }
                        >New Purchase</button> */}
                        <h4 className='text-primary'>Transaction History</h4>
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
                                <div class="text-md-end dataTables_filter" id="dataTable_filter">
                                    <label class="form-label">
                                        <input type="search" /* onChange={ (e) => searchTable(e.target.value) }  */ onKeyDown={ (e) => searchTable(e) } class="form-control form-control-sm" aria-controls="dataTable" placeholder="Search"/>
                                    </label>
                                </div>
                            </div>
                        </div>
                        <div class="table-responsive table mt-2 " id="dataTable-1" role="grid" aria-describedby="dataTable_info">
                            <table class="table my-0 " id="dataTable" style={{width: "80vw"}}>
                                <thead>
                                    <tr>
                                        <th>No</th>
                                        <th>Product</th>
                                        <th>Supplier</th>
                                        <th>Price</th>
                                        <th>Quantity</th>
                                        <th>Purchased Date</th>
                                        <th>Recorded Date</th>
                                        <th style={{minWidth: "200px", maxWidth: "200px"}}>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {   
                                        purchases.map((purchase, index) => {
                                            return (
                                                <tr key={purchase._id}>
                                                    <th>{ index + 1 }</th>
                                                    <td><span className='d-inline-block text-truncate' style={{minWidth: "200px", maxWidth: "20vw"}}>{ purchase?.product?.product_name }</span></td>
                                                    <td><span className='d-inline-block text-truncate' style={{minWidth: "200px", maxWidth: "20vw"}}>{ purchase?.supplier?.supplier_name }</span></td>
                                                    <td><span className='d-inline-block text-truncate' style={{maxWidth: "20vw"}}>{ purchase?.purchase_price }</span></td>
                                                    <td><span className='d-inline-block text-truncate' style={{maxWidth: "20vw"}}>{ purchase?.purchase_quantity }</span></td>
                                                    <td>{ dateFormat( purchase?.purchase_date ) }</td>
                                                    <td>{ dateFormat( purchase?.createdAt ) }</td>
                                                    

                                                    <td>
                                                        <button 
                                                            className="btn btn-warning btn-sm me-3" 
                                                            onClick={
                                                                () => handleShow(
                                                                    <UpdateForm 
                                                                        id = {purchase._id}
                                                                        handleClose = { handleClose }
                                                                        getPurchases = { getPurchases }
                                                                    />
                                                                )
                                                            }
                                                        ><i class="fas fa-edit"></i> <span className='d-none d-md-inline d-lg-inline'>Edit</span> </button>

                                                        <button className="btn btn-outline-danger btn-sm"
                                                            onClick={() => handleShow(
                                                                <DeleteConfirm
                                                                    id = {purchase._id}
                                                                    handleClose = { handleClose }
                                                                    getPurchases = { getPurchases }
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
