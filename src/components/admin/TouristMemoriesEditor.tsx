'use client'

import { useState, useEffect, useRef } from 'react'
import { Save, Plus, Trash2, Image as ImageIcon, Loader2, PlayCircle } from 'lucide-react'
import Image from 'next/image'

type TouristMemory = {
    id: string
    url: string
    title: string | null
    created_at: string
}

export default function TouristMemoriesEditor() {
    const [memories, setMemories] = useState<TouristMemory[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isUploading, setIsUploading] = useState(false)
    const [uploadError, setUploadError] = useState<string | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        fetchMemories()
    }, [])

    const fetchMemories = async () => {
        setIsLoading(true)
        try {
            const res = await fetch('/api/tourist-memories')
            const data = await res.json()
            if (data.images) {
                setMemories(data.images)
            }
        } catch (error) {
            console.error('Failed to fetch memories:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleUploadClick = () => {
        fileInputRef.current?.click()
    }

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        if (!files || files.length === 0) return

        setIsUploading(true)
        setUploadError(null)

        try {
            // Upload files one by one to avoid 413 Payload Too Large limits on VPS/Nginx
            let successCount = 0;
            for (let i = 0; i < files.length; i++) {
                const formData = new FormData()
                formData.append('file', files[i])

                const response = await fetch('/api/tourist-memories', {
                    method: 'POST',
                    body: formData,
                })

                const data = await response.json()
                if (data.success) {
                    successCount++;
                }
            }

            if (successCount > 0) {
                // Refresh list if at least one succeeded
                await fetchMemories()
            }

            if (successCount < files.length) {
                setUploadError(`Only ${successCount} of ${files.length} uploaded successfully. Some files may be too large.`)
            }
        } catch (error) {
            console.error('Upload Error:', error)
            setUploadError('Network error uploading files. Files might be too large.')
        } finally {
            setIsUploading(false)
            if (fileInputRef.current) {
                fileInputRef.current.value = '' // Reset input
            }
        }
    }

    const handleDelete = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation()

        if (!window.confirm('Are you sure you want to delete this memory?')) {
            return
        }

        try {
            const res = await fetch(`/api/tourist-memories?id=${id}`, {
                method: 'DELETE',
            })
            const data = await res.json()
            if (data.success) {
                setMemories(prev => prev.filter(m => m.id !== id))
            } else {
                alert('Failed to delete: ' + data.message)
            }
        } catch (error) {
            console.error('Delete error', error)
            alert('Error deleting memory')
        }
    }

    const isVideo = (url: string) => {
        const ext = url.split('.').pop()?.toLowerCase() || ''
        return ['mp4', 'webm', 'mov', 'ogg'].includes(ext)
    }

    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200">
            <div className="p-6 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl font-bold text-slate-900">Tourist Memories</h2>
                    <p className="text-sm text-slate-500 mt-1">
                        Upload photos and videos of travelers. They will appear below the Reviews page.
                    </p>
                </div>

                <div className="flex gap-4">
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept="image/*,video/mp4,video/quicktime"
                        multiple
                        className="hidden"
                    />
                    <button
                        onClick={handleUploadClick}
                        disabled={isUploading}
                        className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition disabled:opacity-50"
                    >
                        {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                        {isUploading ? 'Uploading...' : 'Upload Media'}
                    </button>
                </div>
            </div>

            {/* Error Message */}
            {uploadError && (
                <div className="bg-red-50 text-red-600 p-4 border-b border-red-100 flex items-center justify-between">
                    <span>{uploadError}</span>
                    <button onClick={() => setUploadError(null)} className="text-red-400 hover:text-red-600">×</button>
                </div>
            )}

            <div className="p-6">
                {isLoading ? (
                    <div className="flex justify-center items-center py-20">
                        <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
                    </div>
                ) : memories.length === 0 ? (
                    <div className="text-center py-20 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50">
                        <ImageIcon className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-slate-900 mb-1">No memories uploaded</h3>
                        <p className="text-slate-500 mb-4 max-w-md mx-auto">Upload some photos or videos to showcase the experiences of your travelers.</p>
                        <button
                            onClick={handleUploadClick}
                            className="bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 px-4 py-2 rounded-lg font-medium transition"
                        >
                            Select Files
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                        {memories.map((memory) => (
                            <div key={memory.id} className="group relative aspect-square bg-slate-100 rounded-xl overflow-hidden shadow-sm border border-slate-200">
                                {isVideo(memory.url) ? (
                                    <>
                                        <video
                                            src={memory.url}
                                            className="w-full h-full object-cover"
                                            muted
                                            playsInline
                                        />
                                        <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-colors">
                                            <PlayCircle className="w-10 h-10 text-white/80" />
                                        </div>
                                    </>
                                ) : (
                                    <Image
                                        src={memory.url}
                                        alt={memory.title || 'Memory'}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                )}

                                {/* Overlay gradient */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                                {/* Top bar (date & delete) */}
                                <div className="absolute top-0 inset-x-0 p-3 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity translate-y-[-10px] group-hover:translate-y-0 duration-300">
                                    <span className="text-xs text-white bg-black/50 px-2 py-1 rounded backdrop-blur-sm shadow-sm">
                                        {new Date(memory.created_at).toLocaleDateString()}
                                    </span>
                                    <button
                                        onClick={(e) => handleDelete(memory.id, e)}
                                        className="bg-red-500/90 text-white p-1.5 rounded hover:bg-red-600 transition shadow-sm backdrop-blur-sm"
                                        title="Delete Memory"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>

                                {/* Bottom bar (title) */}
                                {memory.title && (
                                    <div className="absolute bottom-0 inset-x-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity translate-y-[10px] group-hover:translate-y-0 duration-300">
                                        <p className="text-sm text-white truncate drop-shadow-md font-medium">
                                            {memory.title}
                                        </p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
