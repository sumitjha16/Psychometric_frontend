import React, { useState } from 'react';
import { ArrowRight, AlertCircle } from 'lucide-react';

interface ImagePerceptionTestProps {
  onComplete: (answers: Record<number, number>) => void;
  adminRestrictionEnabled: boolean;
  currentActiveQuestion: number;
}

const imageTests = [
  {
    id: 1,
    imageUrl: "https://trideep1315.sirv.com/photos%20for%20psycho%20test/girlman.jpg.webp",
    question: "What do you notice first in this image?",
    options: ["The Old Man", "The Woman"]
  },
  {
    id: 2,
    imageUrl: "https://trideep1315.sirv.com/photos%20for%20psycho%20test/ducks.jpeg.webp",
    question: "What do you notice first in this image?",
    options: ["The Rabbit", "The Duck"]
  },
  {
    id: 3,
    imageUrl: "https://trideep1315.sirv.com/photos%20for%20psycho%20test/binoc.jpg.webp",
    question: "What do you notice first in this image?",
    options: ["A Car", "The Letter A", "A Man With Binoculars"]
  }
];

const ImagePerceptionTest: React.FC<ImagePerceptionTestProps> = ({
  onComplete,
  adminRestrictionEnabled,
  currentActiveQuestion
}) => {
  const [currentImage, setCurrentImage] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState<Record<number, number>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const effectiveCurrentQuestion = currentImage + 5;
  const canProceed = !adminRestrictionEnabled || effectiveCurrentQuestion <= currentActiveQuestion;
  const imageData = imageTests.find(img => img.id === currentImage) || imageTests[0];

  const handleOptionSelect = (optionIndex: number) => {
    setSelectedOptions(prev => ({
      ...prev,
      [imageData.id]: optionIndex
    }));
  };

  const handleNextImage = () => {
    if (currentImage < imageTests.length) {
      setCurrentImage(currentImage + 1);
      window.scrollTo(0, 0); // Scroll to top after moving to the next question
    } else {
      setIsSubmitting(true);
      setTimeout(() => onComplete(selectedOptions), 1500);
    }
  };

  const progressPercentage = (currentImage / imageTests.length) * 100;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="w-full bg-gray-200 rounded-full h-2.5 mb-6">
        <div className="bg-primary-600 h-2.5 rounded-full transition-all duration-300" style={{ width: `${progressPercentage}%` }}></div>
      </div>
      <div className="text-sm text-gray-500 mb-8 flex justify-between">
        <span>Image {currentImage} of {imageTests.length}</span>
        {adminRestrictionEnabled && (
          <span className="flex items-center">
            <AlertCircle className="h-4 w-4 mr-1 text-primary-600" />
            {effectiveCurrentQuestion <= currentActiveQuestion ? "This question is active" : "Waiting for admin to activate this question"}
          </span>
        )}
      </div>

      {isSubmitting ? (
        <div className="card p-12 text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-700 mx-auto mb-4"></div>
          <h3 className="text-xl font-medium">Processing your perceptions...</h3>
          <p className="text-gray-500 mt-2">Please wait while we analyze your responses.</p>
        </div>
      ) : (
        <div className="card">
          <h2 className="text-2xl font-semibold mb-6">Image Perception Test</h2>
          <p className="text-gray-600 mb-6">Look at the image below and select your first instinctive response. There are no right or wrong answers.</p>

          <div className="mb-6 rounded-lg overflow-hidden bg-gray-100 relative" style={{ minHeight: '300px' }}>
            {!imageLoaded && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-700"></div>
              </div>
            )}
            <img
              src={imageData.imageUrl}
              alt="Perception test"
              className={`w-full h-auto object-cover transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
              onLoad={() => setImageLoaded(true)}
            />
          </div>

          <h3 className="text-xl font-medium mb-6">{imageData.question}</h3>
          <div className="space-y-4 mb-8">
            {imageData.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleOptionSelect(index)}
                className={`w-full text-left p-4 rounded-lg border transition-all ${selectedOptions[imageData.id] === index ? 'border-primary-600 bg-primary-50 text-primary-800' : 'border-gray-200 hover:border-primary-300 hover:bg-gray-50'}`}
                disabled={selectedOptions[imageData.id] !== undefined}
              >
                <div className="flex items-center">
                  <div className={`h-5 w-5 rounded-full mr-3 flex-shrink-0 ${selectedOptions[imageData.id] === index ? 'bg-primary-600' : 'border border-gray-300'}`}></div>
                  <span>{option}</span>
                </div>
              </button>
            ))}
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleNextImage}
              disabled={selectedOptions[imageData.id] === undefined || !canProceed}
              className={`group ${selectedOptions[imageData.id] === undefined || !canProceed ? 'btn-disabled' : 'btn-primary'}`}
            >
              {currentImage < imageTests.length ? 'Next Image' : 'Complete Test'}
              <ArrowRight className="inline-block ml-2 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImagePerceptionTest;
