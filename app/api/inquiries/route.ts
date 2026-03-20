import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const inquiries = await prisma.inquiry.findMany({
      orderBy: { createdAt: 'desc' }
    })
    return NextResponse.json(inquiries)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch inquiries' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, phone, company, projectType, service, budget, message, source } = body

    const inquiry = await prisma.inquiry.create({
      data: {
        name,
        email,
        phone,
        company,
        projectType,
        service,
        budget,
        message,
        source
      }
    })

    return NextResponse.json(inquiry, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create inquiry' }, { status: 500 })
  }
}
