import React from 'react'

const ProgressBar = ({ value }: { value: number }) => {
	return (
		<div className='w-full '>
			<div
				className='h-8 bg-primary rounded-r-lg flex items-center justify-end pr-2 text-white font-bold'
				style={{ width: `${value}%` }}
			>
				<p>{value}%</p>
			</div>
		</div>
	)
}

export default ProgressBar
