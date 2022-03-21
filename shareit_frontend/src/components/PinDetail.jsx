import React, { useState, useEffect } from 'react'
import { MdDownloadForOffline } from 'react-icons/md'
import { Link, useParams } from 'react-router-dom'
import { v4 as uuidv4 } from 'uuid'

import { client, urlFor } from '../client'
import MasonryLayout from './MasonryLayout'
import { pinDetailMorePinQuery, pinDetailQuery } from '../utils/data'
import Spinner from './Spinner'

const PinDetail = ({user}) => {

  const [pins, setPins] = useState(null)
  const [pinDetail, setPinDetail] = useState(null)
  const [comment, setComment] = useState('')
  const [addingComment, setAddingComment] = useState(false) // check if user is currently adding comment
  const { pinId } = useParams()

  
  const fetchPinDetail = () => {
    let query = pinDetailQuery(pinId)
    if(query){
      client.fetch(query)
      .then(d=>{
        setPinDetail(d[0])
        // console.log(d)
        if(d[0]){
          query = pinDetailMorePinQuery(d[0])

          // fetching similar pins for recommendations
          client.fetch(query)
          .then(res=>setPins(res))
        }
      })
    }
  }

  const addComment = ()=>{
    if(comment){
      setAddingComment(true)
      client.patch(pinId)
      .setIfMissing({comments:[]}) // if the post does not have comments, set it to an array
      .insert('after','comments[-1]',[{
        comment,
        _key:uuidv4(),
        postedBy:{
          _type:"postedBy",
          _ref:user._id,
        },
      }])
      .commit()
      .then(()=>{
        fetchPinDetail()
        setComment('')
        setAddingComment(false)
      })
    }
  }
  
  useEffect(()=>{
      let interval = setInterval(() => 
      fetchPinDetail() , (500))
      //destroy interval on unmount
      return () => clearInterval(interval)
  },[pinId])
  
  if(!pinDetail) return <Spinner message="We are loading your pin..."/>
  
  return (
    <>
      <div className="flex xl:flex-row flex-col flex-col m-auto bg-white" style={{maxWidth:"1500px", borderRadius:"32px"}}>
        <div className="flex justify-center items-center md:items-start flex-inital">
          <img
            src={pinDetail?.image&&urlFor(pinDetail.image).url()}
            className="rounded-t-3xl rounded-b-lg"
            alt="user-post" 
          />
        </div>
        <div className="w-full p-5 flex-1 xl:min-w-629">
          <div className="flex items-center justify-between">
            <div className="flex gap-2 items-center">
              <a
                href={`${pinDetail.image?.asset?.url}?dl=`}
                download
                onClick={(e)=>e.stopPropagation()}
                className="bg-white w-9 h-9 rounded-full flex items-center justify-center text-dark text-lg opacity-75 hover:opacity-100 hover:shadow-md outline-none"
                >
                    <MdDownloadForOffline/>
                </a>
              </div>
              {/* by adding "noreferrer", no information will be leaked to destination link */}
              <a href={pinDetail.destination} target="_blank" rel="noreferrer">
                {pinDetail.destination}
              </a>
          </div>
          <div>
            <h1 className="text-4xl font-bold break-words mt-3">
              {pinDetail.title}
            </h1>
            <p className="mt-3">{pinDetail.about}</p>
          </div>
          <Link to={`user-profile/${pinDetail.postedBy._id}`} className="flex gap-2 mt-5 items-center bg-white rounded-lg">
                  <img
                      className="w-8 h-8 rounded-full object-cover"
                      src={pinDetail.postedBy?.image}
                      alt="user-profile"
                  />
                  <p className="font-semibold capitalize">{pinDetail.postedBy?.userName}</p>
          </Link>
          <h2 className="mt-5 text-2xl">Comments</h2>
          <div className="max-h-370 overflow-y-auto ">
            {pinDetail?.comments?.map((comment,i)=>(
              <div className="flex gap-2 mt-5 items-center bg-white rounded-lg" key={i}>
                <img src={comment.postedBy.image}
                  alt="user-profile"
                  className="w-10 h-10 rounded-full cursor-pointer"
                />
                <div className="flex flex-col">
                  <p className="font-bold">{comment.postedBy.userName}</p>
                  <p>{comment.comment}</p>
                </div>
              </div>
            ))}
          </div>
          {/* flex-wrap means break a flex item into multiple lines */}
          <div className="flex flex-wrap mt-6 gap-3">
            <Link to={`user-profile/${user?._id}`}>
              <img
                  className="w-10 h-10 rounded-full cursor-pointer"
                  src={user?.image}
                  alt="user-profile"
              />
            </Link>
            <input
              className="flex-1 boreder-gray-100 outline-none border-2 p-2 rounded-2xl focus-border-gray-300"
              type="text"
              placeHolder="Add your comment here"
              value={comment /* default value */ }
              onChange={e=>setComment(e.target.value)}
            />
            <button
              className="bg-red-500 text-white rounded-full px-6 font-semibold outline-none"
              onClick={addComment}
            >
              {addingComment?'Posting comment...':'Comment'}
            </button>
          </div>
        </div>
      </div>
      {pins?.length>0?(
        <>
        <h2 className="text-center font-bold text-2xl mt-8 mb-4">
          Other pins that you might be interested in
        </h2>
        <MasonryLayout pins={pins}/>
        </>
      ):(
        <Spinner message="Loading more similar pins for you..."/>
      )}
    </>
  )
}

export default PinDetail