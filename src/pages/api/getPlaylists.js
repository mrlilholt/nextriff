import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default async function handler(req, res) {
  try {
    // Folder paths that mirror your Cloudinary structure
    const folders = ['music/Morning', 'music/Driving', 'music/Chill'];
    const playlists = {};

    for (const folder of folders) {
      console.log(`Searching Cloudinary for folder: ${folder}`);
      const result = await cloudinary.search
        .expression(`folder:${folder} AND resource_type:video`)
        .execute();

      console.log(`Result for ${folder}:`, result);

      // Derive a simple playlist name from the folder path ("Morning" from "music/Morning")
      const playlistName = folder.split('/').pop();

      playlists[playlistName] = result.resources.map((resource) => ({
        artist: resource.context?.custom?.artist || 'Unknown Artist',
        title: resource.context?.custom?.title || resource.public_id.split('/').pop(),
        url: resource.secure_url,
        playlist: playlistName,
      }));
    }

    res.status(200).json(playlists);
  } catch (error) {
    console.error('Error fetching playlists from Cloudinary:', error);
    res.status(500).json({ error: 'Failed to fetch playlists', details: error.message });
  }
}