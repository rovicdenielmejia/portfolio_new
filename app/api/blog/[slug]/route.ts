import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const post = await prisma.blogPost.findUnique({
      where: { slug: params.slug }
    })
    if (!post) {
      return NextResponse.json({ error: 'Blog post not found' }, { status: 404 })
    }
    return NextResponse.json(post)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch blog post' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const body = await request.json()
    const { title, slug, excerpt, content, coverImage, author, category, tags, published, featured, seoTitle, seoDesc, order } = body

    const existingPost = await prisma.blogPost.findUnique({
      where: { slug: params.slug }
    })

    const post = await prisma.blogPost.update({
      where: { slug: params.slug },
      data: {
        title,
        slug,
        excerpt,
        content,
        coverImage,
        author,
        category,
        tags,
        published,
        featured,
        seoTitle,
        seoDesc,
        order,
        publishedAt: published && !existingPost?.published ? new Date() : existingPost?.publishedAt
      }
    })

    return NextResponse.json(post)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update blog post' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    await prisma.blogPost.delete({
      where: { slug: params.slug }
    })
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete blog post' }, { status: 500 })
  }
}
