"use client"
import { Card, CardContent } from "@/components/ui/card";
import { Appbar } from "./Appbar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import Image from "next/image";
import { ChevronDown, ChevronUp, Share2, X } from "lucide-react";
import { toast } from "sonner";
import { YT_REGEX } from "../api/lib/utils";
import { Dialog, DialogTitle } from "@radix-ui/react-dialog";
import { DialogContent, DialogDescription, DialogFooter, DialogHeader } from "@/components/ui/dialog";

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

export default function Streamview({ creatorId }: { creatorId: string }) {
    const [queue, setQueue] = useState<Video[]>([]);
    const [loading, setLoading] = useState(false);
    const [inputLink, setInputLink] = useState("");
    const [playNextLoader, setPlayNextLoader] = useState(false);
    const [isEmptyQueueDialogOpen, setIsEmptyQueueDialogOpen] = useState(false);


    function refreshStream() {


    }

    useEffect(() => {
        refreshStream();
        const interval = setInterval(() => {

        }, REFRESH_INTERVAL_MS)
    }, [])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
    
        if (!inputLink.trim()) {
            toast.error("YouTube link cannot be empty");
            return;
        }
    
        if (!inputLink.match(YT_REGEX)) {
            toast.error("Invalid YouTube URL format");
            return;
        }
    
        setLoading(true);
    
        try {
            const body = JSON.stringify({
                creatorId,
                url: inputLink,
            });
    
            console.log("Sending Request:", body);
    
            const res = await fetch("/api/streams", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body,
            });
    
            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || "Failed to add stream");
            }
    
            const data = await res.json();
            setQueue((prev) => [...prev, data]);
            setInputLink("");
            toast.success("Song added to queue successfully");
        } catch (error) {
            console.error("Error in handleSubmit:", error);
            toast.error(error instanceof Error ? error.message : "An unexpected error occurred");
        } finally {
            setLoading(false);
        }
    };
    

    // handle the upvote and downvote 
    const handleVote = (id: string, isUpvote: boolean) => {
        setQueue(
            queue
                .map((video) =>
                    video.id === id
                        ? {
                            ...video,
                            upvotes: isUpvote ? video.upvotes + 1 : video.upvotes - 1,
                            haveUpvoted: !video.haveUpvoted,
                        }
                        : video,
                )
                .sort((a, b) => b.upvotes - a.upvotes),
        );

        fetch(`/api/streams/${isUpvote ? "upvote" : "downvote"}`, {
            method: "POST",
            body: JSON.stringify({
                streamId: id,
                // spaceId:spaceId
            }),
        });
    };

    // add the logic for make the queue empty
    const emptyQueue = async () => {
        try {
            const res = await fetch("/api/streams/empty-queue", {
                method: "POST",
                headers: {
                    'content-type': 'application/json'
                },
                body: JSON.stringify({
                    // spaceId:spaceId
                })
            });

            const data = await res.json();
            if (res.ok) {
                toast.success(data.message);
                refreshStream();
                setIsEmptyQueueDialogOpen(false);
            } else {
                toast.error(data.message || "Failed to empty queue")
            }

        } catch (error) {
            console.error("Error empty queue", error);
            toast.error("An erro occured while empty the queue");
        }
    }

    const handleShare = (platform: 'whatsapp' | 'twitter' | 'instagram' | 'clipboard') => {
        const shareableLink = `${window.location.hostname}/spaces/${spaceId}`

        if (platform === 'clipboard') {
            navigator.clipboard.writeText(shareableLink).then(() => {
                toast.success('Link copied to clipboard!')
            }).catch((err) => {
                console.error('Could not copy text: ', err)
                toast.error('Failed to copy link. Please try again.')
            })
        } else {
            let url
            switch (platform) {
                case 'whatsapp':
                    url = `https://wa.me/?text=${encodeURIComponent(shareableLink)}`
                    break
                case 'twitter':
                    url = `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareableLink)}`
                    break
                case 'instagram':
                    // Instagram doesn't allow direct URL sharing, so we copy the link instead
                    navigator.clipboard.writeText(shareableLink)
                    toast.success('Link copied for Instagram sharing!')
                    return
                default:
                    return
            }
            window.open(url, '_blank')
        }
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
            <Dialog
                open={isEmptyQueueDialogOpen}
                onOpenChange={setIsEmptyQueueDialogOpen}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Empty Queue</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to empty the queue? This will remove all
                            songs from the queue. This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant={"outline"}
                            onClick={() => setIsEmptyQueueDialogOpen(false)}
                        >Cancle</Button>
                        <Button
                            onClick={emptyQueue}
                            className="bg-red-600 hover:bg-red-700 text-white"
                        >Empty Queue</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}