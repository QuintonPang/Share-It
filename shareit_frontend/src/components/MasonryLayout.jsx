import React from 'react'
import Masonry from 'react-masonry-css'

import Pin from './Pin'

// how many colums based on size of screen
const breakpointObj = {
  default: 4,
  3000: 6,
  2000: 5,
  1200: 3,
  1000: 1, // mpbile device
}

const MasonryLayout = ({pins}) => {
  return (
    <Masonry className="flex animate-slide-fwd" breakpointCols={breakpointObj}>
      {pins?.map(pin=><Pin key={pin._id} pin={pin} className="w-full"/>)}
    </Masonry>
  )
}

export default MasonryLayout