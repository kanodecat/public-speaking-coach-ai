"use client";

import { useState, useRef } from "react";

const VideoRecorder: React.FC = () => {
    const previewRef = useRef<HTMLVideoElement | null>(null);
    const recordingRef = useRef<HTMLVideoElement | null>(null);
    const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
    const [recordingBlob, setRecordingBlob] = useState<Blob | null>(null);
    const [audioBlob, setAudioBlob] = useState<Blob | null>(null); // NEW: audio blob
    const [recorder, setRecorder] = useState<MediaRecorder | null>(null);
    const [audioRecorder, setAudioRecorder] = useState<MediaRecorder | null>(null); // NEW: audio recorder
    const recordingTimeMS = 5000;

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            if (previewRef.current) {
                previewRef.current.srcObject = stream;
            }
            setMediaStream(stream);

            // Setup Video Recorder
            let captureStream: MediaStream =
                (previewRef.current as any)?.captureStream?.() ||
                (previewRef.current as any)?.mozCaptureStream?.() ||
                stream; // Fallback if captureStream is not supported

            const mediaRecorder = new MediaRecorder(captureStream);
            let videoChunks: BlobPart[] = [];
            mediaRecorder.ondataavailable = (event) => videoChunks.push(event.data);
            mediaRecorder.onstop = () => {
                const blob = new Blob(videoChunks, { type: "video/webm" });
                setRecordingBlob(blob);
                if (recordingRef.current) {
                    recordingRef.current.src = URL.createObjectURL(blob);
                    recordingRef.current.load();
                    recordingRef.current.play();
                }
            };
            mediaRecorder.start();
            setRecorder(mediaRecorder);

            // Setup Audio Recorder
            const audioTracks = stream.getAudioTracks();
            const audioOnlyStream = new MediaStream(audioTracks);
            const audioRecorderInstance = new MediaRecorder(audioOnlyStream);
            let audioChunks: BlobPart[] = [];
            audioRecorderInstance.ondataavailable = (event) => audioChunks.push(event.data);
            audioRecorderInstance.onstop = () => {
                const audioBlobResult = new Blob(audioChunks, { type: "audio/webm" }); // webm audio file
                setAudioBlob(audioBlobResult);
            };
            audioRecorderInstance.start();
            setAudioRecorder(audioRecorderInstance);

            // Stop both after timeout
            setTimeout(() => {
                if (mediaRecorder.state === "recording") {
                    mediaRecorder.stop();
                }
                if (audioRecorderInstance.state === "recording") {
                    audioRecorderInstance.stop();
                }
            }, recordingTimeMS);
        } catch (error) {
            console.error("Error accessing media devices:", error);
        }
    };

    const uploadVideoAndAudio = async () => {
        if (!recordingBlob || !audioBlob) {
            console.error("No video or audio recorded!");
            return;
        }

        // Convert Blobs to Files
        const videoFile = new File([recordingBlob], "recorded-video.webm", { type: "video/webm" });
        const audioFile = new File([audioBlob], "recorded-audio.webm", { type: "audio/webm" });

        const formData = new FormData();
        formData.append("video", videoFile);
        formData.append("audio", audioFile);

        try {
            const response = await fetch("http://localhost:8000/", {
                method: "POST",
                body: formData,
            });

            const data = await response.json();
            if (response.ok) {
                console.log("Upload Successful! Files:", data);
            } else {
                console.error("Upload Failed:", data.message);
            }
        } catch (error) {
            console.error("Error uploading files:", error);
        }
    };

    const stopRecording = () => {
        if (recorder && recorder.state === "recording") {
            recorder.stop();
        }
        if (audioRecorder && audioRecorder.state === "recording") {
            audioRecorder.stop();
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
                            Download Video
                        </a>
                    )}
                    {audioBlob && (
                        <a
                            href={URL.createObjectURL(audioBlob)}
                            download="RecordedAudio.webm"
                            className="mt-2 px-4 py-2 bg-yellow-500 text-white rounded-md"
                        >
                            Download Audio
                        </a>
                    )}
                </div>
                <button onClick={uploadVideoAndAudio} className="px-4 py-2 bg-purple-500 text-white rounded-md">
                    Submit
                </button>
            </div>
        </div>
    );
};

export default VideoRecorder;
