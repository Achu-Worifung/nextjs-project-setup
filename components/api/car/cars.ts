import Amadeus from "amadeus";
import { apiHelpers, API_ENDPOINTS } from '../../../lib/api-config';

const amadeus = new Amadeus({
  clientId: process.env.AMADEUS_CLIENT_ID,
  clientSecret: process.env.AMADEUS_CLIENT_SECRET,
});


// export default async function getCars(
//     {

//     }
// )