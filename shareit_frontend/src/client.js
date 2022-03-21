import sanityClient from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'

export const client = sanityClient({
    projectId: process.env.REACT_APP_SANITY_PROJECT_ID,
    dataset:'production',
    apiVersion:'2022-03-11',
    useCdn:true, // allow to show images to people around the world,
    token: process.env.REACT_APP_SANITY_TOKEN,
})

const builder = imageUrlBuilder(client)

export const urlFor = (source) => builder.image(source);