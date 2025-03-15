"use client";

import { useState, useRef } from "react";


const VideoRecorder: React.FC = () => {
    const previewRef = useRef<HTMLVideoElement | null>(null);
    const recordingRef = useRef<HTMLVideoElement | null>(null);
    const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
    const [recordingBlob, setRecordingBlob] = useState<Blob | null>(null);
    const [recorder, setRecorder] = useState<MediaRecorder | null>(null);
    const recordingTimeMS = 5000;

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            if (previewRef.current) {
                previewRef.current.srcObject = stream;
            }
            setMediaStream(stream);

            let captureStream: MediaStream =
                (previewRef.current as any)?.captureStream?.() ||
                (previewRef.current as any)?.mozCaptureStream?.() ||
                stream; // Fallback if captureStream is not supported

            const mediaRecorder = new MediaRecorder(captureStream);
            let chunks: BlobPart[] = [];

            mediaRecorder.ondataavailable = (event) => chunks.push(event.data);
            mediaRecorder.onstop = () => {
                const blob = new Blob(chunks, { type: "video/webm" });
                setRecordingBlob(blob);
                if (recordingRef.current) {
                    recordingRef.current.src = URL.createObjectURL(blob);
                    recordingRef.current.load();
                    recordingRef.current.play();
                }
            };

            mediaRecorder.start();
            setRecorder(mediaRecorder);

            setTimeout(() => {
                if (mediaRecorder.state === "recording") {
                    mediaRecorder.stop();
                }
            }, recordingTimeMS);
        } catch (error) {
            console.error("Error accessing media devices:", error);
        }
    };

    const uploadVideo = async () => {
        if (!recordingBlob) {
            console.error("No video recorded!");
            return;
        }
    
        // Convert Blob to File
        const videoFile = new File([recordingBlob], "recorded-video.webm", { type: "video/webm" });
    
        const formData = new FormData();
        formData.append("video", videoFile);
    
        try {
            const response = await fetch("/mycuh", {
                method: "POST",
                body: formData,
            });
    
            const data = await response.json();
            if (response.ok) {
                console.log("Upload Successful! File:", data.filePath);
            } else {
                console.error("Upload Failed:", data.message);
            }
        } catch (error) {
            console.error("Error uploading video:", error);
        }
    };
    
    const stopRecording = () => {
        if (recorder) {
            recorder.stop();
        }
        if (mediaStream) {
            mediaStream.getTracks().forEach((track) => track.stop());
            setMediaStream(null);
        }
        
    };

    return (
        <div className="flex flex-col items-center p-4">
            <div className="flex gap-4">
                {/* Left Section */}
                <div className="flex flex-col items-center">
                    <button onClick={startRecording} className="px-4 py-2 bg-blue-500 text-white rounded-md">
                        Start Recording
                    </button>
                    <h2 className="mt-2">Preview</h2>
                    <video ref={previewRef} width="160" height="120" autoPlay muted className="border rounded-md"></video>
                </div>

                {/* Right Section */}
                <div className="flex flex-col items-center">
                    <button onClick={stopRecording} className="px-4 py-2 bg-red-500 text-white rounded-md">
                        Stop Recording
                    </button>
                    <h2 className="mt-2">Recording</h2>
                    <video ref={recordingRef} width="160" height="120" controls autoPlay className="border rounded-md"></video>
                    {recordingBlob && (
                        <a
                            href={URL.createObjectURL(recordingBlob)}
                            download="RecordedVideo.webm"
                            className="mt-2 px-4 py-2 bg-green-500 text-white rounded-md"
                        >
                            Download
                        </a>
                    )}
                </div>
                <button onClick={()=>uploadVideo()}>Submit</button>
            </div>
        </div>
    );
};

export default VideoRecorder;
