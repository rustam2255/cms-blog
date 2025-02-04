import { IBlog, ICategoryAndTags } from '@/types'
import request, { gql } from 'graphql-request'
import { cache } from 'react'
const graphqlAPI = process.env.NEXT_PUBLIC_GRAPHCMS_ENDPOINT!


export const getTags = async () => {
  const query = `
  query MyQuery {
    tags{
      name
      slug
    }
  }
  `

  const {tags} = await request< {tags: ICategoryAndTags[]} >(
    graphqlAPI,
    query
  )
  return tags 
}



export const getBlogsByTag = cache( async (slug: string) => {
  const query = gql`
  query MyQuery($slug: String!) {
  tag(where: {slug: $slug}) {
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





  const { tag } = await request<{ tag: { blog: IBlog[]; name: string } }>(graphqlAPI, query, { slug })
  return tag
})