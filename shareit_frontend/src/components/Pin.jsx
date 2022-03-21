import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { v4 as uuidv4 } from 'uuid' // provides unique id for each post
import { urlFor, client } from '../client'
import { MdDownloadForOffline } from 'react-icons/md'
import { AiTwotoneDelete } from 'react-icons/ai'
import { BsFillArrowUpRightCircleFill } from 'react-icons/bs'
import { fetchUser } from '../utils/fetchUser'

const Pin = ({pin:{postedBy,image,_id,destination,save}}) => {

    const [postHovered, setPostHovered] = useState(false)
    // unnecessary because it happens very fast
    // const [savingPost, setSavingPost] = useState(false)

    const userInfo = fetchUser()
    const navigate = useNavigate()

    // return true of false instead of array 
    const alreadySaved = !!(save?.filter((item)=>item?.postedBy?._id===userInfo?.uid))?.length

    // delete pin
    const deletePin = (id) =>{
        client
        .delete(id)
        .then(()=>{
            window.location.reload()
        })
    }

    // save pin
    const savePin=(id)=>{
        if(!alreadySaved){
            // setSavingPost(true)
            client
            .patch(id)
            .setIfMissing({save:[]})
            .insert('after','save[-1]',[{
                _key: uuidv4(),
                userId:userInfo?.uid,
                postedBy:{ // who liked
                    _type:'postedBy',
                    _ref: userInfo?.uid
                }
            }])
            .commit()
            .then(()=>{
                window.location.reload()
                // setSavingPost(false)
            })
        }
    }

    return (
        <div className="m-2">
            <div
                onMouseEnter ={()=>setPostHovered(true)}
                onMouseLeave ={()=>setPostHovered(false)}
                onClick={()=>navigate(`/pin-detail/${_id}`)}
                className="relative cursor-zoom-in w-auto hover:shadow-lg rounded-lg overflow-hidden transition-all duration-5000 ease-in-out"
            >
                <img className="rounded-lg w-full" alt="user-post" src={urlFor(image).width(250).url()}/> {/* sanity's way for efficiently fetching images, it is optmized to the width given*/}
                {postHovered&&(
                    
                    <div className="absolute top-0 w-full h-full flex flex-col justify-between p-1 pr-2 pt-2 pb-2 z-50"
                        style={{height:"100%"}}
                    >
                        <div className="flex gap-2 ">
                            {/* download link of an image */}
                            {/* stop propogation prevents click from propagating through an element*/}
                            {/* download attribute means download file specified in href attribute */}
                            <a
                            href={`${image?.asset?.url}?dl=`}
                            download
                            onClick={(e)=>e.stopPropagation()}
                            className="bg-white w-9 h-9 rounded-full flex items-center justify-center text-dark text-lg opacity-75 hover:opacity-100 hover:shadow-md outline-none"
                            >
                                <MdDownloadForOffline/>
                            </a>
                        </div>
                        {alreadySaved?(
                            <button className="bg-red-500 opacity-70 hover:opacity-100 text-white font-bold px-5 py-1 text-base rounded-3xl hover:shadow-md outline-none">
                                {save?.length} Saved
                            </button>
                        ):(
                            <button 
                                onClick={(e)=>{
                                    e.stopPropagation()
                                    savePin(_id)
                                }}
                                className="bg-red-500 opacity-70 hover:opacity-100 text-white font-bold px-5 py-1 text-base rounded-3xl hover:shadow-md outline-none"
                            >
                                    {/* {savingPost?"Saving":"Save"} */}
                                    Save
                            </button>
                        )}
                      
                        <div className="flex justify-between items-center gap-2 w-full">
                            {destination&&(
                                <a
                                href={destination}
                                target="_blank"
                                rel="noreferrer"
                                className="bg-white flex items-center gap-2 text-black font-bold p-2 pl-4 pr-4 rounded-full opacity-70 hover:opacity:100 hover:shadow-md"
                                >
                                    <BsFillArrowUpRightCircleFill/>
                                    {/* 15 is exclusive */}
                                    {destination.length>15?destination.slice(0,15)+"...":destination}
                                </a>
                            )}
                            {postedBy?._id===userInfo?.uid&&(
                                <button
                                    className="bg-white p-2 opacity-70 hover:opacity-100 text-dark font-bold text-base rounded-3xl hover:shadow-md outline-none"
                                    onClick={(e)=>{
                                        e.stopPropagation()
                                        deletePin(_id)
                                    }}
                                >
                                    <AiTwotoneDelete/>
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </div>
            <Link to={`user-profile/${postedBy._id}`} className="flex gap-2 mt-2 items-center">
                <img
                    className="w-8 h-8 rounded-full object-cover"
                    src={postedBy?.image}
                    alt="user-profile"
                />
            </Link>
            <p className="font-semibold capitalize">{postedBy?.userName}</p>
        </div>
    )
}

export default Pin