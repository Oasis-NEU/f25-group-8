// Card that shows the clicked commission on the map
"use client"

import React, { useState } from 'react';
import Image from 'next/image'


export default function CommissionCard() {
    const [isCardOpen, setIsCardOpen] = useState(false);
    
    return(
        <div className="p-4">
            <h1 className="
                my-2
            ">
                User123's Commission
            </h1>
            <Image className="
                max-wd-md
                mx-auto
                "
                src="/placeholder_image.png"
                width={500}
                height={500}
            />
            <h1 className="
                my-2
            ">
                Prompt: place prompt here
            </h1>
            <button className="
                my-2
                p-2 
                bg-sky-500 
                hover:bg-sky-700 
                rounded-lg 
                max-w-md
                mx-auto
                block
            ">
                Enter Submission
            </button>
        </div>
    )
}