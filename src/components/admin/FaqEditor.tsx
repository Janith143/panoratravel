'use client'

import { useState } from 'react'
import { Plus, Trash2, ChevronDown } from 'lucide-react'
import { FAQCategory } from '@/lib/content'

interface FAQEditorProps {
    content: FAQCategory[]
    setContent: (content: FAQCategory[]) => void
}

export default function FAQEditor({ content, setContent }: FAQEditorProps) {
    const addCategory = () => {
        setContent([...content, { category: 'New Category', questions: [] }])
    }

    const removeCategory = (index: number) => {
        if (!confirm('Delete this entire category?')) return
        const newContent = [...content]
        newContent.splice(index, 1)
        setContent(newContent)
    }

    const updateCategoryTitle = (index: number, title: string) => {
        const newContent = [...content]
        newContent[index].category = title
        setContent(newContent)
    }

    const addQuestion = (catIndex: number) => {
        const newContent = [...content]
        newContent[catIndex].questions.push({ q: 'New Question', a: 'New Answer' })
        setContent(newContent)
    }

    const removeQuestion = (catIndex: number, qIndex: number) => {
        const newContent = [...content]
        newContent[catIndex].questions.splice(qIndex, 1)
        setContent(newContent)
    }

    const updateQuestion = (catIndex: number, qIndex: number, field: 'q' | 'a', value: string) => {
        const newContent = [...content]
        newContent[catIndex].questions[qIndex][field] = value
        setContent(newContent)
    }

    return (
        <div className="space-y-8 max-w-4xl">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold font-serif text-slate-800">Manage FAQs</h2>
                <button onClick={addCategory} className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-lg hover:bg-slate-800 transition">
                    <Plus className="h-4 w-4" /> Add Category
                </button>
            </div>

            {content.map((cat, catIndex) => (
                <div key={catIndex} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm relative group">
                    <div className="flex items-center gap-4 mb-4">
                        <input
                            type="text"
                            value={cat.category}
                            onChange={(e) => updateCategoryTitle(catIndex, e.target.value)}
                            className="text-xl font-bold text-slate-800 bg-transparent border-none focus:ring-0 px-0 w-full"
                            placeholder="Category Title"
                        />
                        <button
                            onClick={() => removeCategory(catIndex)}
                            className="text-red-400 hover:text-red-600 p-2 opacity-0 group-hover:opacity-100 transition-opacity"
                            title="Delete Category"
                        >
                            <Trash2 className="h-5 w-5" />
                        </button>
                    </div>

                    <div className="space-y-4 pl-4 border-l-2 border-slate-100">
                        {cat.questions.map((q, qIndex) => (
                            <div key={qIndex} className="relative group/question p-4 bg-slate-50 rounded-lg border border-slate-100">
                                <button
                                    onClick={() => removeQuestion(catIndex, qIndex)}
                                    className="absolute top-2 right-2 text-red-300 hover:text-red-500 p-1 opacity-0 group-hover/question:opacity-100 transition-opacity"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>
                                <div className="space-y-3">
                                    <input
                                        type="text"
                                        value={q.q}
                                        onChange={(e) => updateQuestion(catIndex, qIndex, 'q', e.target.value)}
                                        className="w-full font-medium text-slate-900 bg-transparent border-b border-slate-200 focus:border-emerald-500 outline-none pb-1"
                                        placeholder="Question"
                                    />
                                    <textarea
                                        value={q.a}
                                        onChange={(e) => updateQuestion(catIndex, qIndex, 'a', e.target.value)}
                                        className="w-full text-sm text-slate-600 bg-transparent border-none focus:ring-0 p-0 resize-none h-20"
                                        placeholder="Answer"
                                    />
                                </div>
                            </div>
                        ))}
                        <button
                            onClick={() => addQuestion(catIndex)}
                            className="w-full py-3 border-2 border-dashed border-slate-200 rounded-lg text-slate-400 font-medium hover:border-emerald-400 hover:text-emerald-500 transition-colors flex items-center justify-center gap-2"
                        >
                            <Plus className="h-4 w-4" /> Add Question
                        </button>
                    </div>
                </div>
            ))}
        </div>
    )
}
