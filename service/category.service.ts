import { IBlog, ICategoryAndTags } from '@/types'
import request, { gql } from 'graphql-request'
import { cache } from 'react'
const graphqlAPI = process.env.NEXT_PUBLIC_GRAPHCMS_ENDPOINT!

export const getCategory = async () => {
  const query = `
  query MyQuery {
    categories{
      name
      slug
    }
  }
  `

  const {categories} = await request< {categories: ICategoryAndTags[]} >(
    graphqlAPI,
    query
  )
  return categories 
}

export const getBlogsByCategory = cache( async (slug: string) => {
  const query = gql`
  query MyQuery($slug: String!) {
  category(where: {slug: $slug}) {
    blog {
    
        author {
      name
      bio
      image {
        url
      }
    }
    content {
      html  
    }
    createdAt
    image {
      url
    }
    slug
    title
    tag {
      name
      slug
    }
    category{
      name
      slug
    }
    }
    name
  }
}
  `





  const { category } = await request<{ category: { blog: IBlog[]; name: string } }>(graphqlAPI, query, { slug })
  return category
}
)