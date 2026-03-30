import React from 'react'
import { Loader2 } from "lucide-react"

const LoadingOverlay = () => {
    return (
        <div className="loading-wrapper">
            <div className="loading-shadow-wrapper">
                <div className="loading-shadow">
                    <Loader2 className="loading-animation w-12 h-12 text-[#663820]" />
                    <h2 className="loading-title">Synthesizing...</h2>
                    <p className="loading-progress text-center text-[#8B7355]">
                        Analyzing content and preparing your interactive experience
                    </p>
                </div>
            </div>
        </div>
    )
}

export default LoadingOverlay
