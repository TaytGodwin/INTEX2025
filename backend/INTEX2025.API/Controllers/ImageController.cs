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
        [HttpGet("{imageName}")]
        public async Task<IActionResult> GetImage(string imageName)
        {
            // Get the container client
            var containerClient = _blobServiceClient.GetBlobContainerClient(_containerName);

            // Get the blob client for the requested image
            var blobClient = containerClient.GetBlobClient(imageName);

            // Check if the blob exists
            if (!await blobClient.ExistsAsync())
            {
                return NotFound(); // Return 404 if not found
            }

            // Download the image
            var blobDownloadInfo = await blobClient.DownloadAsync();

            // Set the content type for the response (you can dynamically detect the content type based on the file extension if needed)
            var contentType = "image/jpeg"; // Default content type, improve this based on your use case
            return File(blobDownloadInfo.Value.Content, contentType);
        }
    }
}
