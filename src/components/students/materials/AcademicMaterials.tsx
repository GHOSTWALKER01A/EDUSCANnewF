// src/components/materials/AcademicMaterials.tsx
'use client'
import React, { useState } from 'react'
import ResourceCard from './ResourceCard'
import ResourceViewerModal from './ResourceViewerModal'
import { useMaterials } from '../../../hooks/useMaterials'
import { Resource } from '../../../types/resource.type'

export default function AcademicMaterials() {
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<Resource | null>(null)

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } = useMaterials({ type: 'Academic Material', search, limit: 12 })

  const resources = data?.pages?.flat() ?? []

  return (
    <section className="mb-10">
      <h2 className="text-2xl font-bold text-[var(--accent)] mb-4">Academic Materials</h2>
      <div className="mb-4">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search materials..."
          className="w-full max-w-md p-2 border rounded"
          aria-label="Search academic materials"
        />
      </div>

      

      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {resources.map((r: Resource) => (
          <ResourceCard key={r._id} resource={r} onOpen={(res)=> setSelected(res)} />
        ))}
      </div>

      <div className="mt-6 text-center">
        {hasNextPage ? (
          <button onClick={() => fetchNextPage()} disabled={isFetchingNextPage} className="px-4 py-2 rounded bg-[var(--accent)] text-[var(--bg-primary)]">
            {isFetchingNextPage ? 'Loading...' : 'Load more'}
          </button>
        ) : (
          <div className="text-sm text-[var(--text-secondary)]">No more materials</div>
        )}
      </div>

      <ResourceViewerModal open={!!selected} resource={selected} onClose={() => setSelected(null)} />
    </section>
  )
}
