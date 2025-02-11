import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const formatTracks = (resources) =>
  resources.map((file, index) => {
    let customData = file.context?.custom;
    // If customData isn’t an object, try parsing the context string
    if (!customData && file.context && typeof file.context === 'string') {
      customData = {};
      file.context.split('|').forEach(pair => {
        const [key, value] = pair.split('=');
        if (key && value) {
          customData[key.trim()] = value.trim();
        }
      });
    }

    return {
      id: index + 1,
      title:
        customData?.title ||
        file.public_id.split("/").pop().replace(/_/g, " "),
      artist: customData?.artist || "Unknown Artist",
      url: file.secure_url,
    };
  });

export default async function handler(req, res) {
  try {
    // Folder paths that mirror your Cloudinary structure
    const folders = ['music/Morning', 'music/Driving', 'music/Chill', 'music/Sleepy_Time', 'music/Hanging_Out', 'music/Get_Pumped_Up', 'music/Misc'];
    const playlists = {};

    for (const folder of folders) {
      console.log(`Searching Cloudinary for folder: ${folder}`);
      const result = await cloudinary.search
        .expression(`folder:${folder} AND resource_type:video`)
        .execute();

      console.log(`Result for ${folder}:`, result);

      // Derive a simple playlist name from the folder path ("Morning" from "music/Morning")
      const playlistName = folder.split('/').pop();

      playlists[playlistName] = formatTracks(result.resources);
    }

    res.status(200).json(playlists);
  } catch (error) {
    console.error('Error fetching playlists from Cloudinary:', error);
    res.status(500).json({ error: 'Failed to fetch playlists', details: error.message });
  }
}