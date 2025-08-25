// this file should contain all the logic for http requests to the google api


import { clerkClient } from "@clerk/nextjs/server"
import { addMinutes, endOfDay, startOfDay } from "date-fns"
import { calendar_v3, google } from "googleapis"



async function getOAuthClient(clerkUserId) {
    try {
        // Initialize Clerk client
        const client = await clerkClient()

        // Fetch the OAuth access token for the given Clerk user ID
        const { data } = await client.users.getUserOauthAccessToken(clerkUserId, 'google')

        // Check if the data is empty or the token is missing, throw an error
        if (data.length === 0 || !data[0].token) {
        throw new Error("No OAuth data or token found for the user.")
        }

        
        // Initialize OAuth2 client with Google credentials
        const oAuthClient = new google.auth.OAuth2(
            process.env.GOOGLE_OAUTH_CLIENT_ID,
            process.env.GOOGLE_OAUTH_CLIENT_SECRET,
            process.env.GOOGLE_OAUTH_REDIRECT_URL
        )
    
        // Set the credentials with the obtained access token
        oAuthClient.setCredentials({ access_token: data[0].token })
    
        return oAuthClient

    } catch(err) {
        // Catch any errors and rethrow with a detailed message
    throw new Error(`Failed to get OAuth client: ${err.message }`)
    }
}


// Fetch and format calendar events for a user between a given date range
export async function getCalendarEventTimes(clerkUserId, start, end)  {
    try {
        // Get OAuth client for Google Calendar API authentication
        const oAuthClient = await getOAuthClient(clerkUserId)

        if (!oAuthClient) {
        throw new Error("OAuth client could not be obtained.")
        }


        // Fetch events from the Google Calendar API
        const events = await google.calendar("v3").events.list({
            calendarId: "primary", // Use the user's primary calendar
            eventTypes: ["default"], // Only fetch regular (non-special) events
            singleEvents: true, // Expand recurring events into single instances
            timeMin: start.toISOString(), // Start of the time range (inclusive)
            timeMax: end.toISOString(), // End of the time range (exclusive)
            maxResults: 2500, // Limit the number of returned events (max allowed by Google)
            auth: oAuthClient, // OAuth2 client for authenticating the API call
        })

        // Process and format the events
        return (
            events.data.items
            ?.map(event => {
                // Handle all-day events (no specific time, just a date)
                if (event.start?.date && event.end?.date) {
                return {
                    start: startOfDay(new Date(event.start.date)), // Set time to 00:00 of the start date
                    end: endOfDay(new Date(event.end.date)),       // Set time to 23:59 of the end date
                    summary: event.summary,// added for testing
                    description: event.description, // added for testing
                }
                }
        
                // Handle timed events with exact start and end date-times
                if (event.start?.dateTime && event.end?.dateTime) {
                return {
                    start: new Date(event.start.dateTime), // Convert to JavaScript Date object
                    end: new Date(event.end.dateTime),     // Convert to JavaScript Date object
                    summary: event.summary,// added for testing
                    description: event.description, // added for testing
                }
                }
        
                // Ignore events that are missing required time data
                return undefined
            })
            // Filter out any undefined results and enforce correct typing
            .filter((date) => date !== undefined) || []
        )  



    } catch (err) {
        throw new Error(`Failed to fetch calendar events: ${err.message || err}`)

    }

}

// this handler is needed when using the pages router in Next.js

export default async function handler(req, res) {
  try {
    const { clerkUserId, start, end } = req.query;

    if (!clerkUserId || !start || !end) {
      return res.status(400).json({ error: "Missing required query parameters." });
    }

    const events = await getCalendarEventTimes(clerkUserId, new Date(start), new Date(end));
    res.status(200).json({ events });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}