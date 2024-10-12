import { useState, useRef, useEffect } from 'react';
import './App.css';

function App() {
  const imageContainerRef = useRef(null);
  const canvasRef = useRef(null); // Reference for the canvas

  const [imageFile, setImageFile] = useState();
  const [watermarkName, setWatermarkName] = useState('');
  const [top, setTop] = useState(2); // Percentage
  const [left, setLeft] = useState(14); // Percentage
  const [opacity, setOpacity] = useState(0.5); // Percentage
  const [fontSize, setFontSize] = useState(30); // Default font size
  const [rotated, setRotated] = useState(true);

  const fileUpload = (e) => {
    setImageFile(URL.createObjectURL(e.target.files[0]));
    generateWatermarkedImage();
  };

  const handleTitleChange = (e) => {
    setWatermarkName(e.target.value);
    generateWatermarkedImage();
  };

  const handleTopChange = (e) => {
    setTop(e.target.value);
    generateWatermarkedImage();
  };

  const handleLeftChange = (e) => {
    setLeft(e.target.value);
    generateWatermarkedImage();
  };

  const handleOpacityChange = (e) => {
    setOpacity(e.target.value);
    generateWatermarkedImage();
  };

  const generateWatermarkedImage = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const image = new Image();
    image.src = imageFile;
  
    image.onload = () => {
      // Clear the canvas before drawing
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Set canvas size to match the image size
      canvas.width = image.width;
      canvas.height = image.height;
  
      // Draw the image on the canvas at its original size
      ctx.drawImage(image, 0, 0);
  
      // Set the watermark properties
      ctx.font = `${fontSize}px Arial`;
      ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
  
      // Calculate position based on the latest state values
      const x = (canvas.width * left) / 100;
      const y = (canvas.height * top) / 100;
      
      // Draw the watermark
      ctx.save();
      ctx.translate(x, y);

      if(rotated){
        ctx.rotate(-Math.PI / 4); // Rotate the watermark
      }
        
      ctx.fillText(watermarkName, 0, 0);
      ctx.restore();
    };
  
    // Handle image loading error
    image.onerror = () => {
      console.error("Image failed to load");
    };
  };
  
  

  // Function to handle download
  const handleDownload = () => {
    generateWatermarkedImage(); // Generate the image

    // Allow a small delay to ensure the image is drawn before downloading
      const canvas = canvasRef.current;
      canvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'watermarked-image.png';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url); // Clean up the URL object
      });
  };

  return (
    <div ref={imageContainerRef} className='container'>
      <h3>Welcome to the Watermarker!</h3>
      <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column'}}>
        <p style={{paddingRight: '1em'}}>Upload an image</p>
        <input type='file' onChange={fileUpload} />   
      </div>
      

      <div className='watermark' data-watermark={watermarkName} style={{ '--top': `${top}%`, '--left': `${left}%`, '--opacity': `${opacity}`, '--fontSize': `${fontSize}` }}>
        <img src={imageFile} alt="Image" />
      </div>

      <div className='options'>
        <div style={{ display: 'flex', alignItems: 'center'}}>
          <h5>Watermark:</h5>
          <input className='title' type='text' onChange={handleTitleChange} />
        </div>

        <div style={{ display: 'flex', alignItems: 'center' }}>
          <h5>PosY: </h5>
          <input type="range" min="2" max="90" value={top} onChange={handleTopChange} step="1" />
          <span>{top}%</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center'}}>
          <h5>PosX: </h5>
          <input type="range" min="14" max="90" value={left} onChange={handleLeftChange} step="1" />
          <span>{left}%</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center' }}>
          <h5>Size: </h5>
          <input
            type='range'
            min='10'
            max='100'
            value={fontSize}
            onChange={(e) => {
              setFontSize(e.target.value);
              generateWatermarkedImage();
            }}
          />
          <span>{fontSize}px</span>
        </div>

        <div style={{ display: 'flex' }}>
          <h5 style={{ margin: '0 5px 0 0' }}>Opacity: </h5>
          <input type="range" min="0" max="1" value={opacity} onChange={handleOpacityChange} step="0.01" />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', marginTop: '10 px' }}>
          <h5 style={{ margin: '0 5px 0 0' }}>Rotation:</h5>
          <input type="checkbox" checked={rotated} onChange={() => { setRotated(prev => !prev) }}  /> {/* Remove margin */}
        </div>
      </div>

      <p style={{fontSize: '0.5em'}}>If watermark appears in the wrong spot, adjust the font.</p>
      <button onClick={handleDownload}>Download Watermarked Image</button>
      
      {/* Hidden canvas for generating the image */}
      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </div>
  );
}

export default App;
