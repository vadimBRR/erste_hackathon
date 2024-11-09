import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import ProgressBar from '../../components/ProgressBar'
import GraphBar from '../../components/GraphBar'
import { Link } from 'react-router-dom'
import { ChevronLeft } from 'lucide-react'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Analisis = () => {
  
  return <div className='w-full relative'>
    <div className='mx-4 mt-14'>
      <div className='bg-white p-6 rounded-2xl'>
        <p className='text-lg font-bold mb-1'>Eco-score</p>
        <div className=''>
          <GraphBar />

        </div>
        <div className='flex flex-row justify-between mt-4 mb-2'>
          <p className='font-bold'>Your Eco-Score</p>
          <p className='font-bold'>November 2024</p>
        </div>
        <ProgressBar value={50} />

      </div>

    </div>
    <div className='absolute top-0 w-full py-2 bg-white '>
      <div className='relative flex flex-row items-center justify-center w-full'>
          <p className='font-bold text-xl'>Analysis</p>

        <div className='absolute left-4'>
          <Link to='/receipts'>
            <ChevronLeft color='#000000' size={35} />
          </Link>

          
        </div>

        
      </div>
        
			</div>
  </div>
};

export default Analisis;
