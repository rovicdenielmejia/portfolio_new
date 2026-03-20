import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const item = await prisma.portfolioItem.findUnique({
      where: { id: params.id }
    })
    if (!item) {
      return NextResponse.json({ error: 'Portfolio item not found' }, { status: 404 })
    }
    return NextResponse.json(item)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch portfolio item' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { title, slug, category, description, content, imageUrl, images, featured, order } = body

    const item = await prisma.portfolioItem.update({
      where: { id: params.id },
      data: {
        title,
        slug,
        category,
        description,
        content,
        imageUrl,
        images,
        featured,
        order
      }
    })

    return NextResponse.json(item)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update portfolio item' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.portfolioItem.delete({
      where: { id: params.id }
    })
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete portfolio item' }, { status: 500 })
  }
}
