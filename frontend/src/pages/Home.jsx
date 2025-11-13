import React from 'react'
import { Link } from 'react-router-dom'

export default function Home(){
  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-2">
        <div className="card-nocturnum p-8 rounded-2xl neon-border overflow-hidden">
          <h1 className="text-4xl font-extrabold mb-2">VCommunity</h1>
          <p className="text-white/70 mb-4">Social hub for agents — find teammates, track training and share highlights.</p>
          <div className="header-deco mb-6"/>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link to="/feed" className="card-nocturnum p-4 rounded-lg hover:scale-[1.01] transition-transform">Feed</Link>
            <Link to="/lfg" className="card-nocturnum p-4 rounded-lg hover:scale-[1.01] transition-transform">Looking For Group</Link>
            <Link to="/training" className="card-nocturnum p-4 rounded-lg hover:scale-[1.01] transition-transform">Training</Link>
            <Link to="/profile/1" className="card-nocturnum p-4 rounded-lg hover:scale-[1.01] transition-transform">Profile</Link>
          </div>
        </div>
      </div>

      <aside className="space-y-4">
        <div className="card-nocturnum p-4 rounded-xl">
          <h3 className="font-semibold">Live Matches</h3>
          <div className="mt-2 text-sm text-white/60">No live matches currently</div>
        </div>

        <div className="card-nocturnum p-4 rounded-xl">
          <h3 className="font-semibold">Top Players</h3>
          <div className="mt-2 text-sm text-white/60">Check Players page</div>
        </div>
      </aside>
    </section>
  )
}
