"use client"
import { Card, CardContent } from "@/components/ui/card";
import { Appbar } from "./Appbar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function Streamview() {
    const [loading, setLoading] = useState(false);
    const [playNextLoader, setPlayNextLoader] = useState(false);
    return (
        <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-900 to-black text-gray-200">
            <Appbar />
            {/* Upcoming song part start from here left part of the screen */}
            <div className="flex justify-center px-5 md:px-10 xl:px-20 pt-5">
                <div className="grid grid-cols-1 gap-y-5 lg:gap-x-5 lg:grid-cols-5 w-screen py-5 lg:py-8">
                    <div className="">
                        <h1 className="text-2xl text-white font-semibold tracking-tighter">
                            Upcoming Songs
                        </h1>
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
    )
}