# TeamTreeHouseProject12 Capstone Project


## Justin's Route Calculator

This is an application to allow a user to select locations using google maps. The user selects a location to start from, a location to end at, and multiple locations in between. The application will then calculate the shortest possible trip with the given input. Once the route has been calculated. It will then render the route, broken into instructions. If you wish, you may save your phone number to the account, and then text the instructions to your phone, along with google map routes for each linked destination.

In order to begin using this application, Please login and authenticate using Googles OAuth V2. This is to ensure that no malicious api calls may be requested against my server, as I have rate limiting. Users may make up to 100 API requests every 15 minutes. However, May only make 5 requests using third party services, every 5 minutes.

IMPORTANT NOTES:
This project relies on a third party algorithm. However, upon developing, it appears this algorithm has some caveats.The algorithm has a bug where it will not calculate the route at times.

As far as I can tell, at this moment, it appears to be from over using the algorithm. If this happens, you will have to wait for the limiting to pass. at this time, I have no plans to implement this algorithm, however, if it is requested. I may do it as another fun project!
