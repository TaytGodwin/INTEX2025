const IMAGE_API_URL = 'https://localhost:5000'; //'https://intexbackend25-c6ffa9adgthsgtdf.eastus-01.azurewebsites.net';

// This will get an image from the API
export const getImage = async (movieName: string): Promise<Blob | null> => {
  try {
    const response = await fetch(
      `${IMAGE_API_URL}/api/Image/${movieName}.jpg`,
      {
        method: 'GET',
        credentials: 'include',
      }
    );

    // Check if the response is valid and the content type is image
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('image')) {
      throw new Error('Invalid response format from server');
    }

    // Return the image blob
    const imageBlob = await response.blob();
    return imageBlob;
  } catch (error) {
    console.error('Error fetching image:', error);
    return null;
  }
};
