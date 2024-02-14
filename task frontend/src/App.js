// App.js

import React from 'react';
import ImageUploader from './ImageUpload';
const App = () => {
  const handleImageUpload = (imageData) => {
    console.log('Image uploaded:', imageData);
    // Add your logic for handling the uploaded image data
  };

  return (
    <div>
      <center><h1>React Drag and Drop Image Upload</h1></center>
      <ImageUploader onImageUpload={handleImageUpload} />
    </div>
  );
};

export default App;
