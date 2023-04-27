import React from 'react'
import { useState, useEffect } from 'react'

export default function Dashboard() {

    const [ inventory, setInventory ] = useState({ products: [], totalProducts: 0 })
    
    async function initDashboard() {

        const response = await fetch(`${process.env.REACT_APP_URL}dashboard`)
        if (!response.ok) {
            const message = `An error occurred: ${response.statusText}`
            window.alert(message)
            return
        }

        const result = await response.json()
        const products = result.products[0]
        const totalProducts = result.totalProducts
        setInventory({ products: products, totalProducts: totalProducts})

        console.log("result", totalProducts)

    }

    useEffect(() => {
        initDashboard()
    }, [])

    return (
      <>

        <div class="container-fluid">

            <h3 class="text-dark my-4">Dashboard</h3>

            <div class="row">
                <div class="col-md-6 col-xl-3 mb-4">
                    <div class="card shadow border-start-primary py-2">
                        <div class="card-body">
                            <div class="row align-items-center no-gutters">
                                <div class="col me-2">
                                    <div class="text-uppercase text-primary fw-bold text-xs mb-1"><span>Inventory</span></div>
                                    <div class="text-dark fw-bold h5 mb-0"><span>{ inventory.products.inventory }</span></div>
                                </div>
                                <div class="col-auto"><i class="fas fa-boxes fa-2x text-gray-300"></i></div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-md-6 col-xl-3 mb-4">
                    <div class="card shadow border-start-success py-2">
                        <div class="card-body">
                            <div class="row align-items-center no-gutters">
                                <div class="col me-2">
                                    <div class="text-uppercase text-success fw-bold text-xs mb-1"><span>Total Products</span></div>
                                    <div class="text-dark fw-bold h5 mb-0"><span>{ inventory.totalProducts }</span></div>
                                </div>
                                <div class="col-auto"><i class="fas fa-box fa-2x text-gray-300"></i></div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-md-6 col-xl-3 mb-4">
                    <div class="card shadow border-start-info py-2">
                        <div class="card-body">
                            <div class="row align-items-center no-gutters">
                                <div class="col me-2">
                                    <div class="text-uppercase text-info fw-bold text-xs mb-1"><span>Inventrory cost</span></div>
                                    <div class="text-dark fw-bold h5 mb-0 me-3"><span>P { inventory.products.inventory_value }</span></div>
                                </div>
                                <div class="col-auto"><i class="fas fa-money-check-alt fa-2x text-gray-300"></i></div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-md-6 col-xl-3 mb-4">
                    <div class="card shadow border-start-warning py-2">
                        <div class="card-body">
                            <div class="row align-items-center no-gutters">
                                <div class="col me-2">
                                    <div class="text-uppercase text-warning fw-bold text-xs mb-1"><span>total purchases</span></div>
                                    <div class="text-dark fw-bold h5 mb-0"><span>{ inventory.products.total_purchases }</span></div>
                                </div>
                                <div class="col-auto"><i class="fas fa-money-bill-alt fa-2x text-gray-300"></i></div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-md-6 col-xl-3 mb-4">
                    <div class="card shadow border-start-warning py-2">
                        <div class="card-body">
                            <div class="row align-items-center no-gutters">
                                <div class="col me-2">
                                    <div class="text-uppercase text-warning fw-bold text-xs mb-1"><span>total orders</span></div>
                                    <div class="text-dark fw-bold h5 mb-0"><span>{ inventory.products.total_orders }</span></div>
                                </div>
                                <div class="col-auto"><i class="fas fa-hand-holding-usd fa-2x text-gray-300"></i></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-lg-6 mb-4">
                    <div class="card shadow mb-4">
                        <div class="card-header py-3">
                            <h6 class="text-primary fw-bold m-0">Projects</h6>
                        </div>
                        <div class="card-body">
                            <h4 class="small fw-bold">Server migration<span class="float-end">20%</span></h4>
                            <div class="progress mb-4">
                                <div class="progress-bar bg-danger" aria-valuenow="20" aria-valuemin="0" aria-valuemax="100" style={{ width: "20%" }}><span class="visually-hidden">20%</span></div>
                            </div>
                            <h4 class="small fw-bold">Sales tracking<span class="float-end">40%</span></h4>
                            <div class="progress mb-4">
                                <div class="progress-bar bg-warning" aria-valuenow="40" aria-valuemin="0" aria-valuemax="100" style={{ width: "40%" }}><span class="visually-hidden">40%</span></div>
                            </div>
                            <h4 class="small fw-bold">Customer Database<span class="float-end">60%</span></h4>
                            <div class="progress mb-4">
                                <div class="progress-bar bg-primary" aria-valuenow="60" aria-valuemin="0" aria-valuemax="100" style={{ width: "60%" }}><span class="visually-hidden">60%</span></div>
                            </div>
                            <h4 class="small fw-bold">Payout Details<span class="float-end">80%</span></h4>
                            <div class="progress mb-4">
                                <div class="progress-bar bg-info" aria-valuenow="80" aria-valuemin="0" aria-valuemax="100" style={{ width: "80%" }}><span class="visually-hidden">80%</span></div>
                            </div>
                            <h4 class="small fw-bold">Account setup<span class="float-end">Complete!</span></h4>
                            <div class="progress mb-4">
                                <div class="progress-bar bg-success" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100" style={{ width: "100%" }}><span class="visually-hidden">100%</span></div>
                            </div>
                        </div>
                    </div>

                    <div class="card shadow mb-4">
                        <div class="card-header py-3">
                            <h6 class="text-primary fw-bold m-0">Todo List</h6>
                        </div>
                        <ul class="list-group list-group-flush">
                            <li class="list-group-item">
                                <div class="row align-items-center no-gutters">
                                    <div class="col me-2">
                                        <h6 class="mb-0"><strong>Lunch meeting</strong></h6><span class="text-xs">10:30 AM</span>
                                    </div>
                                    <div class="col-auto">
                                        <div class="form-check"><input id="formCheck-1" class="form-check-input" type="checkbox" /><label class="form-check-label" for="formCheck-1"></label></div>
                                    </div>
                                </div>
                            </li>
                            <li class="list-group-item">
                                <div class="row align-items-center no-gutters">
                                    <div class="col me-2">
                                        <h6 class="mb-0"><strong>Lunch meeting</strong></h6><span class="text-xs">11:30 AM</span>
                                    </div>
                                    <div class="col-auto">
                                        <div class="form-check"><input id="formCheck-2" class="form-check-input" type="checkbox" /><label class="form-check-label" for="formCheck-2"></label></div>
                                    </div>
                                </div>
                            </li>
                            <li class="list-group-item">
                                <div class="row align-items-center no-gutters">
                                    <div class="col me-2">
                                        <h6 class="mb-0"><strong>Lunch meeting</strong></h6><span class="text-xs">12:30 AM</span>
                                    </div>
                                    <div class="col-auto">
                                        <div class="form-check"><input id="formCheck-3" class="form-check-input" type="checkbox" /><label class="form-check-label" for="formCheck-3"></label></div>
                                    </div>
                                </div>
                            </li>
                        </ul>
                    </div>
                    
                </div>
            </div>
        </div>

    </>

    )
}
