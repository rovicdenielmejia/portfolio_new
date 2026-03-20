import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const stats = await Promise.all([
      prisma.inquiry.count({ where: { status: 'new' } }),
      prisma.inquiry.count(),
      prisma.portfolioItem.count(),
      prisma.blogPost.count({ where: { published: true } })
    ])

    const recentInquiries = await prisma.inquiry.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({
      newInquiries: stats[0],
      totalInquiries: stats[1],
      portfolioItems: stats[2],
      publishedPosts: stats[3],
      recentInquiries
    })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 })
  }
}
