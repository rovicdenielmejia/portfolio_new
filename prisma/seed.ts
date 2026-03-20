import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 10)
  const admin = await prisma.adminUser.upsert({
    where: { email: 'admin@rovicmejia.com' },
    update: {},
    create: {
      email: 'admin@rovicmejia.com',
      password: hashedPassword,
      name: 'Admin'
    }
  })
  console.log('Created admin user:', admin.email)

  // Create default settings
  const settings = [
    { key: 'siteTitle', value: 'Rovic Mejia Portfolio' },
    { key: 'siteDescription', value: 'Hybrid Creative & Workforce Strategist' },
    { key: 'contactEmail', value: 'rovicdenielmejia@gmail.com' },
    { key: 'phoneNumber', value: '+639755636276' },
    { key: 'facebookUrl', value: 'https://www.facebook.com/rovicmejia07/' },
    { key: 'instagramUrl', value: 'https://www.instagram.com/rovicmejia.official/' }
  ]

  for (const setting of settings) {
    await prisma.settings.upsert({
      where: { key: setting.key },
      update: {},
      create: setting
    })
  }
  console.log('Created default settings')

  // Create sample services
  const services = [
    {
      title: 'Brand Identity Design',
      slug: 'brand-identity-design',
      category: 'brand-strategy',
      shortDesc: 'Professional logo and visual identity systems for growing businesses.',
      description: 'Complete brand identity design including logo design, color palette, typography, and brand guidelines.',
      price: 'Starting at ₱8,000',
      features: ['Logo Design', 'Color Palette', 'Typography System', 'Brand Guidelines', 'Source Files'],
      icon: 'palette',
      active: true,
      order: 1
    },
    {
      title: 'Social Media Visual System',
      slug: 'social-media-visual-system',
      category: 'brand-strategy',
      shortDesc: 'Consistent social media graphics that elevate your brand presence.',
      description: 'Template-based social media design system for consistent brand communication across platforms.',
      price: 'Starting at ₱5,000',
      features: ['Post Templates', 'Story Templates', 'Cover Images', 'Highlight Covers', 'Content Calendar'],
      icon: 'share',
      active: true,
      order: 2
    },
    {
      title: 'HR Recruitment Support',
      slug: 'hr-recruitment-support',
      category: 'hr-strategy',
      shortDesc: 'Structured recruitment process to find the right talent for your team.',
      description: 'End-to-end recruitment support including job posting, screening, and candidate endorsement.',
      price: 'Starting at ₱15,000/month',
      features: ['Job Posting', 'Resume Screening', 'Initial Interviews', 'Candidate Reports', 'Onboarding Support'],
      icon: 'users',
      active: true,
      order: 3
    },
    {
      title: 'HR Documentation System',
      slug: 'hr-documentation-system',
      category: 'hr-strategy',
      shortDesc: 'Organized HR documentation for compliance and efficiency.',
      description: 'Comprehensive HR documentation including policies, procedures, and employee handbooks.',
      price: 'Starting at ₱10,000',
      features: ['Policy Documents', 'Employee Handbook', 'Forms & Templates', 'Compliance Checklist', 'Digital Organization'],
      icon: 'file-text',
      active: true,
      order: 4
    }
  ]

  for (const service of services) {
    await prisma.service.upsert({
      where: { slug: service.slug },
      update: {},
      create: service
    })
  }
  console.log('Created sample services')

  // Create sample portfolio items
  const portfolioItems = [
    {
      title: 'TQF Brand Identity',
      slug: 'tqf-brand-identity',
      category: 'brand-identity',
      description: 'Modern logo and visual direction for a growing business.',
      content: 'Complete brand identity system for TQF including logo design, color palette, typography, and brand guidelines.',
      imageUrl: 'Portfolio/LOGO/TQF Poster.png',
      featured: true,
      order: 1
    },
    {
      title: 'Social Media Visual Framework',
      slug: 'social-media-visual-framework',
      category: 'social-media',
      description: 'Structured layout system for consistent brand communication.',
      content: 'Comprehensive social media visual system with templates for posts, stories, and covers.',
      imageUrl: 'Portfolio/Posters/Social Media Posters/PERSONALIZED REF Magnets.png',
      featured: true,
      order: 2
    },
    {
      title: 'Event Campaign Design',
      slug: 'event-campaign-design',
      category: 'event',
      description: 'High-impact promotional materials for organized events.',
      content: 'Complete event promotional design including posters, social media graphics, and print materials.',
      imageUrl: 'Portfolio/Posters/Pageants/First Page Final Draft.jpg',
      featured: true,
      order: 3
    },
    {
      title: 'HR Documentation System',
      slug: 'hr-documentation-sample',
      category: 'specialized',
      description: 'Structured employment templates and internal policy systems.',
      content: 'Professional HR documentation including employment contracts, policies, and procedure manuals.',
      imageUrl: 'Portfolio/Posters/REcruitment Posters/urgent hiring.png',
      featured: false,
      order: 4
    }
  ]

  for (const item of portfolioItems) {
    await prisma.portfolioItem.upsert({
      where: { slug: item.slug },
      update: {},
      create: item
    })
  }
  console.log('Created sample portfolio items')

  // Create sample blog posts
  const blogPosts = [
    {
      title: 'Why SMEs Need Professional Brand Identity',
      slug: 'why-smes-need-professional-brand-identity',
      excerpt: 'Discover why investing in professional brand identity is crucial for small and medium enterprises.',
      content: '<p>Brand identity is more than just a logo...</p>',
      category: 'brand-identity',
      author: 'Rovic Mejia',
      published: true,
      featured: true,
      seoTitle: 'Why SMEs Need Professional Brand Identity | Rovic Mejia',
      seoDesc: 'Learn why small and medium enterprises should invest in professional brand identity design for business growth.',
      order: 1
    },
    {
      title: 'Building Effective Recruitment Processes for SMEs',
      slug: 'building-effective-recruitment-processes',
      excerpt: 'A guide to creating structured recruitment processes that attract the right talent.',
      content: '<p>Recruitment is critical for business success...</p>',
      category: 'hr',
      author: 'Rovic Mejia',
      published: true,
      featured: false,
      order: 2
    }
  ]

  for (const post of blogPosts) {
    await prisma.blogPost.upsert({
      where: { slug: post.slug },
      update: {},
      create: post
    })
  }
  console.log('Created sample blog posts')

  console.log('Seeding complete!')
  console.log('Admin login: admin@rovicmejia.com / admin123')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
