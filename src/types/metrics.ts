// src/types/metrics.ts
export type Tip = {
     id: string; 
     text: string 
    }

export type DueItem = {
     id: string;
    amount: number;
    dueDate: string;
     description?: string;
     paid?: boolean 
        }

export type Contribution = {
     attendance: number // percent
      backlogs: number
       fees: number
}

export type SeriesPoint = { date: string; value: number }

export type StudentMetrics = {
  attendancePercent: number // 0..100
  academicScore: number // 0..100
  feeStatusPercent: number // 0..100 (0 = unpaid, 100 = all paid)
  points: number
  tips: Tip[]
  risk: 'low' | 'medium' | 'high'
  riskExplanation: string
  contribution: Contribution
  checklist: { id: string; text: string; done: boolean }[]
  dueFees: DueItem[]
  attendanceSeries: SeriesPoint[] // daily/weekly series for attendance graph
  gradesSeries: SeriesPoint[] // series for grades
}
