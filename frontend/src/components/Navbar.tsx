import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../providers/AuthProvider'
import CustomButton from './CustomButton'

const Navbar = () => {
  const {username, token,logout} = useAuth()

  const [active, setActive] = React.useState(1)
  const navLinks = [
    {id: 1,
      name: 'Home',
      link: '/'
    },
    // {id: 2,
    //   name: 'Profiles',
    //   link: '/profiles',
      
    // },
    // {id: 3,
    //   name: 'Add Dalbaeb',
    //   link: '/add_dalbaeb',
      
    // },
  ]
  return (
    <div className=' flex flex-row justify-between px-5 py-4'>
      <div className='flex flex-row gap-5 items-end'>
        <h1 className='text-2xl text-main'>EazyHackhaton</h1>
        {navLinks.map((item)=>(
          // <Link key={item.id} to={item.link}><p>{item.name}</p></Link>
          <Link key={item.id} to={item.link} className={`text-xl ${active === item.id ? 'text-primary' : ''}`} onClick={() => setActive(item.id)}><p>{item.name}</p></Link>
          
        ))}
      </div>
      <CustomButton handleClick={logout} text='Logout' buttonStyle='w-fit'/>

    </div>
  )
}

export default Navbar