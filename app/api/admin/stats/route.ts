import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const [totalInquiries, newInquiries, totalPortfolio, totalBlogPosts] = await Promise.all([
      prisma.inquiry.count(),
      prisma.inquiry.count({ where: { status: 'new' } }),
      prisma.portfolioItem.count(),
      prisma.blogPost.count({ where: { published: true } })
    ])

    return NextResponse.json({
      totalInquiries,
      newInquiries,
      totalPortfolio,
      totalBlogPosts
    })
  } catch (error) {
    console.error('Error fetching stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    )
  }
}
