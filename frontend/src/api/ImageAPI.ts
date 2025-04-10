const IMAGE_API_URL = //'https://localhost:5000';
  'https://intexbackend25-c6ffa9adgthsgtdf.eastus-01.azurewebsites.net';

// This will get an image from the API
export const getImage = async (movieName: string): Promise<Blob | null> => {
  try {
    const response = await fetch(
      `${IMAGE_API_URL}/api/Image/GetImage/${movieName}.jpg`,
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

// This will allow users to upload an image to replace an existing one or add one
export const uploadImage = async (imageName: string, file: File) => {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await fetch(
      `${IMAGE_API_URL}/api/Image/AddImage/${imageName}`,
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error('Error uploading image');
    }

    const result = await response.json();
    console.log(result.message);
  } catch (error) {
    console.error('Error:', error);
  }
};

// We need to delete an image with this call
export const deleteImage = async (imageName: string) => {
  try {
    const response = await fetch(
      `${IMAGE_API_URL}/api/Image/DeleteImage${imageName}`,
      {
        method: 'DELETE',
      }
    );

    if (!response.ok) {
      throw new Error('Error deleting image');
    }

    const result = await response.json();
    console.log(result.message);
  } catch (error) {
    console.error('Error:', error);
  }
};

// We need to change the name of an image with this call when a user updates the movie title
