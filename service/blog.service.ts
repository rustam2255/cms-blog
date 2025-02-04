import { IArchivedBlog, IBlog } from '@/types'
import request, { gql } from 'graphql-request'
import { cache } from 'react'
const graphqlAPI = process.env.NEXT_PUBLIC_GRAPHCMS_ENDPOINT!

export const getBlogs = async () => {
  const query = gql`
    query MyQuery {
  blogs(where: {archive: false}) {
    title
    slug
    author {
      name  blog(where: {slug: "the-agi-hype-train-is-running-out-of-steam"}) {
    author {
      name
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
    tag {
      name
      slug
    }
  }
      image {
        url
      }
    }
    category {
      name
      slug
    }
    description
    tag {
      name
      slug
    }
    image {
      url
    }
    content {
      html
    }
    createdAt
  }
}
  `
  const { blogs } = await request<{ blogs: IBlog[] }>(graphqlAPI, query)
  return blogs
}
export const getDetailedBlog = cache( async (slug: string) => {
  const query = gql`
    query myQuery($slug: String!) {
  blog(where: {slug: $slug}) {
    author {
      name
      id
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
}
  `
  const { blog } = await request<{ blog: IBlog }>(graphqlAPI, query, { slug })
  return blog
}
)

export const getSearchBlog = async (title: string) => {
  const query = gql`
    query MyQuery($title: String!) {
  blogs(where: {title_contains: $title}) {
    title
    image{
      url
    }
    slug
    createdAt
  }
}
  `
  const {blogs} = await request<{blogs: IBlog[]} >(graphqlAPI, query, {title})
  return blogs 
}
export const getArchiveBlogs = async ()  => {
	const query = gql`
		query MyQuery {
			blogs(where: { archive: true }) {
				title
				createdAt
				slug
			}
		}
	`

	const { blogs } = await request<{ blogs: IBlog[] }>(graphqlAPI, query)
	const filteredBlogs = blogs.reduce(
		(acc: { [year: string]: IArchivedBlog }, blog: IBlog) => {
			const year = blog.createdAt.substring(0, 4)
			if (!acc[year]) {
				acc[year] = { year, blogs: [] }
			}
			acc[year].blogs.push(blog)
			return acc
		},
		{}
	)
	const results: IArchivedBlog[] = Object.values(filteredBlogs)
	return results
}
