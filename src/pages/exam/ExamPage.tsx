import React from 'react'
import { useParams } from 'react-router-dom'
import ExamInterface from '@/components/exam/ExamInterface'

const ExamPage: React.FC = () => {
  const { sessionId } = useParams<{ sessionId: string }>()

  if (!sessionId) {
    return (
      <div className="flex-center full-height">
        <div>Invalid exam session</div>
      </div>
    )
  }

  return <ExamInterface />
}

export default ExamPage