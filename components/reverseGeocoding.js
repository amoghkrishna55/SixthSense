import {GeoCode_API} from '@env';

export const geoCoding = async (lat, long) => {
  try {
    const response = await fetch(
      `https://geocode.maps.co/reverse?lat=${lat}&lon=${long}&api_key=${GeoCode_API}`,
    );
    console.log(response);
    const data = await response.json();
    return data;
  } catch (e) {
    console.log(e);
    return null;
  }
};
