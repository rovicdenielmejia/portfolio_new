import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const published = searchParams.get('published')

    const where: Record<string, unknown> = {}
    if (category) where.category = category
    if (published === 'true') where.published = true

    const posts = await prisma.blogPost.findMany({
      where,
      orderBy: [{ featured: 'desc' }, { order: 'asc' }, { createdAt: 'desc' }],
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        coverImage: true,
        author: true,
        category: true,
        tags: true,
        published: true,
        featured: true,
        seoTitle: true,
        seoDesc: true,
        order: true,
        createdAt: true,
        updatedAt: true,
        publishedAt: true
      }
    })

    return NextResponse.json(posts)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch blog posts' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, slug, excerpt, content, coverImage, author, category, tags, published, featured, seoTitle, seoDesc, order } = body

    const post = await prisma.blogPost.create({
      data: {
        title,
        slug,
        excerpt,
        content,
        coverImage,
        author,
        category,
        tags,
        published: published || false,
        featured: featured || false,
        seoTitle,
        seoDesc,
        order: order || 0,
        publishedAt: published ? new Date() : null
      }
    })

    return NextResponse.json(post, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create blog post' }, { status: 500 })
  }
}
