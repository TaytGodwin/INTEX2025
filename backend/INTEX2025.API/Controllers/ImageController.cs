using Azure.Storage.Blobs;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using DotNetEnv;
using Microsoft.AspNetCore.Authorization;

namespace INTEX.API.Controllers
{
    // Define the route and mark as API controller
    [Route("api/[controller]")]
    [ApiController]
    public class ImageController : ControllerBase
    {
        // BlobServiceClient is used to interact with Azure Blob Storage
        private readonly BlobServiceClient _blobServiceClient;
        // Name of the container in Azure Blob Storage
        private readonly string _containerName;

        // Constructor: Initialize the BlobServiceClient and container name using environment variables
        public ImageController(IConfiguration configuration)
        {
            // Retrieve the connection string and container name from environment variables
            var connectionString = Environment.GetEnvironmentVariable("BLOB_CONNECTION");
            var containerName = Environment.GetEnvironmentVariable("CONTAINER_NAME");

            // Ensure both environment variables are available; throw exception if any are missing
            if (string.IsNullOrEmpty(connectionString) || string.IsNullOrEmpty(containerName))
            {
                throw new InvalidOperationException("Blob connection string or container name is missing.");
            }

            // Create a BlobServiceClient using the connection string
            _blobServiceClient = new BlobServiceClient(connectionString);
            // Assign the container name for later use
            _containerName = containerName;
        }

        // GET image from blob storage by image name
        [HttpGet("GetImage/{imageName}")]
        // No authorization needed as images are publicly displayed on the home page
        public async Task<IActionResult> GetImage(string imageName)
        {
            // Build the relative path by appending the folder and file extension
            string imagePath = "Movie Posters/" + imageName;

            // Get a client for the container specified by _containerName
            var containerClient = _blobServiceClient.GetBlobContainerClient(_containerName);

            // Get a client for the blob (i.e. the specific image file) using the constructed path
            var blobClient = containerClient.GetBlobClient(imagePath);

            // Check if the blob (image file) exists in storage
            if (!await blobClient.ExistsAsync())
            {
                // Return a 404 Not Found response if the image does not exist
                return NotFound();
            }

            // Download the image file from blob storage
            var blobDownloadInfo = await blobClient.DownloadAsync();

            // Define the content type to be returned; here it is set for JPEG images
            var contentType = "image/jpeg"; // Optionally, determine content type by file extension

            // Return the image file stream with the appropriate content type
            return File(blobDownloadInfo.Value.Content, contentType);
        }
        
        // GET image from blob storage by image name for admin so it doesn't break the other stuff for images
        [HttpGet("GetAdminImage/{imageName}")]
        // No authorization needed as images are publicly displayed on the home page
        public async Task<IActionResult> GetAdminImage(string imageName)
        {
            // Build the relative path by appending the folder and file extension
            string imagePath = "Movie Posters/" + imageName + ".jpg";

            // Get a client for the container specified by _containerName
            var containerClient = _blobServiceClient.GetBlobContainerClient(_containerName);

            // Get a client for the blob (i.e. the specific image file) using the constructed path
            var blobClient = containerClient.GetBlobClient(imagePath);

            // Check if the blob (image file) exists in storage
            if (!await blobClient.ExistsAsync())
            {
                // Return a 404 Not Found response if the image does not exist
                return NotFound();
            }

            // Download the image file from blob storage
            var blobDownloadInfo = await blobClient.DownloadAsync();

            // Define the content type to be returned; here it is set for JPEG images
            var contentType = "image/jpeg"; // Optionally, determine content type by file extension

            // Return the image file stream with the appropriate content type
            return File(blobDownloadInfo.Value.Content, contentType);
        }

        // POST request to upload a new image or update an existing one
        [HttpPost("AddImage/{imageName}")]
        [Authorize(Roles = "Administrator")] // Allow only Administrators to upload images
        public async Task<IActionResult> UploadImage(string imageName, IFormFile file)
        {
            // Check if the file is provided and is not empty
            if (file == null || file.Length == 0)
            {
                return BadRequest("No file uploaded.");
            }

            // Build the path where the image will be stored
            string imagePath = "Movie Posters/" + imageName + ".jpg";

            // Get the container client for the specified container
            var containerClient = _blobServiceClient.GetBlobContainerClient(_containerName);

            // Get the blob client for the target file path. This will overwrite if the image already exists.
            var blobClient = containerClient.GetBlobClient(imagePath);

            // Upload the file stream to the blob storage and allow overwriting
            await blobClient.UploadAsync(file.OpenReadStream(), overwrite: true);
            
            // Return a success response with the URL of the uploaded image
            return Ok(new { message = "Image uploaded successfully.", blobUrl = blobClient.Uri.ToString() });
        }

        // DELETE request to remove an image from blob storage
        [HttpDelete("DeleteImage/{imageName}")]
        [Authorize(Roles = "Administrator")] // Allow only Administrators to delete images
        public async Task<IActionResult> DeleteImage(string imageName)
        {
            // Build the file path for the image to be deleted
            string imagePath = "Movie Posters/" + imageName + ".jpg";

            // Get the container client using the stored container name
            var containerClient = _blobServiceClient.GetBlobContainerClient(_containerName);

            // Get the blob client for the image file
            var blobClient = containerClient.GetBlobClient(imagePath);

            // Check if the image exists in blob storage
            if (!await blobClient.ExistsAsync())
            {
                // Return a 404 Not Found if the image does not exist
                return NotFound();
            }

            // Delete the blob if it exists
            await blobClient.DeleteIfExistsAsync();

            // Return a success response indicating deletion
            return Ok(new { message = "Image deleted successfully." });
        }
    }
}
