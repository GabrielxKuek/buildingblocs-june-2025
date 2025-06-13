// dependencies
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

// components
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Send, Volume2, Plus } from "lucide-react";
import Spinner from "@/components/system/Spinner";

// api
import { fetchVideosByParentId, getPatientItems } from "@/services/api/patient";

const ActionsPage = ({ onSendToCaregiver, onCreateActionVideo }) => {
    const { imageId } = useParams();
    const navigate = useNavigate();
    
    const [parentImage, setParentImage] = useState(null);
    const [actionVideos, setActionVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedVideo, setSelectedVideo] = useState(null);

    useEffect(() => {
        loadActionsData();
    }, [imageId]);

    const loadActionsData = async () => {
        try {
            setLoading(true);
            
            // Get the parent image details
            const allItems = await getPatientItems();
            const parentImg = allItems.find(item => 
                item.media_id == imageId && item.type === 'image'
            );
            
            if (!parentImg) {
                console.error('Parent image not found');
                navigate('/patient/items');
                return;
            }
            
            setParentImage(parentImg);
            
            // Get action videos for this image
            const videos = await fetchVideosByParentId(imageId);
            setActionVideos(videos);
            
            // Auto-select first video if available
            if (videos.length > 0) {
                setSelectedVideo(videos[0]);
            }
            
        } catch (error) {
            console.error('Error loading actions data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSendToCaregiver = (video) => {
        if (onSendToCaregiver) {
            // Convert video format to match expected structure
            const formattedVideo = {
                id: `video_${video.media_id}`,
                media_id: video.media_id,
                name: video.prompt,
                imageUrl: video.media_url,
                type: "video"
            };
            onSendToCaregiver(formattedVideo);
        }
    };

    const handleSpeak = (text) => {
        console.log(`Speaking: ${text}`);
        const utterance = new SpeechSynthesisUtterance(text);
        speechSynthesis.speak(utterance);
    };

    const handleCreateAction = () => {
        if (onCreateActionVideo && parentImage) {
            onCreateActionVideo(parentImage);
        }
    };

    const handleVideoSelect = (video) => {
        setSelectedVideo(video);
    };

    if (loading) {
        return <Spinner message="Loading Actions..." />;
    }

    if (!parentImage) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <h2 className="text-xl font-bold mb-2">Image Not Found</h2>
                    <Button onClick={() => navigate('/patient/items')}>
                        Go Back to Items
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-4">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-6">
                    <div className="flex items-center gap-4 mb-4">
                        <Button 
                            variant="outline" 
                            onClick={() => navigate('/patient/items')}
                            className="flex items-center gap-2"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Back to Items
                        </Button>
                        
                        <div className="flex items-center gap-3">
                            <div className="w-16 h-16 rounded-lg overflow-hidden border-2 border-primary/20">
                                <img 
                                    src={parentImage.imageUrl} 
                                    alt={parentImage.name}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold">{parentImage.name} Actions</h1>
                                <p className="text-muted-foreground">
                                    {actionVideos.length} action{actionVideos.length !== 1 ? 's' : ''} available
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Video Player */}
                    <div className="lg:col-span-2">
                        <Card className="h-full">
                            <CardContent className="p-6">
                                {selectedVideo ? (
                                    <>
                                        {/* Video Player */}
                                        <div className="aspect-video mb-6 rounded-lg overflow-hidden bg-black">
                                            <video 
                                                key={selectedVideo.media_id}
                                                src={selectedVideo.media_url}
                                                className="w-full h-full object-contain"
                                                controls
                                                autoPlay
                                                loop
                                                muted={false} // Allow sound for better UX
                                                preload="auto"
                                            />
                                        </div>
                                        
                                        {/* Video Info */}
                                        <div className="mb-6">
                                            <h2 className="text-2xl font-bold mb-2">{selectedVideo.prompt}</h2>
                                            <p className="text-muted-foreground">
                                                Created: {new Date(selectedVideo.created_at).toLocaleDateString()}
                                            </p>
                                        </div>
                                        
                                        {/* Action Buttons */}
                                        <div className="flex gap-3">
                                            <Button 
                                                onClick={() => handleSendToCaregiver(selectedVideo)}
                                                className="flex-1 h-14 text-lg"
                                                size="lg"
                                            >
                                                <Send className="h-5 w-5 mr-2" />
                                                Send to Caregiver
                                            </Button>
                                            
                                            <Button 
                                                onClick={() => handleSpeak(selectedVideo.prompt)}
                                                variant="outline"
                                                className="h-14 px-6"
                                                size="lg"
                                            >
                                                <Volume2 className="h-5 w-5" />
                                            </Button>
                                        </div>
                                    </>
                                ) : (
                                    <div className="text-center py-20">
                                        <div className="text-6xl mb-4">🎬</div>
                                        <h3 className="text-xl font-semibold mb-2">No Actions Yet</h3>
                                        <p className="text-muted-foreground mb-6">
                                            Create action videos to help communicate your needs
                                        </p>
                                        <Button onClick={handleCreateAction} size="lg">
                                            <Plus className="h-5 w-5 mr-2" />
                                            Create First Action
                                        </Button>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Actions Sidebar */}
                    <div className="space-y-4">
                        {/* Create New Action */}
                        <Card>
                            <CardContent className="p-4">
                                <Button 
                                    onClick={handleCreateAction}
                                    className="w-full h-12"
                                    variant="outline"
                                >
                                    <Plus className="h-4 w-4 mr-2" />
                                    Create New Action
                                </Button>
                            </CardContent>
                        </Card>

                        {/* Actions List */}
                        <Card>
                            <CardContent className="p-4">
                                <h3 className="font-semibold mb-4">Available Actions</h3>
                                
                                {actionVideos.length === 0 ? (
                                    <div className="text-center py-8 text-muted-foreground">
                                        <div className="text-4xl mb-2">🎭</div>
                                        <p className="text-sm">No actions created yet</p>
                                    </div>
                                ) : (
                                    <div className="space-y-3 max-h-96 overflow-y-auto">
                                        {actionVideos.map((video) => (
                                            <div
                                                key={video.media_id}
                                                className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                                                    selectedVideo?.media_id === video.media_id
                                                        ? 'border-primary bg-primary/5'
                                                        : 'border-muted hover:border-muted-foreground/50'
                                                }`}
                                                onClick={() => handleVideoSelect(video)}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className="w-12 h-12 rounded overflow-hidden">
                                                        <video 
                                                            src={video.media_url}
                                                            className="w-full h-full object-cover"
                                                            muted
                                                            preload="metadata"
                                                        />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <h4 className="font-medium text-sm truncate">
                                                            {video.prompt}
                                                        </h4>
                                                        <p className="text-xs text-muted-foreground">
                                                            {new Date(video.created_at).toLocaleDateString()}
                                                        </p>
                                                    </div>
                                                    {selectedVideo?.media_id === video.media_id && (
                                                        <div className="w-2 h-2 bg-primary rounded-full"></div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};

ActionsPage.propTypes = {
    onSendToCaregiver: PropTypes.func.isRequired,
    onCreateActionVideo: PropTypes.func,
};

export default ActionsPage;