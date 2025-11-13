import React, {useState} from 'react'

export default function EditProfile(){
  const [name,setName]=useState('')
  const save=()=>alert('Saved (demo)')
  return (
    <div className="max-w-md mx-auto">
      <div className="card-nocturnum p-6 rounded-xl">
        <h3 className="font-semibold mb-3">Edit profile</h3>
        <input value={name} onChange={e=>setName(e.target.value)} className="w-full p-3 bg-transparent border border-white/6 rounded mb-3" placeholder="Display name"/>
        <div className="flex justify-end"><button onClick={save} className="btn-neon">Save</button></div>
      </div>
    </div>
  )
}
