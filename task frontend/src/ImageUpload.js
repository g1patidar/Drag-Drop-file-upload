// // ImageUploader.js

// import React, { useCallback, useState } from 'react';
// import { useDropzone } from 'react-dropzone';
// import styled from 'styled-components';

// const Container = styled.div`
//   flex: 1;
//   display: flex;
//   flex-direction: column;
//   align-items: center;
//   padding: 20px;
//   border-width: 2px;
//   border-radius: 2px;
//   border-color: #eeeeee;
//   border-style: dashed;
//   background-color: #fafafa;
//   color: #bdbdbd;
//   outline: none;
//   transition: border 0.24s ease-in-out;
// `;
// const ImageUploader = ({ onImageUpload }) => {

//   const [uploadedImage, setUploadedImage] = useState(null);

//   const onDrop = useCallback((acceptedFiles) => {
//     const file = acceptedFiles[0];
//     const reader = new FileReader();

//     reader.onload = () => {
//       setUploadedImage(reader.result);
//       onImageUpload(reader.result);
//     };

//     reader.readAsDataURL(file);
//   }, [onImageUpload]);

//   const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

//   // upload image handle function

//   const uploadhandle = () => {
//     alert("hello")
//   }


//   return (
//     <>
//       <Container {...getRootProps()}>
//         <input {...getInputProps()} />
//         {isDragActive ? (
//           <p className='headline-drop'>Drop the image here...</p>
//         ) : (
//           <p>Drag & apos;n&apos; drop an image here, or click to select one</p>
//         )}
//         {uploadedImage && <img src={uploadedImage} alt="Uploaded" className='dragdrop-area' />}
//       </Container >
//       <buuton className="uploadbutton" onclick={uploadhandle}>Upload</buuton>

//     </>
//   );
// };

// export default ImageUploader;









import "./css/ImageUpload.css"
import axios from "axios";
import React, { useState, useEffect } from 'react';

const FileDropZone = () => {
  const [selectedFile, setSelectedFile] = useState();
  const [files, setFiles] = useState([]);

  useEffect(() => {
    // Fetch the list of files on component mount
    const fetchFiles = async () => {
      try {
        const response = await axios.get('http://localhost:8000/files');
        setFiles(response.data);
      } catch (error) {
        console.error('Error fetching files:', error);
      }
    };

    fetchFiles();
  }, [files]);

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };
  const handleDragOver = (e) => {
    e.preventDefault();
  };
  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      setSelectedFile(file);
    }
  };

  // handle submit image  
  const handleFileUpload = async () => {
    if (selectedFile) {
      const formData = new FormData();
      formData.append('file', selectedFile);

      try {
        const response = await axios.post('http://localhost:8000/upload', formData);
        console.log(response.data.message);
        alert(response.data.message);
        setSelectedFile("");
      } catch (error) {
        console.error('Error uploading file:', error);
      }
    }
  };

  // dawonload handle

  const handleFileDownload = (filename) => {

    fetch(`http://localhost:8000/download/${filename}`)
    .then(response => response.blob())
    .then(blob => {
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    })
    .catch((error) => {
      console.error('Error', error);
    });
    
    

  };

  const handleFileDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/files/${id}`);
      // Refresh the list of files after deleting
      const response = await axios.get('http://localhost:3001/files');
      setFiles(response.data);
    } catch (error) {
      console.error('Error deleting file:', error);
    }
  };


  return (
    <>
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        className='dragheadline'
      >
        {selectedFile ? (
          <div>
            <p>Selected File: {selectedFile.name}</p>
          </div>
        ) : (
          <div>
            <p>Drag and drop a file here, or click to select a file</p>
            <input type="file" onChange={handleFileChange} />
          </div>
        )}
        <button className="uploadbutton" onClick={handleFileUpload}>Upload</button>
      </div>


      <div>
        <div style={{ marginTop: '20px' }}>
          <h2>Uploaded Files</h2>
          <ol className="mappingimages">
            {files.map((file) => (
              <li key={file._id}>

                {file.originalname} - {file.size} bytes - {new Date(file.createdAt).toLocaleString()}
                <br />
                <button onClick={() => handleFileDownload(file.filename)}>Download</button>
                <button onClick={() => handleFileDelete(file._id)}>Delete</button>


              </li>
            ))}
          </ol>
        </div>
      </div>

    </>
  );

};

export default FileDropZone;











// import React, { useState } from 'react';
// import axios from 'axios';

// const FileDropZone = () => {
//   const [selectedFile, setSelectedFile] = useState(null);

//   const handleDrop = (e) => {
//     e.preventDefault();
//     const file = e.dataTransfer.files[0];
//     if (file) {
//       setSelectedFile(file);
//     }
//   };

//   const handleDragOver = (e) => {
//     e.preventDefault();
//   };

//   const handleFileChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setSelectedFile(file);
//     }
//   };

//   const handleFileUpload = async () => {
//     if (selectedFile) {
//       const formData = new FormData();
//       formData.append('file', selectedFile);

//       try {
//         const response = await axios.post('http://localhost:3001/upload', formData);
//         console.log(response.data);
//       } catch (error) {
//         console.error('Error uploading file:', error);
//       }
//     }
//   };

//   return (
//     <div
//       onDrop={handleDrop}
//       onDragOver={handleDragOver}
//       style={{
//         border: '2px dashed #ccc',
//         padding: '20px',
//         textAlign: 'center',
//         cursor: 'pointer',
//       }}
//     >
//       {selectedFile ? (
//         <div>
//           <p>Selected File: {selectedFile.name}</p>
//           <button onClick={handleFileUpload}>Upload</button>
//         </div>
//       ) : (
//         <div>
//           <p>Drag and drop a file here, or click to select a file</p>
//           <input type="file" onChange={handleFileChange} />
//         </div>
//       )}
//     </div>
//   );
// };

// export default FileDropZone;
