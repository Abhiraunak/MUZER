"use client"
import { Card, CardContent } from "@/components/ui/card";
import { Appbar } from "./Appbar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import Image from "next/image";
import { ChevronDown, ChevronUp, X } from "lucide-react";

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
    upvotes: string;
    haveUpvoted: string;
}

export default function Streamview() {
    const [queue, setQueue] = useState<Video[]>([]);
    const [loading, setLoading] = useState(false);
    const [playNextLoader, setPlayNextLoader] = useState(false);
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
                                            <Image
                                                width={160}
                                                height={160}
                                                src={video.smallImg}
                                                alt={`Thumbnail for ${video.title}`}
                                                className="md:w-40 mb-5 md:mb-0 object-cover rounded-md"
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
                                                            className="flex items-center space-x-1 bg-gray-800 text-white border-gray-700 hover:bg-gray-700"
                                                        >
                                                            {video.haveUpvoted ? (
                                                                <ChevronDown className="h-4 w-4" />
                                                            ) : (
                                                                <ChevronUp className="h-4 w-4" />
                                                            )}
                                                            <span>{video.upvotes}</span>
                                                        </Button>
                                                        {isCreator && (
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => removeSong(video.id)}
                                                                className="bg-gray-700 hover:bg-gray-600 text-white transition-colors"
                                                            >
                                                                <X className="h-4 w-4" />
                                                            </Button>
                                                        )}
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
                                    <h2 className="text-2xl font-semibold text-white">Add a Song</h2>
                                    <form className="space-y-3">
                                        <Input
                                            type="text"
                                            placeholder="Paste youtube link here"
                                            className="bg-gray-700 text-white border-gray-600 placeholder-gray-400"
                                        />
                                        <Button
                                            disabled={loading}
                                            type="submit"
                                            className="w-full bg-indigo-600 text-white font-semibold hover:bg-indigo-700"
                                        >{loading ? "Loading ..." : "Add to Queue"}
                                        </Button>
                                    </form>
                                </CardContent>
                            </Card>
                            <Card className="bg-gray-800 border-gray-700 shodow-lg">
                                <CardContent className="p-6 space-y-4">
                                    <h2 className="text-2xl font-semibold text-white">Now Playing</h2>
                                    <Button
                                        disabled={playNextLoader}
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