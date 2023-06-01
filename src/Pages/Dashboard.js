import React from 'react'
import { useState, useEffect } from 'react'

export default function Dashboard() {

    const [ inventory, setInventory ] = useState(null)
    const [ isLoading, setIsLoading ] = useState(false)
    
    async function initDashboard() {

        setIsLoading(true)

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
        setIsLoading(false)
        
        console.log("result", inventory)

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
                                    <div class="text-dark fw-bold h5 mb-0"><span className={isLoading ? 'placeholder placeholder-glow col-5' : ''}>{ inventory?.products?.inventory }</span></div>
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
                                    <div class="text-dark fw-bold h5 mb-0"><span className={isLoading ? 'placeholder placeholder-glow col-5' : ''}>{ inventory?.totalProducts }</span></div>
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
                                    <div class="text-uppercase text-info fw-bold text-xs mb-1"><span>Inventrory Value</span></div>
                                    <div class="text-dark fw-bold h5 mb-0 me-3"><span className={isLoading ? 'placeholder placeholder-glow col-5' : ''}>P { inventory?.products?.inventory_value }</span></div>
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
                                    <div class="text-dark fw-bold h5 mb-0"><span className={isLoading ? 'placeholder placeholder-glow col-5' : ''}>{ inventory?.products?.total_purchases }</span></div>
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
                                    <div class="text-dark fw-bold h5 mb-0"><span className={isLoading ? 'placeholder placeholder-glow col-5' : ''}>{ inventory?.products?.total_orders }</span></div>
                                </div>
                                <div class="col-auto"><i class="fas fa-hand-holding-usd fa-2x text-gray-300"></i></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    </>

    )
}
