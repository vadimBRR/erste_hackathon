import React, { useState } from 'react'
import { useAuth } from '../../providers/AuthProvider'
import { usePredictTotalPrice, usePredictTotalPriceMutation } from '../../api'
import CustomInput from '../../components/CustomInput'
import CustomButton from '../../components/CustomButton'

const Home = () => {

  const [taxBaseBasic, setTaxBaseBasic] = useState<string>('')
  const [taxBaseReduced, setTaxBaseReduced] = useState<string>('')
  const [vatAmountBasic, setVatAmountBasic] = useState<string>('')
  const [vatAmountReduced, setVatAmountReduced] = useState<string>('')
  const [price, setPrice] = useState<string>('')
  const [vatRate, setVatRate] = useState<string>('')
  const {mutate:usePredict, isPending:isLoading, isError, error, data} = usePredictTotalPriceMutation()


  const handleSubmit = () => {
    usePredict({
      tax_base_basic: parseFloat(taxBaseBasic) || 0,
      tax_base_reduced: parseFloat(taxBaseReduced) || 0,
      vat_amount_basic: parseFloat(vatAmountBasic) || 0,
      vat_amount_reduced: parseFloat(vatAmountReduced) || 0,
      price: parseFloat(price) || 0,
      vat_rate: parseFloat(vatRate) || 0
    })
  }


  return (
    <div className='w-full'>
      
      <div className='w-1/2 flex items-center flex-col'>
        <CustomInput name="tax_base_basic" setName={setTaxBaseBasic} title="Tax Base Basic" containerStyle="mb-4 w-full" inputStyle='w-full' />
        <CustomInput name="tax_base_reduced" setName={setTaxBaseReduced} title="Tax Base Reduced" containerStyle="mb-4 w-full" inputStyle='w-full' />
        <CustomInput name="vat_amount_basic" setName={setVatAmountBasic} title="VAT Amount Basic" containerStyle="mb-4 w-full" inputStyle='w-full' />
        <CustomInput name="vat_amount_reduced" setName={setVatAmountReduced} title="VAT Amount Reduced" containerStyle="mb-4 w-full" inputStyle='w-full' />
        <CustomInput name="price" setName={setPrice} title="Price" containerStyle="mb-4 w-full" inputStyle='w-full' />
        <CustomInput name="vat_rate" setName={setVatRate} title="VAT Rate" containerStyle="mb-4 w-full" inputStyle='w-full' />

        <CustomButton handleClick={handleSubmit} text="Predict" isLoading={isLoading} buttonStyle='w-full'/>
      </div>

      <div className="mt-6">
        {isLoading && <p>Loading...</p>}
        {isError && <p className="text-red-500">Error: {error?.message}</p>}
        {data && (
          <p className="text-lg">
            <strong>Total Price Prediction:</strong> {data.predicted_total_price}
          </p>
        )}
      </div>
    </div>
  )
}

export default Home