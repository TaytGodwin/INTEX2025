const IMAGE_API_URL = 'https://localhost:5000';
//'https://cinenichebackend-fjhdf8csetdbdmbv.westus2-01.azurewebsites.net';

// This will get an image from the API based on the movie name which is how they are stored in the blob
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
    // This takes the 'imagename' which is sent based on title of the move because that's how it's retrieved later
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
    // Takes image name to find the blob for it. The image name maps to the title of the movie delted at the same
    const response = await fetch(
      `${IMAGE_API_URL}/api/Image/DeleteImage${imageName}`,
      {
        method: 'DELETE',
      }
    );

    if (!response.ok) {
      throw new Error('Error deleting image');
    }
    // confirms the results
    const result = await response.json();
    console.log(result.message);
  } catch (error) {
    console.error('Error:', error);
  }
};
