import React from 'react'
import { Link, useParams } from 'react-router-dom'
import { receiptInfo, receipts } from '../../constatns'
import Typography from '@mui/joy/Typography'
// import CircularProgress from '@mui/joy/CircularProgress'
import Stack from '@mui/joy/Stack'
import { ChevronLeft, ShoppingBag, Tag } from 'lucide-react'
import { CircularProgress } from '@mui/material'
import CircularProgressBar from '../../components/CircularProgressBar'

import outlined_star from '../../assets/outlined_star.png'
import filled_star from '../../assets/star.png'
const ReceiptsInfo = () => {
	const [isLoading, setIsLoading] = React.useState(false)

	const { id } = useParams()
	if (!id) return <div>404</div>

	const receipt = receipts.find(item => item.id === id)
	const receipt_info = receiptInfo.find(item => item.productId === id)

	if (!receipt || !receipt_info) return <div>404</div>
  const rate = 3;



	return (
		<div className='w-full relative px-4 '>
			<div className='bg-white w-full mt-14 p-4 items-center rounded-2xl'>
				<div className='flex flex-col gap-2'>
					<div className='flex flex-row justify-between items-center'>
						<div>
							<p className='uppercase font-bold text-lg'>
								{receipt.organization_name}
							</p>
							<p className='text-2xl font-bold'>-{receipt.price}€</p>
						</div>
						<div className='p-4 bg-[#0CB33F]/10 rounded-full '>
							<ShoppingBag color='#0CB33F' />
						</div>
					</div>
					<div className='bg-[#E8F5FF] p-2 w-fit rounded-lg px-4'>
						<p className='text-[#265DBA] text-base'>Share</p>
					</div>
				</div>
			</div>

			<div className='bg-white w-full mt-4 p-4 rounded-2xl flex flex-row items-center justify-between'>
				<Tag color='#265DBA' size={24} />
        <div className='border border-[#B6BABD] p-2 px-4 rounded-xl'>
          <p className=''>
          {receipt_info.category}

          </p>
        </div>
			</div>

      {/* <CircularProgress value={75} /> */}
      <div className='flex flex-row gap-2 mt-4'>
        <div className='bg-white flex-1 p-2 px-4 flex flex-col items-center rounded-xl'>
          <p className='mb-2 font-bold'>CO2</p>
          <CircularProgressBar value={74} size={70} color='#0CB33F' textSize={14}/>
          <p className='mt-2  text-sm'>12332.20t</p>

        </div>
        <div className='bg-white flex-1 p-2 px-4 flex flex-col items-center rounded-xl'>
          <p className='mb-2 font-bold'>Water</p>
          <CircularProgressBar value={74} size={70} color='#0CB33F' textSize={14}/>
          <p className='mt-2 text-sm'>12332.20t</p>

        </div>
        
        <div className='bg-white flex-1 p-2 px-4 flex flex-col items-center rounded-xl'>
          <p className='mb-2 font-bold'>Energy</p>
          <CircularProgressBar value={74} size={70} color='#7A27E3' textSize={14}/>
          <p className='mt-2  text-sm'>12332.20t</p>

        </div>
        
        
        
        

      </div>
      <div className='flex flex-row gap-2 mt-4'>
      <div className='bg-white flex-1 p-2 px-4 flex flex-col items-center rounded-xl'>
          <p className='mb-2 font-bold'>Rate</p>
          <div className='flex flex-row gap-1'>

          {[...Array(rate)].map((_, index) => (
            <img
              key={index}
              src={filled_star}
              alt='star'
              className='w-5 h-5'
            />
          ))}
          {[...Array(5-rate)].map((_, index) => (
            <img
              key={index}
              src={outlined_star}
              alt='star'
              className='w-5 h-5'

            />
          ))}
          </div>
        </div>
        <div className='bg-white flex-1 p-2 px-4 flex flex-col items-center rounded-xl'>
          <p className='mb-2 font-bold'>Is Local</p>
          <input type="checkbox" className="w-5 h-5 checked:bg-primary checked:border-[#0CB33F]" checked={true}/>

        </div>

        
        
        
        

      </div>

      

			<div className='absolute top-4 left-4'>
				<Link to='/receipts'>
					<ChevronLeft color='#0CB33F' size={35} />
				</Link>
			</div>
		</div>
	)
}

export default ReceiptsInfo
