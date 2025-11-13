import React, {useState} from 'react'
import { useNavigate } from 'react-router-dom'

export default function Login(){
  const [email,setEmail]=useState('')
  const [password,setPassword]=useState('')
  const nav = useNavigate()

  const submit = (e)=>{e.preventDefault();
    // dummy login
    localStorage.setItem('user', JSON.stringify({id:1, name:'Viktoria'}))
    localStorage.setItem('token', 'fake-jwt')
    nav('/feed')
  }

  return (
    <div className="max-w-md mx-auto">
      <form onSubmit={submit} className="card-nocturnum p-6 rounded-xl">
        <h2 className="text-2xl font-bold mb-4">Sign in</h2>
        <input value={email} onChange={e=>setEmail(e.target.value)} className="w-full mb-3 p-3 bg-transparent border border-white/6 rounded" placeholder="Email" />
        <input type="password" value={password} onChange={e=>setPassword(e.target.value)} className="w-full mb-4 p-3 bg-transparent border border-white/6 rounded" placeholder="Password" />
        <div className="flex justify-between items-center">
          <button className="btn-neon" type="submit">Sign in</button>
          <a className="text-sm text-white/60" href="/register">Register</a>
        </div>
      </form>
    </div>
  )
}
