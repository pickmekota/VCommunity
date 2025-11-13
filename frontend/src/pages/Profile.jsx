import React from 'react'
import { useParams } from 'react-router-dom'

export default function Profile(){
  const { id } = useParams()
  return (
    <div className="max-w-3xl mx-auto">
      <div className="card-nocturnum p-6 rounded-xl">
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 animate-neon"></div>
          <div>
            <h2 className="text-2xl font-bold">Player #{id}</h2>
            <p className="text-white/60">Rank: Immortal</p>
          </div>
        </div>

        <div className="mt-4">
          <h3 className="font-semibold">Recent activity</h3>
          <p className="text-white/60">No recent activity</p>
        </div>
      </div>
    </div>
  )
}
