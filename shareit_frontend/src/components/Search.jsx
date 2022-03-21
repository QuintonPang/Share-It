import React, { useState, useEffect } from 'react'
import MasonryLayout from './MasonryLayout'
import { client } from '../client'
import { feedQuery, searchQuery } from '../utils/data'
import Spinner from './Spinner'

const Search = ({searchTerm}) => {

  const [pins, setPins] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() =>{
    if(searchTerm){
      setLoading(true)
      const query = searchQuery(searchTerm.toLowerCase())
      client.fetch(query)
      .then(d=>{
        setPins(d)
        setLoading(false)
      })
    }else{
      client.fetch(feedQuery)
      .then(d=>{
        setPins(d)
        setLoading(false)
      })
    }
  },[searchTerm])

  if(loading) return <Spinner message="Searching for pins..."/>

  return (
    <>
    {pins?.length>0&&(
      <MasonryLayout pins={pins}/>
      )}
    {pins?.length===0&&searchTerm!==''&&!loading&&(
      <div className="mt-10 text-center text-xl">
        No pins found
      </div>
    )}
    </>
  )
}

export default Search