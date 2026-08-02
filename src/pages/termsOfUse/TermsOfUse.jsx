
import React from 'react'
import logo from "/images/no-text-logo.png"
import { useScreenViewStore } from '../../assets/store/screenViewStore'
import { useEffect } from 'react'

function TermsOfUse() {
    const {navBarHeight}=useScreenViewStore()
    useEffect(() => {
        console.log("navBarHeight",navBarHeight);
        
    }, [navBarHeight])
  return (
    <div>
        {/* coming soon */}
        <div className={`flex flex-col items-center justify-center `}
  style={{ height: `calc(100vh - ${navBarHeight}px)` }}
  >
            <img src={logo} alt="logo" className="w-3/4" />
            <h1 className="md:text-8xl text-5xl font-bold mt-4 text-primary text-center font-sans">Coming Soon</h1>
        </div>

    </div>
  )
}

export default TermsOfUse