import React, { useState } from 'react'
import { Outlet, NavLink } from "react-router-dom"
import { useAuthContext } from '../Hooks/useAuthContext'
import { useLogout } from '../Hooks/useLogout'

export default function Layout() {

    const { user } = useAuthContext()
    const { logout } = useLogout()

    const [ dropdownProfile, setdropdownProfile ] = useState("")
    const [ sidebar, setSidebar ] = useState("")

    const toggleDropdownProfile = () => {
        if (dropdownProfile == "show") {
            setdropdownProfile("")
        } else {
            setdropdownProfile("show")
        }
    }

    const toggleSidebar = () => {
        if (sidebar == "d-none") {
            setSidebar("")
        } else {
            setSidebar("d-none")
        }
    }

    const handleLogout = () => {
        logout()
    }

    return (
        <>
            <div id="wrapper" >

                <nav className= {"navbar navbar-dark align-items-start sidebar sidebar-dark accordion bg-gradient-primary p-0 " + sidebar}>

                    <div className="container-fluid d-flex flex-column p-0">

                        <a className="navbar-brand d-flex justify-content-center align-items-center sidebar-brand m-0" href="/">
                            <div className="sidebar-brand-icon"><i className="fas fa-box-open"></i></div>
                            <div className="sidebar-brand-text mx-3"><span>Inventory</span></div>
                        </a>

                        <hr className="sidebar-divider my-0"/>
                        {/* <!-- Nav Item - Pages Collapse Menu --> */}
                        <ul className="navbar-nav text-light" id="accordionSidebar">

                            <li className="nav-item">
                                <NavLink className="nav-link" to="/">
                                    <i className="far fa-chart-bar"></i> Dashboard
                                </NavLink>
                            </li>

                            <li className="nav-item">
                                <NavLink className="nav-link" to="/product">
                                    <i className="fas fa-boxes"></i> Product
                                </NavLink>
                            </li>

                            <li className="nav-item">
                                <NavLink className="nav-link" to="/purchase">
                                    <i className="fas fa-history"></i> Purchase History
                                </NavLink>
                            </li>

                            <li className="nav-item">
                                <NavLink className="nav-link" to="/order">
                                    <i className="fas fa-history"></i> Order History
                                </NavLink>
                            </li>

                            <li className="nav-item">
                                <NavLink className="nav-link" to="/supplier">
                                    <i className="fas fa-store"></i> Supplier
                                </NavLink>
                            </li>

                            <li className="nav-item">
                                <NavLink className="nav-link" to="/customer">
                                    <i className="fas fa-address-book"></i> Customer
                                </NavLink>
                            </li>

                        </ul>
                    </div>
                </nav>

                <div id="content-wrapper" className="d-flex flex-column">

                    <div id="content">

                        <nav className="navbar navbar-light navbar-expand bg-white shadow topbar static-top">
                            <button className='btn m-3 d-none d-sm-block d-md-none' onClick={toggleSidebar}>
                                <i class="fa fa-bars"></i>
                            </button> 
                            <div className="container-fluid">
                                <ul className="navbar-nav flex-nowrap ms-auto">
                                    <div className="d-none d-sm-block topbar-divider">
                                    </div>
                                    <li className="nav-item dropdown no-arrow">
                                        <div className="nav-item dropdown no-arrow">

                                            <a type='button' className={`dropdown-toggle nav-link ${dropdownProfile}`} onClick={ toggleDropdownProfile }>
                                                <span className="d-none d-lg-inline me-2 text-gray-600 small"> { user.email } </span>
                                                <img className="border rounded-circle img-profile" src={ user.picture ? user.picture : "assets\\img\\avatars\\avatar1.jpeg"} />
                                            </a>

                                            <div className={`dropdown-menu shadow dropdown-menu-end animated--grow-in ${dropdownProfile}`}>

                                                <NavLink className="dropdown-item" to="/profile" onClick={ toggleDropdownProfile }>
                                                    <i className="fas fa-user fa-sm fa-fw me-2 text-gray-400"></i> Profile
                                                </NavLink>

                                                <div className="dropdown-divider"></div>

                                                <a className="dropdown-item" onClick={handleLogout}>
                                                    <i className="fas fa-sign-out-alt fa-sm fa-fw me-2 text-gray-400"></i> Logout
                                                </a>

                                            </div>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </nav>

                        <Outlet />

                    </div>

                    <footer className="bg-white sticky-footer">
                        <div className="container my-auto">
                            <div className="text-center my-auto copyright"><span>Copyright © Brand 2023</span></div>
                        </div>
                    </footer>

                </div>
            </div>
        </>
    )
}
