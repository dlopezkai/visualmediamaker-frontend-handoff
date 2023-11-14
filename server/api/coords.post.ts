import axios from "axios"
export default defineEventHandler(async (event) => {
    try {
        const { text } = await readBody(event);
        return await fetch(`https://maps.googleapis.com/maps/api/place/findplacefromtext/json?fields=formatted_address,name,geometry&input=${text}&inputtype=textquery&key=AIzaSyA92xRjp7fUba6yBWvJGBfXZwSswwpIX6w`);
    } catch (error) {
        return error
    }

  })