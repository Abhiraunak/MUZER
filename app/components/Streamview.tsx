"use client"
import { Card, CardContent } from "@/components/ui/card";
import { Appbar } from "./Appbar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState } from "react";
// import Image from "next/image";
import { ChevronDown, ChevronUp, Share2 } from "lucide-react";
import { toast } from "sonner";

interface Video {
    id: string;
    type: string;
    url: string;
    extractedId: string;
    title: string;
    smallImg: string;
    bigImg: string;
    active: boolean;
    userId: string;
    upvotes: number;
    haveUpvoted: boolean;
    spaceId: string
}

const REFRESH_INTERVAL_MS = 10 * 1000;

export default function StreamView({
    creatorId,
    playVideo = false
}: {
    creatorId: string;
    playVideo: boolean;
}) {
    const [queue, setQueue] = useState<Video[]>([]);
    const [currentVideo, setCurrentVideo] = useState<Video | null>(null)
    const [loading, setLoading] = useState(false);
    const [inputLink, setInputLink] = useState("");
    const [playNextLoader, setPlayNextLoader] = useState(false);
    const videoPlayerRef = useRef<HTMLDivElement>();

    async function refreshStreams() {
        const res = await fetch(`/api/streams/?creatorId=${creatorId}`, {
            credentials: "include"
        });

        const json = await res.json();
        setQueue(json.streams.sort((a: any, b: any) => a.upvotes < b.upvotes ? 1 : -1));

        setCurrentVideo(video => {
            if (video?.id === json.activeStream?.stream?.id) {
                return video;
            }
            return json.activeStream.stream
        });

    }

    useEffect(() => {
        refreshStreams();
        const interval = setInterval(() => {
            refreshStreams();
        }, REFRESH_INTERVAL_MS)
    }, [])


    const playNext = async () => {
        if (queue.length > 0) {
            try {
                setPlayNextLoader(true)
                const data = await fetch('/api/streams/next', {
                    method: "GET",
                })
                const json = await data.json();
                setCurrentVideo(json.stream)
                setQueue(q => q.filter(x => x.id !== json.stream?.id))
            } catch(e) {
    
            }
            setPlayNextLoader(false)
        }
      }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const res = await fetch("/api/streams/", {
            method: "POST",
            body: JSON.stringify({
                creatorId,
                url: inputLink
            })
        });
        setQueue([...queue, await res.json()])
        setLoading(false);
        setInputLink('')
    }

    const handleShare = () => {
        const shareableLink = `${window.location.hostname}/creator/${creatorId}`
        navigator.clipboard.writeText(shareableLink).then(() => {
          toast.success('Link copied to clipboard!', {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          })
        }, (err) => {
          console.error('Could not copy text: ', err)
          toast.error('Failed to copy link. Please try again.', {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          })
        })
      }

    const handleVote = (id: string, isUpvoted: boolean) => {
        setQueue(queue.map(video =>
            video.id === id
                ? {
                    ...video,
                    upvotes: isUpvoted ? video.upvotes + 1 : video.upvotes - 1,
                    haveUpvoted: !video.haveUpvoted
                }
                : video
        ).sort((a, b) => (b.upvotes) - (a.upvotes)))

        fetch(`/api/streams/${isUpvoted ? "upvote" : "downvote"}`, {
            method: "POST",
            body: JSON.stringify({
                streamId: id
            })
        })
    }

    return (
        <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-900 to-black text-gray-200">
            <Appbar />
            {/* Upcoming song part start from here left part of the screen */}
            <div className="flex justify-center px-5 md:px-10 xl:px-20 pt-5">
                <div className="grid grid-cols-1 gap-y-5 lg:gap-x-5 lg:grid-cols-5 w-screen py-5 lg:py-8">
                    <div className="col-span-3 lg: order-1">
                        <div className="flex flex-col justify-between mb-4">
                            <h1 className="text-2xl text-white font-semibold tracking-tighter">Upcoming Songs</h1>
                        </div>
                        {queue.length === 0 ? (
                            <Card className="bg-gray-800 border-gray-700 shadow-lg">
                                <CardContent className="p-4 flex flex-col md:flex-row md:space-x-3">
                                    <p className="text-center py-4 font-semibold text-gray-400">
                                        No video in queue
                                    </p>
                                </CardContent>
                            </Card>
                        ) : (
                            <div className="space-y-4">
                                {queue.map((video) => (
                                    <Card
                                        key={video.id}
                                        className="bg-gray-800 border-gray-700 shadow-lg hover:shadow-xl transition-shadow"
                                    >
                                        <CardContent className="p-4 flex flex-col md:flex-row md:space-x-3">
                                            <img
                                                src={video.smallImg}
                                                alt={`Thumbnail for ${video.title}`}
                                                className="w-30 h-full object-cover rounded"
                                            />
                                            <div className="flex-grow">
                                                <h3 className="font-semibold text-white text-lg mb-2">
                                                    {video.title}
                                                </h3>
                                                <div className="flex flex-col">
                                                    <span className="font-semibold text-white">
                                                        {video.title}
                                                    </span>
                                                    <div className="flex items-center space-x-2 mt-3">
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() =>
                                                                handleVote(
                                                                    video.id,
                                                                    video.haveUpvoted ? false : true,
                                                                )
                                                            }
                                                            className="flex items-center space-x-1 bg-gray-800 text-white hover:text-white border-gray-700 hover:bg-gray-700 "
                                                        >
                                                            {video.haveUpvoted ? (
                                                                <ChevronDown className="h-4 w-4" />
                                                            ) : (
                                                                <ChevronUp className="h-4 w-4" />
                                                            )}
                                                            <span>{video.upvotes}</span>
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </div>
                    {/* Functionality part where user can add link and video player right side of the screen */}
                    <div className="col-span-2 order-1">
                        <div className="space-y-4">
                            <Card className="bg-gray-800 border-gray-700 shadow-lg">
                                <CardContent className="p-6 space-y-4">
                                    <div className="flex justify-between items-center">
                                        <h2 className="text-2xl font-semibold text-white">Add a Song</h2>
                                        <Button onClick={handleShare} className="bg-indigo-600 text-white font-semibold hover:bg-indigo-700">
                                            <Share2 className="mr-2 h-4 w-4" />  Share</Button>
                                    </div>
                                    <form onSubmit={handleSubmit} className="space-y-3">
                                        <Input
                                            type="text"
                                            value={inputLink}
                                            onChange={(e) => setInputLink(e.target.value)}
                                            placeholder="Paste youtube link here"
                                            className="bg-gray-700 text-white border-gray-600 placeholder-gray-400"
                                        />
                                        <Button
                                            disabled={loading}
                                            type="submit"
                                            onClick={handleSubmit}
                                            className="w-full bg-indigo-600 text-white font-semibold hover:bg-indigo-700"
                                        >{loading ? "Loading ..." : "Add to Queue"}
                                        </Button>
                                    </form>
                                </CardContent>
                            </Card>
                            <Card className="bg-gray-800 border-gray-700 shodow-lg">
                                <CardContent className="p-6 space-y-4">
                                    <h2 className="text-2xl font-semibold text-white">Now Playing</h2>
                                    <Card className="bg-gray-700 border-gray-600">
                                        <CardContent className="pt-3">
                                            {currentVideo ? (
                                                <div>
                                                    {playVideo ? <>
                                                        <div ref={videoPlayerRef} className='w-full' />
                                                        {/* <iframe width={"100%"} height={300} src={`https://www.youtube.com/embed/${currentVideo.extractedId}?autoplay=1`} allow="autoplay"></iframe> */}
                                                    </> : <>
                                                        <img
                                                            src={currentVideo.bigImg}
                                                            className="w-full h-72 object-cover rounded"
                                                        />
                                                        <p className="mt-2 text-center font-semibold text-white">{currentVideo.title}</p>
                                                    </>}
                                                </div>
                                            ) : (
                                                <p className="text-center  text-gray-400">No video playing</p>
                                            )}

                                        </CardContent>
                                    </Card>
                                    <Button
                                        disabled={playNextLoader}
                                        onClick={playNext}
                                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition-colors"
                                    > Play Next
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}