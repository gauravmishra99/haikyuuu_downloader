const axios = require('axios');
const fs = require('fs');
const path = require('path');

// API endpoint and output file path
const API_ENDPOINT = 'https://www114.anzeat.pro/streamhls/133f884b1539527347fc7516d5b7cbd9/ep.1.1730326002.1080';
const OUTPUT_FILE = path.join(__dirname, 'haikyuuu.mp4');

async function fetchChunkData(currentAPI, chunk, writeStream) {
    const response = await axios.get(currentAPI, {
        responseType: 'arraybuffer',  // Ensures data is received as bytes
    });

    // Check if response status is OK
    if (response.status === 200) {
        // Write the chunk to the output file
        writeStream.write(Buffer.from(response.data));
    } else {
        console.log(`Failed to download chunk ${chunk}. Status: ${response.status}`);
        console.log(`Retrying downloading chunk ${chunk}`);
        fetchChunkData(currentAPI, chunk);
    }
}

// Function to download and merge video chunks
async function downloadAndMergeVideo(apiUrl, outputFile, numChunks) {
    try {
        const writeStream = fs.createWriteStream(outputFile);

        for (let i = 1; i <= numChunks; i++) {
            // Modify this based on your API's chunk retrieval requirements
            //   const params = { chunk_number: i };
            let currentAPI = apiUrl;

            currentAPI += `${i}.ts`

            console.log(`Downloading chunk ${i}/${numChunks}...`);
            console.log(`Endpoint hit is ${currentAPI}...`);

            // Fetch the chunk data
            await fetchChunkData(currentAPI, i, writeStream)
        }

        // Close the write stream after all chunks are downloaded
        writeStream.end();
        console.log("Video downloaded and merged successfully!");

    } catch (error) {
        console.error("An error occurred:", error.message);
    }
}

// Call the function with API URL, output file, and number of chunks
downloadAndMergeVideo(API_ENDPOINT, OUTPUT_FILE, 1218);