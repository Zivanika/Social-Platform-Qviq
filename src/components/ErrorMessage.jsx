import React from 'react'

function ErrorMessage(props) {
  return (
    <div className='flex justify-center items-center'>
        <svg className='mb-1' width={15} height={15} viewBox='0 0 15 15' fill='none' xmlns="http://www.w3.org/2000/svg">
            <path d="M7.49375 13.75C4.04279 13.7465 1.2477 10.9468 1.25 7.49583C1.2523 4.04487 4.05112 1.24885 7.50208 1.25C10.953 1.25115 13.75 4.04903 13.75 7.5C13.7479 10.9534 10.9471 13.7514 7.49375 13.75ZM2.5 7.6075C2.52957 10.3583 4.77569 12.5685 7.52659 12.5537C10.2775 12.5389 12.4997 10.3047 12.4997 7.55375C12.4997 4.80281 10.2775 2.56861 7.52659 2.55375C4.77569 2.53903 2.52957 4.74922 2.5 7.5V7.6075ZM8.125 10.625H6.875V9.375H8.125V10.625ZM8.125 8.125H6.875V4.375H8.125V8.125Z" fill='#F94545'></path>
        </svg>
        <span className='text-[#f94545] text-left font-medium text-xs ml-2 -translate-y-1' style={{fontFamily:"Segoe UI"}}>{props.msg}</span>
    </div>
  )
}

export default ErrorMessage