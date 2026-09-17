import React from 'react'
import { Link } from 'react-router-dom'

const TopBar = () => {
    return (
            <section className="topBarSection">
                <div className="companyTitle">
                    <a
                      href="/"
                      className='link'
                      onClick={() => window.dispatchEvent(new Event("reset-ai-recommendation"))}
                    >
                    <h2 style={{color:"orangered"}}>SUBY</h2>
                    </a>
                </div>
                <div className="searchBar">
                    <input type="text" placeholder="search..." />
                </div>
<a
  href="https://swiggy-dashboard-black.vercel.app/" target="_blank" 
  style={{ color: "red", textDecoration: "none" }}
  className="userAuth"
>
  Login/Sign-Up
</a>
            </section>
    )
}

export default TopBar
