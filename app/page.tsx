'use client'

import dynamic from 'next/dynamic'
import TopBar from '@/components/TopBar'

const TreeCanvas = dynamic(() => import('@/components/TreeCanvas'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[calc(100vh-3.5rem)] flex items-center justify-center bg-background">
      <div className="text-muted-foreground">Loading visualization...</div>
    </div>
  ),
})

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <TopBar />
      <div className="pt-14">
        <TreeCanvas />
      </div>
    </main>
  )
}