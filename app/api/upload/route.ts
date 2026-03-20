import { NextRequest, NextResponse } from 'next/server'
import ImageKit from 'imagekit'

export async function POST(request: NextRequest) {
  try {
    const publicKey = process.env.IMAGEKIT_PUBLIC_KEY
    const privateKey = process.env.IMAGEKIT_PRIVATE_KEY
    const urlEndpoint = process.env.IMAGEKIT_URL_ENDPOINT

    if (!publicKey || !privateKey || !urlEndpoint) {
      return NextResponse.json({ error: 'ImageKit not configured' }, { status: 500 })
    }

    const imagekit = new ImageKit({
      publicKey,
      privateKey,
      urlEndpoint
    })

    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const result = await imagekit.upload({
      file: buffer,
      fileName: file.name,
      folder: 'portfolio'
    })

    return NextResponse.json({
      url: result.url,
      publicId: result.fileId
    })
  } catch (error) {
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}