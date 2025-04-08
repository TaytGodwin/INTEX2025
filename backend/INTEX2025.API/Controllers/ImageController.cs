using Azure.Storage.Blobs;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using DotNetEnv;

namespace INTEX.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ImageController : ControllerBase
    {
        private readonly BlobServiceClient _blobServiceClient;
        private readonly string _containerName;

        // This will simply show the images for each movie (needs to be called each time)
        public ImageController(IConfiguration configuration)
        {
            // Load connection string and container name from environment variables
            var connectionString = Environment.GetEnvironmentVariable("AZUREBLOBSTORAGE__BLOB_CONNECTION");
            var containerName = Environment.GetEnvironmentVariable("AZUREBLOBSTORAGE__CONTAINERNAME");

            // If environment variables are null, throw an exception or handle appropriately
            if (string.IsNullOrEmpty(connectionString) || string.IsNullOrEmpty(containerName))
            {
                throw new InvalidOperationException("Blob connection string or container name is missing.");
            }

            // Initialize BlobServiceClient using the connection string
            _blobServiceClient = new BlobServiceClient(connectionString);
            _containerName = containerName;
        }

        // Get image from blob storage
        [HttpGet("GetImage/{imageName}")]
        public async Task<IActionResult> GetImage(string imageName)
        {
            // Append the folder name correctly (no URL encoding here)
            string imagePath = "Movie Posters/" + imageName;

            // Get the container client
            var containerClient = _blobServiceClient.GetBlobContainerClient(_containerName);

            // Get the blob client for the requested image
            var blobClient = containerClient.GetBlobClient(imagePath);

            // Check if the blob exists
            if (!await blobClient.ExistsAsync())
            {
                return NotFound(); // Return 404 if not found
            }

            // Download the image
            var blobDownloadInfo = await blobClient.DownloadAsync();

            // Set the content type for the response
            var contentType = "image/jpeg"; // You can improve this by checking file extension

            return File(blobDownloadInfo.Value.Content, contentType);
        }


        // Update image under same name
        [HttpPost("AddImage/{imageName}")]
        public async Task<IActionResult> UploadImage(string imageName, IFormFile file)
        {
            if (file == null || file.Length == 0)
            {
                return BadRequest("No file uploaded.");
            }

            // Append the folder name correctly (no URL encoding here)
            string imagePath = "Movie Posters/" + imageName;

            // Get the container client
            var containerClient = _blobServiceClient.GetBlobContainerClient(_containerName);

            // Get the blob client for the requested image (this will overwrite an existing image with the same name)
            var blobClient = containerClient.GetBlobClient(imagePath);

            // Upload the new image and overwrite the existing one
            await blobClient.UploadAsync(file.OpenReadStream(), overwrite: true);

            return Ok(new { message = "Image uploaded successfully." });
        }


        // Deletes an image
        [HttpDelete("DeleteImage/{imageName}")]
        public async Task<IActionResult> DeleteImage(string imageName)
        {
            // Append the folder name correctly (no URL encoding here)
            string imagePath = "Movie Posters/" + imageName;

            // Get the container client
            var containerClient = _blobServiceClient.GetBlobContainerClient(_containerName);

            // Get the blob client for the requested image
            var blobClient = containerClient.GetBlobClient(imagePath);

            // Check if the blob exists
            if (!await blobClient.ExistsAsync())
            {
                return NotFound(); // Return 404 if not found
            }

            // Delete the blob (image)
            await blobClient.DeleteIfExistsAsync();

            return Ok(new { message = "Image deleted successfully." });
        }

    }
}
