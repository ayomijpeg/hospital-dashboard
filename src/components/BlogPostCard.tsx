'use client'

import { useState } from 'react'

type BlogPost = {
  id: number
  title: string
  author: string
  date: string
  snippet: string
  content: string
}

type Props = {
  post: BlogPost
}

export default function BlogPostCard({ post }: Props) {
  const [open, setOpen] = useState(false)

  if (!post) return null

  return (
    <div className="relative">
      <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition">
        <h2 className="text-xl font-semibold text-teal-700 mb-1">{post.title}</h2>
        <p className="text-sm text-gray-500 mb-2">
          By {post.author} • {post.date}
        </p>
        <p className="text-gray-700 mb-4">{post.snippet}</p>
        <button
          onClick={() => setOpen(true)}
          className="text-sm font-medium text-teal-600 hover:underline"
        >
          Read More →
        </button>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/60 backdrop-blur-sm">
          <div className="relative bg-white max-w-2xl w-full p-6 rounded-xl shadow-xl animate-fadeIn transform scale-95 transition duration-300">
            <button
              onClick={() => setOpen(false)}
              className="absolute top-2 right-3 text-gray-500 hover:text-red-500 text-xl"
              aria-label="Close"
            >
              ×
            </button>
            <h2 className="text-2xl font-bold mb-2">{post.title}</h2>
            <p className="text-sm text-gray-500 mb-4">
              By {post.author} • {post.date}
            </p>
            <div className="text-gray-800 leading-relaxed">{post.content}</div>
          </div>
        </div>
      )}
    </div>
  )
}
